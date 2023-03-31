package main

import (
	"Trackit/Inv/httpd/handler"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

type Account struct { //gorm.Model?
	Username string `gorm:"primaryKey"`
	Password string
	Token    string
	RootLoc  int `gorm:"column:rootLoc"`
}

type Item struct {
	ItemID   int    `gorm:"primaryKey;column:ItemID"`
	User     string `gorm:"column:username"`
	ItemName string `gorm:"column:itemName"`
	LocID    int    `gorm:"column:LocID"`
	Count    int    `gorm:"column:count"`
}

type Container struct {
	LocID    int `gorm:"primaryKey;column:LocID"`
	Name     string
	ParentID int    `gorm:"column:ParentID"`
	User     string `gorm:"column:username"`
}

// recently delete
type RecentlyDeletedItem struct {
	AccountID           string
	DeletedItemID       int    `gorm:"primaryKey"`
	DeletedItemName     string `gorm:"column:itemName"`
	DeletedItemLocation int    `gorm:"column:LocID"`
	DeletedItemCount    int    `gorm:"column:count"`
	Timestamp           time.Time
}

var db *gorm.DB
var err error

func InitializeDB() {
	db, err = gorm.Open(sqlite.Open("Inv/AllTracks.sqlite"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db.AutoMigrate(&Account{})
	db.AutoMigrate(&Item{})
	db.AutoMigrate(&Container{}) // create the recently deleted items table
	db.AutoMigrate(&RecentlyDeletedItem{})
}

func main() {
	InitializeDB()

	r := gin.Default()
	api := r.Group("/api")
	{
		api.GET("/ping", handler.PingGet())
		api.POST("/login", handler.LoginPost(db))
		api.POST("/search", handler.SearchGet(db))
		api.GET("/name", handler.NameGet(db))
		api.POST("/register", handler.RegisterPost(db))
		api.GET("/items", handler.ItemsGet(db))
		api.GET("/containers", handler.ContainerGet(db))
		api.POST("/inventory", handler.InventoryPost(db))
		api.PUT("/inventory", handler.InventoryPut(db))
		api.DELETE("/inventory", handler.InventoryDelete(db))
		api.DELETE("/account", handler.AccountDelete(db))
	}

	r.Run()
}

//https://www.youtube.com/watch?v=pHRHJCYBqxw possible problem
//https://go.dev/tour/moretypes/13 go tutorial
