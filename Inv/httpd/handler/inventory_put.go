package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InventoryPut(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := InvRequest{}
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

		if requestBody.Kind == "Container" {
			if message := ContainerPut(requestBody, db, username); message != "" {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
				return
			}
		} else if requestBody.Kind == "Item" {
			// Look up the item in the database by ID.
			var item Item
			result := db.First(&item, "item_id = ? AND username = ?", requestBody.ID, username)
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

func ContainerPut(requestBody InvRequest, db *gorm.DB, username string) string {
	// Look up the container in the database by ID.
	var container Container
	result := db.First(&container, "LocID = ? AND username = ?", requestBody.ID, username)
	if result.Error != nil {
		return "Container not found"
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
		return "Database error"
	}

	return ""
}
