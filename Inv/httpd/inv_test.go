package main

import (
	"Trackit/Inv/httpd/handler"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestSearchGet(t *testing.T) {
	InitializeDB()

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

func TestSearchGet(t *testing.T) {
	InitializeDB()

	r := gin.Default()
	r.GET("/search", handler.SearchGet(db))

}
func TestSearchGet(t *testing.T) {
	InitializeDB()

	r := gin.Default()
	r.GET("/search", handler.SearchGet(db))

}
func TestSearchGet(t *testing.T) {
	InitializeDB()

	r := gin.Default()
	r.GET("/search", handler.SearchGet(db))

}
func TestSearchGet(t *testing.T) {
	InitializeDB()

	r := gin.Default()
	r.GET("/search", handler.SearchGet(db))

}

func TestRegisterPost(t *testing.T) {
	InitializeDB()

	//todo: implement

}
func TestAccountDelete(t *testing.T) {
	InitializeDB()

	//todo: implement

}
func TestInventoryGet(t *testing.T) {
	InitializeDB()

	r := gin.Default()
	r.GET("/inventory", handler.InventoryGet(db))
	//todo: implement

}
func TestisValidToken(t *testing.T) {
	//todo: implement

}
func TestInventoryPost(t *testing.T) {
	InitializeDB()

	r := gin.Default()
	r.POST("/inventory", handler.InventoryPost(db))
	//todo: implement

}
func TestNameGet(t *testing.T) {
	//todo: implement

}
func testPingGet(t *testing.T) {
	//todo: implement

}
func TesthashAndSalt(t *testing.T) {
	//TODO implement
}
