package handler

import (
	"Trackit/Inv/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InventoryGet(inv inventory.Getter) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
			return
		}

		// Verify that the token is valid.
		if !isValidToken(token) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// If the token is valid, return the inventory data.
		results := inv.GetAll()
		c.JSON(http.StatusOK, results)

	}
}

func isValidToken(token string) bool {
	// Here you would need to implement a function that verifies the token against your database.
	// For example, you could query your users table to check if the token is present and still valid.
	// If the token is valid, return true, otherwise return false.
	return true
}

//TODO add backend accounts  to assign inventories to
//////////////TODO lock inventories behind username they must have access for
//////////////TODO allow users to delete accounts

//TODO add containers/traversing them
//TODO parse urls to figure what container we're in

//TODO bonus:be able to search for an item
//TODO bonus::connect to angular///////////////////////////////////////////////////////////
