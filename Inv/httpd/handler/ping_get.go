package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func PingGet() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, map[string]string{
			"hello": "Found me",
		})
	}
}

//TODO: Multi user inventories
//TODO: import/export inventories
//TODO: More complex recursive version of get container name
//TODO: recently deleted page
//TODO: separate inventory get for sidebar
//TODO: account deletion page
//TODO: ITEM count/ container description
//TODO: possible cards
//TODO: add item tags
