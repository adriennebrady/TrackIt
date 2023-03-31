package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func DeleteDelete(db *gorm.DB) gin.HandlerFunc {
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

		var item Item
		if result := db.Table("recently_deleted_items").Where("account_id = ?", username).First(&item); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get items"})
			return
		}

		// Delete the item.
		if result := db.Table("recently_deleted_items").Delete(&item); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Couldn't delete item"})
			return
		}

		c.Status(http.StatusNoContent)

	}
}
