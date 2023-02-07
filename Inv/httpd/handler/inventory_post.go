package handler

import (
	"Trackit/Inv/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
)

type InvRequest struct {
	Name     string `json:"Name"`
	Location string `json:"Location"`
}

func InventoryPost(inv inventory.Adder) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := InvRequest{}
		c.Bind(&requestBody)

		invItem := inventory.InvItem{
			Name:     requestBody.Name,
			Location: requestBody.Location,
		}
		inv.Add(invItem)
		c.Status(http.StatusNoContent)

	}
}

/*
await fetch('/inventory', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
        Name: 'brush',
        Location: 'dresser'
    })
})
*/
