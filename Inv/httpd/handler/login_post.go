package handler

import (
	"crypto/rand"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func LoginPost(DB *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var request LoginRequest
		if err := c.BindJSON(&request); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		var user Account
		if result := DB.Table("accounts").Where("username = ?", request.Username).First(&user); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			return
		}

		if !ComparePasswords(user.Password, []byte(request.Password)) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			return
		}

		newToken := GenerateToken()
		session := DeviceSession{
			Username: user.Username,
			Token:    newToken,
			LastUsed: time.Now(),
		}

		if result := DB.Create(&session); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
			return
		}

		DB.Where("last_used < ? AND username = ?", time.Now().Add(-30*24*time.Hour), user.Username).Delete(&DeviceSession{})

		if result := DB.Where("Timestamp < ?", time.Now().Add(-30*24*time.Hour)).Delete(&RecentlyDeletedItem{}); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Error deleting old items"})
			return
		}

		response := LoginResponse{Token: newToken, RootLoc: user.RootLoc}
		c.JSON(http.StatusOK, response)
	}
}

// GenerateToken creates a cryptographically secure 32-byte (64 hex char) token.
func GenerateToken() string {
	b := make([]byte, 32) // bumped from 16 to 32 bytes
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return fmt.Sprintf("%x", b)
}

func ComparePasswords(hashedPwd string, plainPwd []byte) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPwd), plainPwd)
	return err == nil
}

func AuthMiddleware(DB *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
			return
		}

		var session DeviceSession
		if result := DB.Where("token = ?", token).
			Where("last_used > ?", time.Now().Add(-30*24*time.Hour)).
			First(&session); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		DB.Model(&session).Update("last_used", time.Now())
		c.Set("username", session.Username)
		c.Next()
	}
}
