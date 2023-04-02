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
		if username = IsValidToken(requestBody.Authorization, db); username == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		switch requestBody.Kind {
		case "Container":
			if message := ContainerPut(requestBody, db, username); message != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": message})
				return
			}
		case "Item":
			if message := ItemPut(requestBody, db, username); message != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": message})
				return
			}
		default:
			{
				c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid Kind"})
				return
			}
		}
	}
}

func ContainerPut(requestBody InvRequest, db *gorm.DB, username string) *string {
	// Look up the container in the database by ID.
	var container Container
	result := db.First(&container, "LocID = ? AND username = ?", requestBody.ID, username)
	if result.Error != nil {
		message := "Container not found"
		return &message
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
		message := "Database error"
		return &message
	}

	return nil
}

func ItemPut(requestBody InvRequest, db *gorm.DB, username string) *string {
	// Look up the item in the database by ID.
	var item Item
	result := db.First(&item, "ItemID = ? AND username = ?", requestBody.ID, username)
	if result.Error != nil {
		message := "Item not found"
		return &message
	}

	// Update the item's name or location if requested.
	if requestBody.Type == "Rename" {
		item.ItemName = requestBody.Name
	} else if requestBody.Type == "Relocate" {
		item.LocID = requestBody.Cont
	} else if requestBody.Type == "Recount" { //change count
		item.Count = requestBody.Count
	}

	// Save the changes to the database.
	result = db.Save(&item)
	if result.Error != nil {
		message := "Database error"
		return &message
	}
	return nil
}
