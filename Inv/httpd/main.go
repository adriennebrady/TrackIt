package main

import (
	"Trackit/Inv/httpd/handler"
	"Trackit/Inv/platform/inventory"

	"github.com/gin-gonic/gin"
)

func main() {
	inv := inventory.New()

	r := gin.Default()

	api := r.Group("/api")
	{
		api.GET("/ping", handler.PingGet())
		api.GET("/inventory", handler.InventoryGet(inv))
		api.POST("/inventory", handler.InventoryPost(inv))
		api.DELETE("/inventory", handler.InventoryDelete(inv))
	}

	r.Run()

	// feed := newsfeed.New()
	// fmt.Println(feed)
	// feed.Add(newsfeed.Item{"Hello", "How ya' doing mate?"})
	// fmt.Println(feed)
}
