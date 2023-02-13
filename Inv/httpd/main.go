package main

import (
	"Trackit/Inv/httpd/handler"
	"Trackit/Inv/platform/inventory"

	"github.com/gin-gonic/gin"
)

func main() {
	inv := inventory.New()
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
