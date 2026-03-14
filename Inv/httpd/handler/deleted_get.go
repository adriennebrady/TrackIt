package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func DeletedGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.MustGet("username").(string)

		var locIDs []int
		if result := db.Table("containers").Where("username = ?", username).Distinct("LocID").Pluck("LocID", &locIDs); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get LocIDs"})
			return
		}

		var items []RecentlyDeletedItem
		if result := db.Table("recently_deleted_items").Where("account_id = ? AND LocID IN (?)", username, locIDs).Find(&items); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get items"})
			return
		}

		c.JSON(http.StatusOK, items)
	}
}
