package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AccountDelete(DB *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.MustGet("username").(string)

		var request RegisterRequest
		if err := c.BindJSON(&request); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		// Still verify the password as a second factor before deleting the account
		var existingUser Account
		if result := DB.Table("accounts").Where("username = ?", username).First(&existingUser); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "User does not exist"})
			return
		}

		if request.Password != request.PasswordConfirmation {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Password and password confirmation do not match"})
			return
		}

		if !ComparePasswords(existingUser.Password, []byte(request.Password)) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
			return
		}

		tx := DB.Begin()

		if result := tx.Table("items").Where("username = ?", username).Delete(&Item{}); result.Error != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": result.Error})
			return
		}
		if result := tx.Table("containers").Where("username = ?", username).Delete(&Container{}); result.Error != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": result.Error})
			return
		}
		if result := tx.Table("recently_deleted_items").Where("account_id = ?", username).Delete(&RecentlyDeletedItem{}); result.Error != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": result.Error})
			return
		}
		if result := tx.Table("accounts").Delete(&existingUser); result.Error != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusNotAcceptable, gin.H{"error": "Couldn't delete account"})
			return
		}

		tx.Commit()
		c.JSON(http.StatusNoContent, nil)
	}
}
