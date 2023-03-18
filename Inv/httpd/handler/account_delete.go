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

		// Check if the password is correct.
		if request.Password != request.PasswordConfirmation {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Password and password confirmation do not match"})
			return
		}

		// Start a new transaction to ensure atomicity.
		tx := DB.Begin()

		if err := destroyUserResources(DB, existingUser); err != nil {
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

func destroyUserResources(DB *gorm.DB, user Account) error {
	if err := destroyContainer(DB, user.RootLoc); err != nil {
		return err
	}

	return nil
}
