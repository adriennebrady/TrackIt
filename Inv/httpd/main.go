package main

import (
	"Trackit/Inv/httpd/handler"
	"Trackit/Inv/platform/inventory"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

type Account struct {
	Username string `gorm:"primaryKey"`
	Password string
	Token    string
}

func main() {
	inv := inventory.New()

	db, err := gorm.Open(sqlite.Open("Inv/AllTracks.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db.AutoMigrate(&Account{})

	newAccount := Account{Username: "user", Password: "password", Token: "token"}
	result := db.Create(&newAccount)
	if result.Error != nil {
		panic(result.Error)
	}

	var account Account
	db.First(&account, "username =?", "user")

	//db.Model(&account).Update("username", "Bob")
	db.Model(&account).Updates(Account{Username: "Genius", Token: "sampletoken"})
	db.Delete(&account, "username =?", "Genius")

	db.Commit()

	// Create a new user
	//fmt.Println(inv)
	//inv.Add(1, 2, 3)
	//fmt.Println(inv)

	r := gin.Default()

	api := r.Group("/api")
	{
		api.GET("/ping", handler.PingGet())
		api.GET("/inventory", handler.InventoryGet(inv))
		api.POST("/inventory", handler.InventoryPost(inv))
		api.DELETE("/inventory", handler.InventoryDelete(inv))
	}

	r.Run()
}

//https://gorm.io/docs/index.html GORM site
