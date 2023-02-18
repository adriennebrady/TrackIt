package handler

import (
	"Inv/platform/inventory"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type InvRequest struct {
	Authorization string `json:"Authorization"`
	Kind          string `json:"Kind"` // container or item?
	Name          string `json:"Name"`
	Location      string `json:"Location"`
	Type          string `json:"Type"`
}

func InventoryPut(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
			return
		}

		// Verify that the token is valid.
		if !isValidToken(token, db) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		requestBody := InvRequest{}
		c.Bind(&requestBody)

		if requestBody.Kind == "Container" {
			if requestBody.Type == "Rename" {
				inv.RenameContainer(requestBody.Name, requestBody.Location)
			}
			if requestBody.Type == "Relocate" {
				inv.RelocateContainer(requestBody.Name, requestBody.Location)
			}

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
        Location: 'closet',
        Type: 'Relocate'
    })
})
*/
