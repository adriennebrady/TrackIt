package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ItemsGet(db *gorm.DB) gin.HandlerFunc {
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

		// Get all items that are in the requested container.
		var items []Item
		if result := db.Table("Items").Where("locID = ?", Container_id).Find(&items); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get items"})
			return
		}

		c.JSON(http.StatusOK, items)
	}
}
