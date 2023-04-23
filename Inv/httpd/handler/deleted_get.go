package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func DeletedGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Verify that the token is valid.
		token := c.GetHeader("Authorization")
		// Verify that the token is valid.
		var username string
		if username = IsValidToken(token, db); username == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// Get all unique LocIDs from the containers table for the given accountname.
		var locIDs []int
		if result := db.Table("containers").Where("username = ?", username).Distinct("LocID").Pluck("LocID", &locIDs); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get LocIDs"})
			return
		}

		// Get all recently deleted items that have one of the unique LocIDs for the given accountname.
		var items []RecentlyDeletedItem
		if result := db.Table("recently_deleted_items").Where("account_id = ? AND LocID IN (?)", username, locIDs).Find(&items); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get items"})
			return
		}

		c.JSON(http.StatusOK, items)
	}
}
