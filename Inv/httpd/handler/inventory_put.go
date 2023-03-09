package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InventoryPut(db *gorm.DB) gin.HandlerFunc {
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

		requestBody := InvRequest{}
		c.Bind(&requestBody)
		
		if requestBody.Kind == "Container" {
			// Look up the container in the database by ID.
			var container Container
			result := db.First(&container, "LocID = ?", requestBody.ID)
			if result.Error != nil {
				c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Container not found"})
				return
			}

			// Update the container's name or location if requested.
			if requestBody.Type == "Rename" {
				container.Name = requestBody.Name
			} else if requestBody.Type == "Relocate" {
				container.ParentID = requestBody.Cont
			}

			// Save the changes to the database.
			result = db.Save(&container)
			if result.Error != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
				return
			}

		} else if requestBody.Kind == "Item" {
			// Look up the item in the database by ID.
			var item Item
			result := db.First(&item, "item_id = ?", requestBody.ID)
			if result.Error != nil {
				c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Item not found"})
				return
			}

			// Update the item's name or location if requested.
			if requestBody.Type == "Rename" {
				item.ItemName = requestBody.Name
			} else if requestBody.Type == "Relocate" {
				item.LocID = requestBody.Cont
			}

			// Save the changes to the database.
			result = db.Save(&item)
			if result.Error != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
				return
			}

		} else {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid Kind"})
			return
		}

		c.Status(http.StatusNoContent)

	}
}

/*
await fetch('/inventory', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
        Name: 'brush',
        Location: 'closet',
        Type: 'Relocate'
    })
})
*/
