package handler

import (
	"Trackit/Inv/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InventoryRelocate(inv inventory.Relocater) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := InvRequest{}
		c.Bind(&requestBody)

		invItem := inventory.InvItem{
			Name:     requestBody.Name,
			Location: requestBody.Location,
		}
		inv.Relocate(invItem, "example")
		c.Status(http.StatusNoContent)

	}
}
