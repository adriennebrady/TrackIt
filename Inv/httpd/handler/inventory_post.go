// inventory_post.go
package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// normalizeKind ensures consistent casing for POST requests
func normalizeKind(kind string) string {
	switch strings.ToLower(kind) {
	case "container":
		return "container"
	case "item":
		return "item"
	default:
		return kind
	}
}

func InventoryPost(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.MustGet("username").(string)

		requestBody := InvRequest{}
		if err := c.ShouldBindJSON(&requestBody); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		// Normalize Kind casing
		requestBody.Kind = normalizeKind(requestBody.Kind)

		switch requestBody.Kind {
		case "container":
			newContainer := Container{
				LocID:    requestBody.ID,
				Name:     requestBody.Name,
				ParentID: requestBody.Cont,
				User:     username,
			}
			if result := db.Table("containers").Create(&newContainer); result.Error != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create container"})
				return
			}
		case "item":
			newItem := Item{
				ItemID:   requestBody.ID,
				User:     username,
				ItemName: requestBody.Name,
				LocID:    requestBody.Cont,
				Count:    requestBody.Count,
			}
			if result := db.Table("items").Create(&newItem); result.Error != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item"})
				return
			}
		default:
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid Kind"})
			return
		}

		c.Status(http.StatusNoContent)
	}
}
