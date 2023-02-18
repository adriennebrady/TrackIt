package handler

import (
	"Trackit/Inv/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var db *gorm.DB
var err error

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

func isValidToken(authHeader string) bool {
	/*
		token := strings.TrimPrefix(authHeader, "Bearer ")
			// Query the database for a user with the given token.
			var user User
			if err := db.Where("token = ?", token).First(&user).Error; err != nil {
				// If no user with the token is found, return false.
				return false
			}
		return user.Token == token
	*/
	// If a user with the token is found, return true.
	return true
}

//TODO add backend accounts  to assign inventories to
//////////////TODO lock inventories behind username they must have access for
//////////////TODO allow users to delete accounts

//TODO switch temporary data to frontend, switch backend storage to db
//TODO parse urls to figure what container we're in
//TODO bonus:be able to search for an item
//TODO bonus::connect to angular///////////////////////////////////////////////////////////
