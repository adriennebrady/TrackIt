package handler

import (
	"Trackit/Inv/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InventoryDelete(inv inventory.Deleter) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := InvRequest{}
		c.Bind(&requestBody)

		inv.Delete(requestBody.Name)
		c.Status(http.StatusNoContent)

	}
}
