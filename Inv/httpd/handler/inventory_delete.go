package handler

import (
	"Inv/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InventoryDelete(inv inventory.Getter) gin.HandlerFunc {
	return func(c *gin.Context) {
		results := inv.GetAll()
		c.JSON(http.StatusOK, results)
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	}
}
