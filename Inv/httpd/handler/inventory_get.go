package handler

import (
	"Trackit/Inv/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InventoryGet(inv inventory.Getter) gin.HandlerFunc {
	return func(c *gin.Context) {
		results := inv.GetAll()
		c.JSON(http.StatusOK, results)

	}
}

//TODO add containers/traversing them
//TODO parse urls to figure what container we're in

//TODO bonus:be able to search for an item
//TODO bonus::connect to angular///////////////////////////////////////////////////////////

//TODO add backend accounts  to assign inventories to
//////////////TODO lock inventories behind username they must have access for
//////////////TODO allow users to delete accounts
