package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SearchRequest struct {
	Authorization string `json:"Authorization"`
	Item          string `json:"Item"`
}

func SearchGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := SearchRequest{}
		c.Bind(&requestBody)

		token := c.GetHeader("Authorization")
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
			return
		}

		// Verify that the token is valid.
		if !isValidToken(token, db) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// Get all items that are in the requested container.
		var items []Item
		if result := db.Table("items").Where("ItemName = ? AND username = ?", requestBody.Item, getUsernameFromToken(token, db)).Find(&items); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get items"})
			return
		}

		c.JSON(http.StatusOK, items)
	}
}
