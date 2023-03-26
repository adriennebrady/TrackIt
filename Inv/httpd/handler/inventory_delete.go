package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DeleteRequest struct {
	Token string `json:"token"`
	Type  string `json:"type"`
	ID    int    `json:"id"`
}

// recently delete
type RecentlyDeletedItem struct {
	AccountID     string
	DeletedItemID int `gorm:"primaryKey"`
	Timestamp     time.Time
}

func InventoryDelete(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		requestBody := DeleteRequest{}
		if err := c.BindJSON(&requestBody); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		// Verify that the token is valid.
		var username string
		if username = IsValidToken(requestBody.Token, db); username == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		if requestBody.Type != "item" && requestBody.Type != "container" {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid type"})
			return
		}

		if requestBody.Type == "item" {
			if err := DeleteItem(db, requestBody.ID, username); err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		} else if requestBody.Type == "container" {
			// Delete all items and sub-containers associated with the container.
			if err := DestroyContainer(db, requestBody.ID, username); err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

		}

		c.Status(http.StatusNoContent)

	}
}

func DeleteItem(db *gorm.DB, id int, username string) error {
	// Check if the item belongs to the user.
	var item Item
	if result := db.Table("items").Where("ItemID = ? AND username = ?", id, username).First(&item); result.Error != nil {
		return result.Error
	}

	// Delete the item.
	if result := db.Table("items").Delete(&item); result.Error != nil {
		return result.Error
	}

	// Create a new RecentlyDeletedItem object with the deleted item's ID and the current timestamp.
	deletedItem := RecentlyDeletedItem{
		AccountID:     username,
		DeletedItemID: item.ItemID,
		Timestamp:     time.Now(),
	}

	// Save the RecentlyDeletedItem object to the database.
	if result := db.Table("recently_deleted_items").Create(&deletedItem); result.Error != nil {
		return result.Error
	}

	// Delete the item.
	if result := db.Table("items").Delete(&item); result.Error != nil {
		return result.Error
	}

	return nil
}

func DestroyContainer(db *gorm.DB, locID int, username string) error {
	// Look up the container in the database by ID.
	var container Container
	if result := db.First(&container, "LocID = ? AND username = ?", locID, username); result.Error != nil {
		return result.Error
	}

	// Delete all items inside the container and any sub-containers.
	if result := db.Table("items").Where("LocID = ? OR LocID IN (SELECT LocID FROM containers WHERE ParentID = ?)", locID, locID).Delete(&Item{}); result.Error != nil {
		return result.Error
	}

	// Delete all containers inside the container and any sub-containers.
	if result := db.Table("containers").Where("ParentID = ?", locID).Delete(&Container{}); result.Error != nil {
		return result.Error
	}

	// Delete the container.
	if result := db.Table("containers").Delete(&container); result.Error != nil {
		return result.Error
	}

	return nil
}

func destroyContainer(db *gorm.DB, locID int, username string) error {
	// Look up the container in the database by ID.
	var container Container
	if result := db.First(&container, "LocID = ? AND username = ?", locID, username); result.Error != nil {
		return result.Error
	}

	// Use a recursive CTE to delete all containers and sub-containers in a single query.
	query := `
		WITH RECURSIVE cte AS (
			SELECT LocID FROM containers WHERE LocID = ?
			UNION ALL
			SELECT LocID FROM containers WHERE ParentID IN (SELECT LocID FROM cte)
		)
		DELETE FROM items WHERE LocID IN (SELECT LocID FROM cte);
		DELETE FROM containers WHERE LocID IN (SELECT LocID FROM cte);
	`

	if result := db.Exec(query, locID); result.Error != nil {
		return result.Error
	}

	return nil
}

/*
The DestroyContainer function expects the ID of a top-level container to be passed in as an argument, but there is no validation that the container is actually a top-level container. If an ID of a non-top-level container is passed in, the function will delete all items and sub-containers associated with that container, but leave the container itself intact.

The DestroyContainer function deletes all items and sub-containers associated with the specified container without checking if they belong to the user. If an attacker has access to another user's token, they could use this endpoint to delete items and containers belonging to that user.

*/
