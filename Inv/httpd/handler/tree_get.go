package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ContainerTree struct {
	Container Container
	Children  []*ContainerTree
}

func TreeGet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		// Verify that the token is valid.
		var username string
		if username = IsValidToken(token, db); username == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// Get the root location of the user.
		var existingUser Account
		if result := db.Table("accounts").Where("username = ?", username).First(&existingUser); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "User does not exist"})
			return
		}

		// Recursively add children containers with their path to the result.
		containerTree := &ContainerTree{
			Container: Container{LocID: existingUser.RootLoc},
			Children:  getChildren(existingUser.RootLoc, "", db),
		}

		c.JSON(http.StatusOK, containerTree)
	}
}

func getChildren(parentID int, parentPath string, db *gorm.DB) []*ContainerTree {
	var containers []Container
	if result := db.Table("Containers").Where("parentID = ?", parentID).Find(&containers); result.Error != nil {
		return nil
	}

	containerTree := make([]*ContainerTree, 0, len(containers))
	for _, container := range containers {
		childPath := parentPath + "/" + container.Name
		childTree := &ContainerTree{
			Container: container,
			Children:  nil, // initialize to nil in case there are no children
		}
		children := getChildren(container.LocID, childPath, db)
		if children != nil {
			childTree.Children = children
		}
		containerTree = append(containerTree, childTree)
	}

	return containerTree
}
