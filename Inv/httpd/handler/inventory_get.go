package handler

import (
	"Trackit/Inv/platform/inventory"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InventoryGet(inv inventory.Getter, db *gorm.DB) gin.HandlerFunc {
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

		// If the token is valid, return the inventory data.
		results := inv.GetAll()
		c.JSON(http.StatusOK, results)

	}
}

func isValidToken(authHeader string, db *gorm.DB) bool {

	token := strings.TrimPrefix(authHeader, "Bearer ")
	// Query the database for a user with the given token.
	var user User
	if err := db.Where("token = ?", token).First(&user).Error; err != nil {
		// If no user with the token is found, return false.
		return false
	}
	return user.Token == token
}

//TODO add backend accounts  to assign inventories to
//////////////TODO lock inventories behind username they must have access for
//////////////TODO allow users to delete accounts

//TODO switch temporary data to frontend, switch backend storage to db
//TODO parse urls to figure what container we're in
//TODO bonus:be able to search for an item
//TODO bonus::connect to angular///////////////////////////////////////////////////////////
