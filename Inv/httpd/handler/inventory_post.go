package handler

import (
	"Trackit/Inv/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
)

type InvRequest struct {
	Authorization string `json:"Authorization"`
	Kind          string `json:"Kind"` // container or item?
	Name          string `json:"Name"`
	Location      string `json:"Location"`
	Type          string `json:"Type"`
}

func InventoryPost(inv inventory.Poster) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
			return
		}

		// Verify that the token is valid.
		if !isValidToken(token) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		requestBody := InvRequest{}
		c.Bind(&requestBody)

		if requestBody.Kind == "Container" {
			container := inventory.Container{
				LocID:      3, ////////////////////////////////////
				Name:       requestBody.Name,
				Location:   requestBody.Location,
				Parent:     *inv, ///////////////////////////
				InvItems:   make(map[string]*inventory.InvItem),
				Containers: make(map[string]*inventory.Container),
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

await fetch('/inventory', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
        Name: 'brush',
        Location: 'brusher',
        Type: 'Rename'
    })
})

await fetch('/inventory', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
        Name: 'brush',
        Location: 'closet',
        Type: 'Relocate'
    })
})

curl http://localhost:8080/inventory \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"Name": "Brush","Location": "Cabinet"}'

curl http://localhost:8080/inventory \
    --header "Content-Type: application/json" \
    --request "GET"
*/
