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
	ItemID              int `gorm:"primaryKey"`
	AccountID           string
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

	// Set trusted proxies
	r.ForwardedByClientIP = true // Set the trusted proxy
	r.SetTrustedProxies([]string{"127.0.0.1"})
	{
		api.GET("/ping", handler.PingGet())
		api.GET("/name", handler.NameGet(db))
		api.GET("/items", handler.ItemsGet(db))
		api.GET("/containers", handler.ContainersGet(db))
		api.GET("/deleted", handler.DeletedGet(db))
		api.GET("/tree", handler.TreeGet(db))
		api.POST("/login", handler.LoginPost(db))
		api.POST("/search", handler.SearchGet(db))
		api.POST("/register", handler.RegisterPost(db))
		api.POST("/inventory", handler.InventoryPost(db))
		api.PUT("/inventory", handler.InventoryPut(db))
		api.DELETE("/inventory", handler.InventoryDelete(db))
		api.DELETE("/account", handler.AccountDelete(db))
		api.DELETE("/deleted", handler.DeleteDelete(db))
	}

	r.Run(":8080")
}

//Front End
//TODO treeGet for sidebar visible by default/keep state when moving between containers
//TODO drag and drop items/containers
//TODO alternative list view
//TODO give warning when username exists

//Full Stack
//TODO recently deleted containers
//TODO add item tags
//TODO import/export inventories
//TODO image cards
//TODO Multi user inventories

/*

CREATE TRIGGER tr_items_deleted
AFTER DELETE ON items
FOR EACH ROW
BEGIN
  INSERT INTO recently_deleted_items
  (ItemID, account_id, DeletedItemName, DeletedItemLocation, count, Timestamp)
  VALUES
  (OLD.ItemID, OLD.username, OLD.ItemName, OLD.LocID, OLD.Count, DATETIME('now'));
END;

CREATE TRIGGER tr_delete_old_items
AFTER DELETE ON items
BEGIN
  DELETE FROM recently_deleted_items
  WHERE Timestamp < DATETIME('now', '-30 days');
END;

*/
