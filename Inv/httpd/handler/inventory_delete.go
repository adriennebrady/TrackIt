package handler

import (
	"Trackit/Inv/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InventoryDelete(inv inventory.Deleter, db *gorm.DB) gin.HandlerFunc {
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

		inv.Delete(requestBody.Name)
		c.Status(http.StatusNoContent)

	}
}
