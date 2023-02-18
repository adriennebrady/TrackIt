package handler

import (
	"Trackit/Inv/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InventoryPost(inv *inventory.Container) gin.HandlerFunc {
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
			container := inventory.New()
			container.Name = requestBody.Name
			container.Location = requestBody.Location
			container.Parent = inv

			inv.AddContainer(container)

		} else if requestBody.Kind == "Traverse" {
			if requestBody.Location == "Parent" {
				inv = inv.Parent
			} else {
				test, ok := inv.Containers[requestBody.Location]
				if !ok {
					inv = test
				}
			}

		} else {
			invItem := inventory.InvItem{
				Name:     requestBody.Name,
				Location: requestBody.Location,
			}

			inv.Add(&invItem)
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

curl http://localhost:8080/inventory \ --header "Content-Type: application/json" \ --request "GET"
*/
