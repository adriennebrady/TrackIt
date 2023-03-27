package main

import (
	"Trackit/Inv/httpd/handler"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

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
func TestSearchGet(t *testing.T) {
	setupTestDB()

	r := gin.Default()
	r.GET("/search", handler.SearchGet(db))

	// Create a test request with a valid token and item name
	req, err := http.NewRequest("GET", "/search?Authorization=8fe7eOc922e768ed97132ac2ab8c06fd&Item=Where", nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	// Perform the request using the test router
	resp := httptest.NewRecorder()
	r.ServeHTTP(resp, req)

	// Verify the response code and body
	assert.Equal(t, http.StatusOK, resp.Code)
	assert.Equal(t, "[]", resp.Body.String())
}

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
func TestDdestroyContainer(t *testing.T) {
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

func TestGenerateToken(t *testing.T) {
	//todo: implement

}

func TestComparePasswords(t *testing.T) {
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

func TestIsValidToken(t *testing.T) {
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

func TestHashAndSalt(t *testing.T) {
	//TODO implement
}

func setupTestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	db.AutoMigrate(&handler.Account{})
	db.AutoMigrate(&handler.Container{})
	db.AutoMigrate(&handler.Item{})

	return db
}
