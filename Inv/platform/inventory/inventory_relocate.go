package handler

import (
	"backend/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
)

type InvRequest struct {
	Name     string `json:"Item Name"`
	Location string `json:"Location"`
}

func InventoryRelocate(inv inventory.relocater) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := InvRequest{}
		c.Bind(&requestBody)

		invItem := inventory.InvItem{
			Name:     requestBody.Name,
			Location: requestBody.Location,
		}
		inv.relocate(invItem)
		c.Status(http.StatusNoContent)

	}
}
