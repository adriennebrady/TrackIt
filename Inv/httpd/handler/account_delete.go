package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RegisterRequest struct {
	Username             string `json:"username"`
	Password             string `json:"password"`
	PasswordConfirmation string `json:"password_confirmation"`
}

func AccountDelete(DB *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Parse the request body.
		var request RegisterRequest
		if err := c.BindJSON(&request); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		// Check if the user exists.
		var existingUser Account
		if result := DB.Table("accounts").Where("username = ?", request.Username).First(&existingUser); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "User does not exist"})
			return
		}

		// Check if the passwords match.
		if request.Password != request.PasswordConfirmation {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Password and password confirmation do not match"})
			return
		}

		// Check if the password is correct.
		if !ComparePasswords(existingUser.Password, []byte(request.Password)) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			return
		}

		// Start a new transaction to ensure atomicity.
		tx := DB.Begin()

		// Delete all items
		if result := tx.Table("items").Where("username = ?", existingUser.Username).Delete(&Item{}); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": result.Error})
			tx.Rollback()
			return
		}

		// Delete all containers
		if result := tx.Table("containers").Where("username = ?", existingUser.Username).Delete(&Container{}); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": result.Error})
			tx.Rollback()
			return
		}

		// Delete all containers
		if result := tx.Table("recently_deleted_items").Where("account_id = ?", existingUser.Username).Delete(&RecentlyDeletedItem{}); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": result.Error})
			tx.Rollback()
			return
		}

		// Delete the account.
		if result := tx.Table("accounts").Delete(&existingUser); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusNotAcceptable, gin.H{"error": "Couldn't delete account"})
			tx.Rollback()
			return
		}

		// Commit the transaction.
		tx.Commit()

		c.JSON(http.StatusNoContent, nil)
	}
}
