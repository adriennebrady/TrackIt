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

func RegisterPost(DB *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Parse the request body.
		var request RegisterRequest
		if err := c.BindJSON(&request); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		// Check if the user exists.
		var existingUser User
		if result := DB.Table("accounts").Where("username = ?", request.Username).First(&existingUser); result.Error == nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
			return
		}

		// Check if the password is correct.
		if request.Password != request.PasswordConfirmation {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Password and password confirmation do not match"})
			return
		}

		// Create a new user object with the provided username and password.
		newUser := User{
			Username: request.Username,
			Password: request.Password,
			Token:    generateToken(),
		}
		if result := DB.Table("accounts").Create(&newUser); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}

		// Return the token to the user.
		response := LoginResponse{Token: newUser.Token}
		c.JSON(http.StatusOK, response)
	}
}
