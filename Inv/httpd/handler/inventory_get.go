package handler

import (
	"backend/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InventoryGet(inv inventory.Getter) gin.HandlerFunc {
	return func(c *gin.Context) {
		results := inv.GetAll()
		c.JSON(http.StatusOK, results)

	}
}

//create items within a container
//add containers/transversing them

//rename containers and items
//delete items
//add pointers to previous and top

//parse urls to figure what container we're in

//bonus:be able to search for an item
//bonus::connect to angular///////////////////////////////////////////////////////////

//add backend accounts  to assign inventories to
/////////////create accounts, username, email, password, assign inventory
/////////////lock invontories behind username they must have access for
////////////////allow users to delete accounts
