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
		var request RegisterRequest
		if err := c.BindJSON(&request); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		var count int64
		if result := DB.Table("accounts").Where("username = ?", request.Username).Count(&count); result.Error == nil && count > 0 {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
			return
		}

		if request.Password != request.PasswordConfirmation {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Password and password confirmation do not match"})
			return
		}

		newUser := Account{
			Username: request.Username,
			Password: HashAndSalt([]byte(request.Password)),
		}

		newContainer := Container{
			Name:     newUser.Username + "'s container",
			ParentID: 0,
			User:     newUser.Username,
		}

		token := GenerateToken()
		session := DeviceSession{
			Username: newUser.Username,
			Token:    token,
			LastUsed: time.Now(),
		}

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
		if result := tx.Table("accounts").Where("username = ?", newUser.Username).Update("rootLoc", newContainer.LocID); result.Error != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user's RootLoc"})
			return
		}
		if result := tx.Create(&session); result.Error != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
			return
		}

		tx.Commit()

		response := LoginResponse{Token: token, RootLoc: newContainer.LocID}
		c.JSON(http.StatusOK, response)
	}
}

// HashAndSalt hashes a password using bcrypt with cost 12.
func HashAndSalt(password []byte) string {
	hash, err := bcrypt.GenerateFromPassword(password, 12) // bumped from DefaultCost (10) to 12
	if err != nil {
		return ""
	}
	return string(hash)
}
