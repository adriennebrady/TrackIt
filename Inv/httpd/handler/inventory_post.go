package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type InvRequest struct {
	Authorization string `json:"Authorization"`
	Kind          string `json:"Kind"` // container or item?
	ID            int    `json:"ID"`
	Cont          int    `json:"Cont"`
	Name          string `json:"Name"`
	Type          string `json:"Type"`
}

func InventoryPost(db *gorm.DB) gin.HandlerFunc {
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
		if err := c.ShouldBindJSON(&requestBody); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		if requestBody.Kind == "container" {
			newContainer := Container{
				LocID:    requestBody.ID,
				Name:     requestBody.Name,
				ParentID: requestBody.Cont,
			}

			if result := db.Table("containers").Create(&newContainer); result.Error != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create container"})
				return
			}
		} else if requestBody.Kind == "item" {
			newItem := Item{
				ItemID:   requestBody.ID,
				User:     getUsernameFromToken(token, db),
				ItemName: requestBody.Name,
				LocID:    requestBody.Cont,
				Count:    1,
			}

			if result := db.Table("items").Create(&newItem); result.Error != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item"})
				return
			}
		} else {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
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
        Location: 'brusher',
        Type: 'Rename'
    })
})

curl http://localhost:8080/inventory \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"Name": "Brush","Location": "Cabinet"}'

curl http://localhost:8080/inventory \ --header "Content-Type: application/json" \ --request "GET"
*/
