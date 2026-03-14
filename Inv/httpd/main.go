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
	r.ForwardedByClientIP = true
	r.SetTrustedProxies([]string{"127.0.0.1"})

	api := r.Group("/api")

	// Public routes — no token required
	api.GET("/ping", handler.PingGet())
	api.POST("/login", handler.LoginPost(db))
	api.POST("/register", handler.RegisterPost(db))

	// Protected routes — AuthMiddleware validates token and sets "username" in context
	auth := api.Group("/")
	auth.Use(handler.AuthMiddleware(db))
	{
		auth.GET("/name", handler.NameGet(db))
		auth.GET("/items", handler.ItemsGet(db))
		auth.GET("/containers", handler.ContainersGet(db))
		auth.GET("/deleted", handler.DeletedGet(db))
		auth.GET("/tree", handler.TreeGet(db))
		auth.GET("/export", handler.ExportGet(db))
		auth.GET("/lowstock", handler.LowStockGet(db))
		auth.POST("/search", handler.SearchGet(db))
		auth.POST("/inventory", handler.InventoryPost(db))
		auth.PUT("/inventory", handler.InventoryPut(db))
		auth.DELETE("/inventory", handler.InventoryDelete(db))
		auth.DELETE("/account", handler.AccountDelete(db))
		auth.DELETE("/deleted", handler.DeleteDelete(db))
	}

	r.Run(":8080")
}
