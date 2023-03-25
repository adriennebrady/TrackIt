package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type GetRequest struct {
	Authorization string `json:"Authorization"`
	Container_id  int    `json:"Container_id"`
}

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
		var username string
		if username := isValidToken(token, db); username != "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		var names string
		if result := db.Table("Containers").Where("LocID = ? AND username = ?", requestBody.Container_id, username).First(&names); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get container"})
			return
		}

		c.JSON(http.StatusOK, names)
	}
}
