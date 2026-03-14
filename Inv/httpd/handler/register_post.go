package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func RegisterPost(DB *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Parse the request body.
		var request RegisterRequest
		if err := c.BindJSON(&request); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		// Check if the user exists.
		var count int64
		if result := DB.Table("accounts").Where("username = ?", request.Username).Count(&count); result.Error == nil && count > 0 {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
			return
		}

		// Check if the password is correct.
		if request.Password != request.PasswordConfirmation {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Password and password confirmation do not match"})
			return
		}

		// Create a new user object with the provided username and password.
		newUser := Account{
			Username: request.Username,
			Password: HashAndSalt([]byte(request.Password)),
		}

		newContainer := Container{
			Name:     newUser.Username + "'s container",
			ParentID: 0,
			User:     newUser.Username,
		}

		var token = GenerateToken()
		session := DeviceSession{
			Username: newUser.Username,
			Token:    token,
			LastUsed: time.Now(),
		}

		// Save the new session.
		if result := DB.Create(&session); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
			return
		}

		// Start a new transaction to ensure atomicity.
		tx := DB.Begin()

		if result := tx.Table("accounts").Create(&newUser); result.Error != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}
		if result := tx.Table("containers").Create(&newContainer); result.Error != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create container"})
			return
		}

		// At this point newContainer.LocID has the DB-assigned ID
		if result := tx.Table("accounts").
			Where("username = ?", newUser.Username).
			Update("rootLoc", newContainer.LocID); result.Error != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user's RootLoc"})
			return
		}

		tx.Commit()

		response := LoginResponse{Token: token, RootLoc: newContainer.LocID}
		c.JSON(http.StatusOK, response)
	}
}

// HashAndSalt hashes a plaintext password using bcrypt with DefaultCost (10).
func HashAndSalt(password []byte) string {
	hash, err := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost) // was bcrypt.MinCost (4)
	if err != nil {
		println(err)
		return ""
	}
	return string(hash)
}
