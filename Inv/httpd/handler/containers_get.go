package handler

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ContainersGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		// Verify that the token is valid.
		var username string
		if username = IsValidToken(token, db); username == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// Get the container ID from the URL parameter.
		Container_id, err := strconv.Atoi(c.Query("container_id"))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid container ID"})
			return
		}

		// Check if the container belongs to the user.
		var cont Container
		if result := db.Table("Containers").Where("LocID = ? AND username = ?", Container_id, username).First(&cont); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid container"})
			return
		}

		// Get all containers that have the requested container as their parent.
		var containers []Container
		if result := db.Table("Containers").Where("parentID = ? ", Container_id).Find(&containers); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get containers"})
			return
		}

		c.JSON(http.StatusOK, containers)
	}
}

func IsValidToken(authHeader string, db *gorm.DB) string {
	token := strings.TrimPrefix(authHeader, "Bearer ")

	// Check if the token exists in the DeviceSession table and is still valid
	var session DeviceSession
	if err := db.Table("device_sessions").
		Where("token = ?", token).
		Where("last_used > ?", time.Now().Add(-30*24*time.Hour)).
		First(&session).Error; err != nil {
		// Token is invalid or expired
		return ""
	}

	// Update last used timestamp
	db.Model(&session).Update("last_used", time.Now())

	return session.Username
}
