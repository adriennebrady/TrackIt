package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NameGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := GetRequest{}
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

		var names string
		if result := db.Table("Containers").Where("LocID = ?", requestBody.Container_id).First(&names); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get container"})
			return
		}

		c.JSON(http.StatusOK, names)
	}
}
