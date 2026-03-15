package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InventoryPut(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.MustGet("username").(string)

		requestBody := InvRequest{}
		if err := c.BindJSON(&requestBody); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		switch requestBody.Kind {
		case "Container":
			if message := ContainerPut(requestBody, db, username); message != nil {
				// Container not found or DB error is not an auth problem
				status := http.StatusBadRequest
				if *message == "Container not found" {
					status = http.StatusNotFound
				}
				c.AbortWithStatusJSON(status, gin.H{"error": *message})
				return
			}
		case "Item":
			if message := ItemPut(requestBody, db, username); message != nil {
				status := http.StatusBadRequest
				if *message == "Item not found" {
					status = http.StatusNotFound
				}
				c.AbortWithStatusJSON(status, gin.H{"error": *message})
				return
			}
		default:
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid Kind"})
			return
		}
	}
}

func ContainerPut(requestBody InvRequest, db *gorm.DB, username string) *string {
	var container Container
	if result := db.First(&container, "LocID = ? AND username = ?", requestBody.ID, username); result.Error != nil {
		message := "Container not found"
		return &message
	}

	switch requestBody.Type {
	case "Rename":
		container.Name = requestBody.Name
	case "Relocate":
		container.ParentID = requestBody.Cont
	}

	if result := db.Save(&container); result.Error != nil {
		message := "Database error"
		return &message
	}
	return nil
}

func ItemPut(requestBody InvRequest, db *gorm.DB, username string) *string {
	var item Item
	if result := db.First(&item, "ItemID = ? AND username = ?", requestBody.ID, username); result.Error != nil {
		message := "Item not found"
		return &message
	}

	switch requestBody.Type {
	case "Rename":
		item.ItemName = requestBody.Name
	case "Relocate":
		item.LocID = requestBody.Cont
	case "Recount":
		item.Count = requestBody.Count
	case "UpdateNotes": // new
		item.Notes = requestBody.Name
	}

	if result := db.Save(&item); result.Error != nil {
		message := "Database error"
		return &message
	}
	return nil
}
