package handler

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InventoryGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		// Verify that the token is valid.
		var username string
		if username = isValidToken(token, db); username == "" {
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
		if result := db.Table("items").Where("LocID = ? AND username = ?", Container_id, username).First(&cont); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid container"})
			return
		}

		// Get all containers that have the requested container as their parent.
		var containers []Container
		if result := db.Table("Containers").Where("parentID = ? ", Container_id).Find(&containers); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get containers"})
			return
		}

		// Get all items that are in the requested container.
		var items []Item
		if result := db.Table("Containers").Where("locID = ?", Container_id).Find(&items); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get items"})
			return
		}

		// Merge the containers and items into a single slice.
		var results []interface{}
		for _, container := range containers {
			results = append(results, container)
		}
		for _, item := range items {
			results = append(results, item)
		}

		c.JSON(http.StatusOK, results)
	}
}

func isValidToken(authHeader string, db *gorm.DB) string {

	token := strings.TrimPrefix(authHeader, "Bearer ")
	// Query the database for a user with the given token.
	var user Account
	if err := db.Table("Accounts").Where("token = ?", token).First(&user).Error; err != nil {
		// If no user with the token is found, return false.
		return ""
	}

	return user.Username
}
