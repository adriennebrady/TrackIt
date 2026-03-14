package handler

import (
	"net/http"
	"strings"

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
		if err := c.ShouldBindJSON(&requestBody); err != nil { // was c.Bind, no error check
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		var username string
		if username = IsValidToken(requestBody.Authorization, db); username == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		var items []Item
		if result := db.Table("items").
			Where("lower(ItemName) LIKE ? AND username = ?", "%"+strings.ToLower(requestBody.Item)+"%", username).
			Find(&items); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get items"})
			return
		}

		c.JSON(http.StatusOK, items)
	}
}
