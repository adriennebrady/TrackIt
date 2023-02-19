package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type GetRequest struct {
	Authorization string `json:"Authorization"`
	Container_id  int    `json:"Container_id"`
}

func InventoryGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := GetRequest{}
		c.Bind(&requestBody)

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

		// Get all containers that have the requested container as their parent.
		var containers []Container
		if result := db.Table("containers").Where("parent_id = ?", requestBody.Container_id).Find(&containers); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get containers"})
			return
		}

		// Get all items that are in the requested container.
		var items []Item
		if result := db.Table("items").Where("loc_id = ?", requestBody.Container_id).Find(&items); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get items"})
			return
		}

		// Merge the containers and items into a single slice.
		var results []interface{}
		for _, container := range containers {
			results = append(results, container)
		}
		for _, item := range items {
			results = append(results, item)
		}

		c.JSON(http.StatusOK, results)
	}
}

func isValidToken(authHeader string, db *gorm.DB) bool {

	token := strings.TrimPrefix(authHeader, "Bearer ")
	// Query the database for a user with the given token.
	var user Account
	if err := db.Table("Accounts").Where("token = ?", token).First(&user).Error; err != nil {
		// If no user with the token is found, return false.
		return false
	}
	return user.Token == token
}

func getUsernameFromToken(token string, db *gorm.DB) string {
	var account Account
	if err := db.Table("accounts").Where("token = ?", token).First(&account).Error; err != nil {
		return ""
	}
	return account.Username
}

//TODO add backend accounts  to assign inventories to
//////////////TODO lock inventories behind username they must have access for
//////////////TODO allow users to delete accounts

//TODO possibly salt/encrypt the password
//TODO switch temporary data to frontend, switch backend storage to db
//TODO parse urls to figure what container we're in
//TODO bonus:be able to search for an item
//TODO bonus::connect to angular///////////////////////////////////////////////////////////
