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
		if err := c.BindJSON(&requestBody); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		// Verify that the token is valid.
		var username string
		if username = isValidToken(requestBody.Authorization, db); username == "" {
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
