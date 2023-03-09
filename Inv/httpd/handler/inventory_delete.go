package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InventoryDelete(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
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

		// Get the item ID from the URL parameter.
		itemIDStr := c.GetHeader("id")
		itemID, err := strconv.Atoi(itemIDStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
			return
		}

		// Check if the item belongs to the user.
		var item Item
		if result := db.Table("items").Where("item_id = ? AND user = ?", itemID, getUsernameFromToken(token, db)).First(&item); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Item not found"})
			return
		}

		// Delete the item.
		if result := db.Table("items").Delete(&item); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete item"})
			return
		}

		c.Status(http.StatusNoContent)

	}
}

//////////TODO ADD CONTAINERS
