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
		username := c.MustGet("username").(string)

		var existingUser Account
		if result := db.Table("accounts").Where("username = ?", username).First(&existingUser); result.Error != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "User does not exist"})
			return
		}

		containerTree := &ContainerTree{
			Container: Container{LocID: existingUser.RootLoc},
			Children:  GetChildren(existingUser.RootLoc, "", db),
		}

		c.JSON(http.StatusOK, containerTree)
	}
}

func GetChildren(parentID int, parentPath string, db *gorm.DB) []*ContainerTree {
	var containers []Container
	if result := db.Table("Containers").Where("parentID = ?", parentID).Find(&containers); result.Error != nil {
		return nil
	}

	containerTree := make([]*ContainerTree, 0, len(containers))
	for _, container := range containers {
		childPath := parentPath + "/" + container.Name
		childTree := &ContainerTree{
			Container: container,
			Children:  GetChildren(container.LocID, childPath, db),
		}
		containerTree = append(containerTree, childTree)
	}
	return containerTree
}
