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

type Account struct {
	Username string `gorm:"primaryKey"`
	Password string
	RootLoc  int `gorm:"column:rootLoc"`
}

type Item struct {
	ItemID   int    `gorm:"primaryKey;column:ItemID"`
	User     string `gorm:"column:username"`
	ItemName string `gorm:"column:itemName"`
	LocID    int    `gorm:"column:LocID"`
	Count    int    `gorm:"column:count"`
}

type Container struct {
	LocID    int `gorm:"primaryKey;column:LocID"`
	Name     string
	ParentID int    `gorm:"column:ParentID"`
	User     string `gorm:"column:username"`
}

type DeviceSession struct {
	ID       int `gorm:"primaryKey;autoIncrement"`
	Username string
	Token    string `gorm:"uniqueIndex"`
	LastUsed time.Time
	DeviceID string // Optional: could be used to identify different devices
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token   string `json:"token"`
	RootLoc int    `json:"LocID"`
}

func LoginPost(DB *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var request LoginRequest
		if err := c.BindJSON(&request); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		// Check if the user exists
		var user Account
		if result := DB.Table("accounts").Where("username = ?", request.Username).First(&user); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			return
		}

		// Check if the password is correct
		if !ComparePasswords(user.Password, []byte(request.Password)) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			return
		}

		// Generate a new token for this device
		newToken := GenerateToken()

		// Create a new session
		session := DeviceSession{
			Username: user.Username,
			Token:    newToken,
			LastUsed: time.Now(),
			// Optionally add device identification here if needed
		}

		// Save the new session
		if result := DB.Create(&session); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
			return
		}

		// Clean up old sessions (optional: remove sessions not used in the last 30 days)
		DB.Where("last_used < ? AND username = ?",
			time.Now().Add(-30*24*time.Hour),
			user.Username).Delete(&DeviceSession{})

		// Delete old recently deleted items
		if result := DB.Where("Timestamp < ?",
			time.Now().Add(-30*24*time.Hour)).Delete(&RecentlyDeletedItem{}); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError,
				gin.H{"error": "Error deleting old items"})
			return
		}

		// Return the token to the user
		response := LoginResponse{Token: newToken, RootLoc: user.RootLoc}
		c.JSON(http.StatusOK, response)
	}
}

func GenerateToken() string {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return fmt.Sprintf("%x", b)
}

func ComparePasswords(hashedPwd string, plainPwd []byte) bool {
	byteHash := []byte(hashedPwd)
	err := bcrypt.CompareHashAndPassword(byteHash, plainPwd)
	if err != nil {
		println(err)
		return false
	}
	return true
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

		// Update last used time
		DB.Model(&session).Update("last_used", time.Now())

		// Add the username to the context for use in other handlers
		c.Set("username", session.Username)
		c.Next()
	}
}
