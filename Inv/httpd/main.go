package main

import (
	"Trackit/Inv/httpd/handler"
	"Trackit/Inv/platform/inventory"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

type User struct {
	gorm.Model
	Name  string
	Email string
}

func main() {
	inv := inventory.New()

	db, err := gorm.Open(sqlite.Open("AllTracks.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	db.AutoMigrate(&User{})

	db.Create(&User{Name: "Alice", Email: "alice@example.com"})

	var user User
	db.First(&user, 1)

	db.Model(&user).Update("Name", "Bob")

	//db.Delete(&user, 1)

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
