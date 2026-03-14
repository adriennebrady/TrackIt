package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ExportResponse struct {
	Containers []Container `json:"containers"`
	Items      []Item      `json:"items"`
}

func ExportGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.MustGet("username").(string)

		var containers []Container
		if result := db.Table("containers").Where("username = ?", username).Find(&containers); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to export containers"})
			return
		}

		var items []Item
		if result := db.Table("items").Where("username = ?", username).Find(&items); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to export items"})
			return
		}

		c.JSON(http.StatusOK, ExportResponse{Containers: containers, Items: items})
	}
}
