package main

import (
	"Trackit/Inv/httpd/handler"
	"net/http"
	"net/http/httptest"
	"regexp"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestInventoryDelete(t *testing.T) {
	setupTestDB()

	//todo: implement

}
func TestInventoryPut(t *testing.T) {
	setupTestDB()

	//todo: implement

}
func TestInventoryGet(t *testing.T) {
	setupTestDB()

	r := gin.Default()
	r.GET("/inventory", handler.InventoryGet(db))
	//todo: implement

}
func TestDeleteItem(t *testing.T) {
	//todo: implement

}
func TestDestroyContainer(t *testing.T) {
	//todo: implement

}
func TestDDestroyContainer(t *testing.T) {
	//todo: implement

}

func TestItemPut(t *testing.T) {
	//todo: implement

}
func TestContainerPut(t *testing.T) {
	//todo: implement

}
func TestLoginPost(t *testing.T) {
	//todo: implement
}

func TestRegisterPost(t *testing.T) {
	setupTestDB()

	//todo: implement

}
func TestAccountDelete(t *testing.T) {
	setupTestDB()

	//todo: implement

}

func TestInventoryPost(t *testing.T) {
	setupTestDB()

	r := gin.Default()
	r.POST("/inventory", handler.InventoryPost(db))
	//todo: implement

}
func TestNameGet(t *testing.T) {
	//todo: implement
}

func TestSearchGet(t *testing.T) {
	setupTestDB()

	// Insert a test user with a valid token into the database.
	validTokenUser := Account{Username: "testuser", Password: "testpassword", Token: "validtoken"}
	if err := db.Create(&validTokenUser).Error; err != nil {
		t.Fatalf("Failed to insert test user: %v", err)
	}
	// Insert a test item with a valid token into the database.
	validItem := Item{ItemID: 1, User: "testuser", ItemName: "Where"}
	if err := db.Create(&validItem).Error; err != nil {
		t.Fatalf("Failed to insert test item: %v", err)
	}

	r := gin.Default()
	r.GET("/search", handler.SearchGet(db))

	// Create a test request with a valid token and item name
	req, err := http.NewRequest("GET", "/search?Authorization=validtoken&Item=Where", nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	// Perform the request using the test router
	resp := httptest.NewRecorder()
	r.ServeHTTP(resp, req)

	// Verify the response code and body
	assert.Equal(t, http.StatusOK, resp.Code)
	assert.Equal(t, "[{\"ItemID\":1,\"User\":\"testuser\",\"ItemName\":\"Where\",\"LocID\":0,\"Count\":0}]", resp.Body.String())
}
func TestIsValidToken(t *testing.T) {
	setupTestDB()

	// Insert a test user with a valid token into the database.
	validTokenUser := Account{Username: "testuser", Password: "testpassword", Token: "validtoken"}
	if err := db.Create(&validTokenUser).Error; err != nil {
		t.Fatalf("Failed to insert test user: %v", err)
	}

	// Test with a valid token.
	validToken := "Bearer validtoken"
	username := handler.IsValidToken(validToken, db)
	assert.Equal(t, "testuser", username)

	// Test with an invalid token.
	invalidToken := "Bearer invalidtoken"
	username = handler.IsValidToken(invalidToken, db)
	assert.Empty(t, username)

	// Test with no token.
	noToken := ""
	username = handler.IsValidToken(noToken, db)
	assert.Empty(t, username)
}
func TestComparePasswords(t *testing.T) {
	password := []byte("password123")
	hash, _ := bcrypt.GenerateFromPassword(password, bcrypt.MinCost)

	match := handler.ComparePasswords(string(hash), password)
	if !match {
		t.Errorf("ComparePasswords failed: expected true but got false")
	}

	match = handler.ComparePasswords(string(hash), []byte("wrongpassword"))
	if match {
		t.Errorf("ComparePasswords failed: expected false but got true")
	}
}
func TestPingGet(t *testing.T) {
	// Create a new HTTP request and response recorder
	req, err := http.NewRequest("GET", "/ping", nil)
	if err != nil {
		t.Fatal(err)
	}
	w := httptest.NewRecorder()

	// Create a new Gin context from the response recorder
	c, r := gin.CreateTestContext(w)
	r.GET("/ping", handler.PingGet())
	_ = c

	// Perform the HTTP request and check the response status code
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("unexpected status code: got %v want %v", w.Code, http.StatusOK)
	}

	// Check the response body
	expectedBody := `{"hello":"Found me"}`
	if w.Body.String() != expectedBody {
		t.Errorf("unexpected response body: got %v want %v", w.Body.String(), expectedBody)
	}
}
func TestGenerateToken(t *testing.T) {
	token := handler.GenerateToken()

	match, _ := regexp.MatchString("^[0-9a-f]{32}$", token)
	if !match {
		t.Errorf("GenerateToken failed: token %v does not match expected format", token)
	}
}
func TestHashAndSalt(t *testing.T) {
	password := []byte("password123")
	hash := handler.HashAndSalt(password)

	err := bcrypt.CompareHashAndPassword([]byte(hash), password)
	if err != nil {
		t.Errorf("HashAndSalt failed: %v", err)
	}
}

func setupTestDB() {
	db, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	db.AutoMigrate(&handler.Account{})
	db.AutoMigrate(&handler.Container{})
	db.AutoMigrate(&handler.Item{})

}
