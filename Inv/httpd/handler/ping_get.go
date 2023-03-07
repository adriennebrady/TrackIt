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

//TODO Delete CONTAINERS
//TODO create a container when someone registers
//TODO And then make a column in account for rootLocID
//TODO get that rootLocID from the register or login post request along with the token?
//TODO allow users to delete accounts
//TODO possibly salt/encrypt the password //////////possibly  Tana
//TODO bonus:be able to search for an item  ///////////////decide whether to make this front or backend
//TODO Add user account to container table and send
//TODO Multi user inventories
//TODO import/export inventories
//TODO trash for recently deleted
