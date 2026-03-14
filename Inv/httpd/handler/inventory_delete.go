package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InventoryDelete(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := DeleteRequest{}
		if err := c.BindJSON(&requestBody); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

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
		case "container":
			if err := DestroyContainer(db, requestBody.ID, username); err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		default:
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid type"})
			return
		}

		c.Status(http.StatusNoContent)
	}
}

func DeleteItem(db *gorm.DB, id int, username string) error {
	var item Item
	if result := db.Table("items").Where("ItemID = ? AND username = ?", id, username).First(&item); result.Error != nil {
		return result.Error
	}
	if result := db.Table("items").Delete(&item); result.Error != nil {
		return result.Error
	}
	if result := db.Where("Timestamp < ?", time.Now().Add(-30*24*time.Hour)).Delete(&RecentlyDeletedItem{}); result.Error != nil {
		return result.Error
	}
	return nil
}

func DestroyContainer(db *gorm.DB, locID int, username string) error {
	var container Container
	if result := db.First(&container, "LocID = ? AND username = ?", locID, username); result.Error != nil {
		return result.Error
	}

	var subContainers []Container
	if result := db.Table("containers").Where("ParentID = ?", locID).Find(&subContainers); result.Error != nil {
		return result.Error
	}
	for _, sub := range subContainers {
		if err := DestroyContainer(db, sub.LocID, username); err != nil {
			return err
		}
	}

	if result := db.Table("items").Where("LocID = ?", locID).Delete(&Item{}); result.Error != nil {
		return result.Error
	}
	if result := db.Table("containers").Delete(&container); result.Error != nil {
		return result.Error
	}
	return nil
}
