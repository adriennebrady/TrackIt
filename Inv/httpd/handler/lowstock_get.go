package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func LowStockGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.MustGet("username").(string)

		threshold, err := strconv.Atoi(c.Query("threshold"))
		if err != nil || threshold < 0 {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid or missing threshold parameter"})
			return
		}

		var items []Item
		if result := db.Table("items").
			Where("username = ? AND count <= ?", username, threshold).
			Order("count ASC").
			Find(&items); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get low stock items"})
			return
		}

		c.JSON(http.StatusOK, items)
	}
}
