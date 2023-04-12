package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NameGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
			return
		}

		// Verify that the token is valid.
		var username string
		if username = IsValidToken(token, db); username == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		containerID, err := strconv.Atoi(c.Query("Container_id"))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusNotAcceptable, gin.H{"error": "Invalid/Missing container ID"})
			return
		}

		// Retrieve the container with the specified ID and username.
		var container Container
		if result := db.Table("Containers").Where("LocID = ? AND username = ?", containerID, username).First(&container); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get container"})
			return
		}

		// Add the name of the current container to the response.
		names := container.Name
		var name string
		ParentID := container.ParentID

		maxIterations := 10 // Set a maximum number of iterations
		for i := 0; ParentID != 0 && i < maxIterations; i++ {
			if name, ParentID = GetParent(db, ParentID); name == "" {
				c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Container not found"})
				return
			}
			names = name + "/" + names
		}

		c.JSON(http.StatusOK, names)
	}
}

func GetParent(db *gorm.DB, LocID int) (string, int) {
	// Look up the container in the database by ID.
	var container Container
	query := db.Table("Containers").Where("LocID = ?", LocID)
	if err := query.First(&container).Error; err != nil {
		return "", 0
	}

	return container.Name, container.ParentID
}
