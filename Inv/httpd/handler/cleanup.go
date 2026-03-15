// Inv/httpd/handler/cleanup.go
package handler

import (
	"time"

	"gorm.io/gorm"
)

// PruneExpiredData removes stale sessions and recently deleted items older than 30 days.
func PruneExpiredData(db *gorm.DB, username string) {
	db.Where("last_used < ? AND username = ?",
		time.Now().Add(-30*24*time.Hour), username).
		Delete(&DeviceSession{})

	db.Where("Timestamp < ?",
		time.Now().Add(-30*24*time.Hour)).
		Delete(&RecentlyDeletedItem{})
}
