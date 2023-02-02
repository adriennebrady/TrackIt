package main

import (
	"backend/httpd/handler"
	"backend/platform/inventory"

	"github.com/gin-gonic/gin"
)

func main() {
	inv := inventory.New()

	r := gin.Default()

	r.GET("/ping", handler.PingGet())
	r.GET("/inventory", handler.InventoryGet(inv))
	r.POST("/inventory", handler.InventoryPost(inv))
	r.DELETE("/inventory", handler.InventoryPost(inv))

	r.Run()

	// feed := newsfeed.New()

	// fmt.Println(feed)

	// feed.Add(newsfeed.Item{"Hello", "How ya' doing mate?"})

	// fmt.Println(feed)

}
