package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"time"
)

//recently delete
type RecentlyDeletedItem struct {
    AccountID    string
    DeletedItemID int
    Timestamp    time.Time
}

func InventoryDelete(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
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

		// Get the item ID from the URL parameter.
		itemIDStr := c.GetHeader("id")
		itemID, err := strconv.Atoi(itemIDStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
			return
		}

		// Check if the item belongs to the user.
		var item Item
		if result := db.Table("items").Where("id = ? AND username = ?", itemID, getUsernameFromToken(token, db)).First(&item); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Item not found"})
			return
		}

		// Create a new RecentlyDeletedItem object with the deleted item's ID and the current timestamp.
		deletedItem := RecentlyDeletedItem{
			AccountID:   getUsernameFromToken(token, db),
			DeletedItemID: item.ItemID,
			Timestamp:    time.Now(),
		}

		
		/*or this^
		var recentlyDeletedItem = &RecentlyDeletedItem{
			AccountID:    Account.Username, // the account that deleted the item
			DeletedItemID: deletedItem.ID,
			Timestamp:    time.Now(),
			// set any other relevant metadata fields
		}
		*/

		// Save the RecentlyDeletedItem object to the database.
		if result := db.Table("recently_deleted_items").Create(&deletedItem); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create recently deleted item"})
			return
		}

		// Delete the item.
		if result := db.Table("items").Delete(&item); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete item"})
			return
		}

		/*
		db.Create(recentlyDeletedItem)

		// update the account's recently deleted items folder ID to point to the newly created folder
		account.RecentlyDeletedItemsID = recentlyDeletedItem.ID
		db.Save(account)

		// to restore a recently deleted item, retrieve it from the recently deleted items table and insert it back into the appropriate table
		recentlyDeletedItem := &RecentlyDeletedItem{ID: recentlyDeletedItemID}
		db.First(recentlyDeletedItem)
		restoredItem := db.Table("item")// the item to be restored
		db.Create(restoredItem)

		// to permanently delete a recently deleted item, remove it from the recently deleted items table
		db.Delete(&RecentlyDeletedItem{ID: recentlyDeletedItemID})

*/
		c.Status(http.StatusNoContent)

	}
}
