package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

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

		if err := destroyContainer(DB, existingUser.RootLoc, existingUser.Username); err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			tx.Rollback()
			return
		}

		// Delete the account.
		if result := DB.Table("accounts").Delete(&existingUser); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Couldn't delete account"})
			tx.Rollback()
			return
		}

		// Commit the transaction.
		tx.Commit()

		c.JSON(http.StatusNoContent, nil)
	}
}
