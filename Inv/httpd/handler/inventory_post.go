package handler

import (
	"Trackit/Inv/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
)

type InvRequest struct {
	Kind 	 string `json:"Kind"` // container or item?
	Name     string `json:"Name"`
	Location string `json:"Location"`
	Type     string `json:"Type"`
}

func InventoryPost(inv inventory.Poster) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := InvRequest{}
		c.Bind(&requestBody)

		if  requestBody.Kind == "Container" {
			container := inventory.Container{
				Name:     requestBody.Name,
				Location: requestBody.Location,
			}
				
			if requestBody.Type == "Add" {
				inv.AddContainer(&container)
			}
			if requestBody.Type == "Rename" {
				inv.RenameContainer(container.Name, container.Location)
			}
			if requestBody.Type == "Relocate" {
				inv.RelocateContainer(container.Name, container.Location)
			}

		} else {
			invItem := inventory.InvItem{
				Name:     requestBody.Name,
				Location: requestBody.Location,
			}
			
			if requestBody.Type == "Add" {
				inv.Add(&invItem)
			}
			if requestBody.Type == "Rename" {
				inv.Rename(invItem.Name, invItem.Location)
			}
			if requestBody.Type == "Relocate" {
				inv.Relocate(invItem.Name, invItem.Location)
			}
		}

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
