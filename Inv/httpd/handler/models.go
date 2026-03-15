package handler

import "time"

type Account struct {
	Username string `gorm:"primaryKey"`
	Password string
	RootLoc  int `gorm:"column:rootLoc"`
}

type Item struct {
	ItemID   int    `gorm:"primaryKey;column:ItemID"`
	User     string `gorm:"column:username"`
	ItemName string `gorm:"column:itemName"`
	LocID    int    `gorm:"column:LocID"`
	Count    int    `gorm:"column:count"`
	Notes    string `gorm:"column:notes"` // new
}

type Container struct {
	LocID    int `gorm:"primaryKey;autoIncrement;column:LocID"`
	Name     string
	ParentID int    `gorm:"column:ParentID"`
	User     string `gorm:"column:username"`
}

type DeviceSession struct {
	ID       int    `gorm:"primaryKey;autoIncrement"`
	Username string `gorm:"index"`
	Token    string `gorm:"uniqueIndex"`
	LastUsed time.Time
	DeviceID string
}

type RecentlyDeletedItem struct {
	ItemID              int `gorm:"primaryKey"`
	AccountID           string
	DeletedItemName     string `gorm:"column:itemName"`
	DeletedItemLocation int    `gorm:"column:LocID"`
	DeletedItemCount    int    `gorm:"column:count"`
	Timestamp           time.Time
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token   string `json:"token"`
	RootLoc int    `json:"LocID"`
}

type RegisterRequest struct {
	Username             string `json:"username"`
	Password             string `json:"password"`
	PasswordConfirmation string `json:"password_confirmation"`
}

type InvRequest struct {
	Authorization string `json:"Authorization"`
	Kind          string `json:"Kind"`
	ID            int    `json:"ID"`
	Cont          int    `json:"Cont"`
	Name          string `json:"Name"`
	Type          string `json:"Type"`
	Count         int    `json:"Count"`
}

type DeleteRequest struct {
	Token string `json:"token"`
	ID    int    `json:"id"`
	Type  string `json:"type"`
}
