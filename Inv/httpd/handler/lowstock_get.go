package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func LowStockGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		var username string
		if username = IsValidToken(token, db); username == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

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
