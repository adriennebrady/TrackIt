package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DeleteRequest struct {
	Token string `json:"token"`
	ID    int    `json:"id"`
	Type  string `json:"type"`
}

// recently delete
type RecentlyDeletedItem struct {
	ItemID       		int    `gorm:"primaryKey"`
	AccountID           string
	DeletedItemName     string `gorm:"column:itemName"`
	DeletedItemLocation int    `gorm:"column:LocID"`
	DeletedItemCount    int    `gorm:"column:count"`
	Timestamp           time.Time
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

		switch requestBody.Type {
		case "item":
			if err := DeleteItem(db, requestBody.ID, username); err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		case "container": // Delete all items and sub-containers associated with the container.
			if err := DestroyContainer(db, requestBody.ID, username); err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		default:
			{
				c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid type"})
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


	// Create a new RecentlyDeletedItem object with the deleted item's ID and the current timestamp.
	deletedItem := RecentlyDeletedItem{
		ItemID:       		 item.ItemID,
		AccountID:           username,
		DeletedItemName:     item.ItemName,
		DeletedItemLocation: item.LocID,
		DeletedItemCount:    item.Count,
		Timestamp:           time.Now(),
	}

	// Delete the item.
	if result := db.Table("items").Delete(&item); result.Error != nil {
		return result.Error
	}
	

	// Save the RecentlyDeletedItem object to the database.
	if result := db.Table("recently_deleted_items").Create(&deletedItem); result.Error != nil {
		return result.Error
	}

	// Delete old recently deleted items.
	if result := db.Where("Timestamp < ?", time.Now().Add(-30*24*time.Hour)).Delete(&RecentlyDeletedItem{}); result.Error != nil {
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


/*
The DestroyContainer function expects the ID of a top-level container to be passed in as an argument, but there is no validation that the container is actually a top-level container. If an ID of a non-top-level container is passed in, the function will delete all items and sub-containers associated with that container, but leave the container itself intact.

The DestroyContainer function deletes all items and sub-containers associated with the specified container without checking if they belong to the user. If an attacker has access to another user's token, they could use this endpoint to delete items and containers belonging to that user.

*/
