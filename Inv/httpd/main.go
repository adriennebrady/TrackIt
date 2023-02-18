package main

import (
	"Trackit/Inv/httpd/handler"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

type Account struct { //gorm.Model?
	Username string `gorm:"primaryKey"`
	Password string
	Token    string
}

type Item struct {
	ItemID   int `gorm:"primaryKey"`
	User     string
	ItemName string
	LocID    int
	Count    int
}

type Container struct {
	LocID    int `gorm:"primaryKey"`
	Name     string
	ParentID int
}

var db *gorm.DB
var err error

func InitializeDB() {
	db, err = gorm.Open(sqlite.Open("Inv/AllTracks.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db.AutoMigrate(&Account{})
	db.AutoMigrate(&Item{})
	db.AutoMigrate(&Container{})
}

func main() {
	InitializeDB()

	r := gin.Default()

	api := r.Group("/api")
	{
		api.GET("/ping", handler.PingGet())
		api.POST("/login", handler.LoginPost(db))
		api.POST("/register", handler.RegisterPost(db))
		api.GET("/inventory", handler.InventoryGet(db))
		api.POST("/inventory", handler.InventoryPost(db))
		api.PUT("/inventory", handler.InventoryPut(db))
		api.DELETE("/inventory", handler.InventoryDelete(db))
	}

	r.Run()
}

//https://www.youtube.com/watch?v=pHRHJCYBqxw possible problem
//https://go.dev/tour/moretypes/13 go tutorial
/*
	var account Account
	db.First(&account, "username =?", "user")

	db.Model(&account).Update("username", "Bob")
	db.Model(&account).Updates(Account{Username: "Genius", Token: "sampletoken"})
	db.Delete(&account, "username =?", "Genius")

	db.Commit()
*/
