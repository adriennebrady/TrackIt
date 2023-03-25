package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type GetRequest struct {
	Authorization string `json:"Authorization"`
	Container_id  int    `json:"Container_id"`
}

func NameGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
			return
		}

		// Verify that the token is valid.
		var username string
		if username = isValidToken(token, db); username == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		containerIDStr := c.Query("Container_id")
		containerID, err := strconv.Atoi(containerIDStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid container ID"})
			return
		}

		var names string
		if result := db.Table("Containers").Select("name").Where("LocID = ? AND username = ?", containerID, username).Scan(&names); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get container"})
			return
		}

		c.JSON(http.StatusOK, names)
	}
}
