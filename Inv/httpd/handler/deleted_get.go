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

		// Get all items that are in the requested container.
		var items []RecentlyDeletedItem
		if result := db.Table("recently_deleted_items").Where("account_id = ?", username).Find(&items); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get items"})
			return
		}

		c.JSON(http.StatusOK, items)
	}
}
