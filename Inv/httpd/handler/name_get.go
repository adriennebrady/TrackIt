package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NameGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.MustGet("username").(string)

		containerID, err := strconv.Atoi(c.Query("Container_id"))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusNotAcceptable, gin.H{"error": "Invalid/Missing container ID"})
			return
		}

		var container Container
		if result := db.Table("Containers").Where("LocID = ? AND username = ?", containerID, username).First(&container); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get container"})
			return
		}

		names := container.Name
		var name string
		parentID := container.ParentID

		for i := 0; parentID != 0 && i < 10; i++ {
			if name, parentID = GetParent(db, parentID); name == "" {
				c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Container not found"})
				return
			}
			names = name + "/" + names
		}

		c.JSON(http.StatusOK, names)
	}
}

func GetParent(db *gorm.DB, locID int) (string, int) {
	var container Container
	if err := db.Table("Containers").Where("LocID = ?", locID).First(&container).Error; err != nil {
		return "", 0
	}
	return container.Name, container.ParentID
}
