package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func PingGet() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, map[string]string{
			"hello": "Found me",
		})
	}
}

//TODO recently deleted page make get and delete handlers front end
//TODO ITEM count front end
//TODO account deletion page front end
//TODO remove container description front end
//TODO treeget for sidebar front end
//TODO alternative list view front end

//TODO auto delete after 30 days
//TODO solve tests/create tests for new functions Tana

//TODO add item tags
//TODO import/export inventories
//TODO possible cards
//TODO Multi user inventories
