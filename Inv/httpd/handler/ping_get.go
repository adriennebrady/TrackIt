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

//TODO create a container when someone registers
//TODO And then make a column in account for rootLocID
//TODO get that rootLocID from the register or login post request along with the token?
//TODO search for an item
//TODO simple get name of container from LocID
//TODO Delete CONTAINERS

//TODO trash for recently deleted

//TODO Multi user inventories
//TODO import/export inventories
//TODO possibly later more complex recursive version of get container name
//TODO allow users to delete accounts (which requires deleting their root container)
