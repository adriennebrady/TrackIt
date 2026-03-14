package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func DeleteDelete(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.MustGet("username").(string)

		requestBody := DeleteRequest{}
		if err := c.BindJSON(&requestBody); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		var recentlyDeletedItem RecentlyDeletedItem
		if result := db.Table("recently_deleted_items").Where("item_id = ? AND account_id = ?", requestBody.ID, username).First(&recentlyDeletedItem); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get item"})
			return
		}

		if result := db.Table("recently_deleted_items").Delete(&recentlyDeletedItem); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Couldn't delete item"})
			return
		}

		c.Status(http.StatusNoContent)
	}
}
