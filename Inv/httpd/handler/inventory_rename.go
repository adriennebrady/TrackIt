package handler

import (
	"Trackit/Inv/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InventoryRenamer(inv inventory.Renamer) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := InvRequest{}
		c.Bind(&requestBody)

		invItem := inventory.InvItem{
			Name:     requestBody.Name,
			Location: requestBody.Location,
		}
		inv.Rename(invItem, "fsdf") /////////////////////////////////
		c.Status(http.StatusNoContent)

	}
}
