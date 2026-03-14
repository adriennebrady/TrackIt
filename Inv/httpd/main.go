package main

import (
	"backend/Inv/httpd/handler"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

var db *gorm.DB
var err error

func InitializeDB() {
	db, err = gorm.Open(sqlite.Open("Inv/AllTracks.sqlite"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db.AutoMigrate(&handler.Account{})
	db.AutoMigrate(&handler.Item{})
	db.AutoMigrate(&handler.Container{})
	db.AutoMigrate(&handler.RecentlyDeletedItem{})
	db.AutoMigrate(&handler.DeviceSession{})
}

func main() {
	InitializeDB()

	r := gin.Default()
	api := r.Group("/api")

	r.ForwardedByClientIP = true
	r.SetTrustedProxies([]string{"127.0.0.1"})
	{
		api.GET("/ping", handler.PingGet())
		api.GET("/name", handler.NameGet(db))
		api.GET("/items", handler.ItemsGet(db))
		api.GET("/containers", handler.ContainersGet(db))
		api.GET("/deleted", handler.DeletedGet(db))
		api.GET("/tree", handler.TreeGet(db))
		api.GET("/export", handler.ExportGet(db))
		api.GET("/lowstock", handler.LowStockGet(db))
		api.POST("/login", handler.LoginPost(db))
		api.POST("/search", handler.SearchGet(db))
		api.POST("/register", handler.RegisterPost(db))
		api.POST("/inventory", handler.InventoryPost(db))
		api.PUT("/inventory", handler.InventoryPut(db))
		api.DELETE("/inventory", handler.InventoryDelete(db))
		api.DELETE("/account", handler.AccountDelete(db))
		api.DELETE("/deleted", handler.DeleteDelete(db))
	}

	r.Run(":8080")
}
