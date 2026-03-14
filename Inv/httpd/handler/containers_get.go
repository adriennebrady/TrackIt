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
		username := c.MustGet("username").(string)

		containerID, err := strconv.Atoi(c.Query("container_id"))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid container ID"})
			return
		}

		var cont Container
		if result := db.Table("Containers").Where("LocID = ? AND username = ?", containerID, username).First(&cont); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid container"})
			return
		}

		var containers []Container
		if result := db.Table("Containers").Where("parentID = ?", containerID).Find(&containers); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get containers"})
			return
		}

		c.JSON(http.StatusOK, containers)
	}
}

func IsValidToken(authHeader string, db *gorm.DB) string {
	token := strings.TrimPrefix(authHeader, "Bearer ")

	var session DeviceSession
	if err := db.Table("device_sessions").
		Where("token = ?", token).
		Where("last_used > ?", time.Now().Add(-30*24*time.Hour)).
		First(&session).Error; err != nil {
		return ""
	}

	db.Model(&session).Update("last_used", time.Now())
	return session.Username
}
