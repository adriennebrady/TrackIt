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

func TestInventoryDelete(t *testing.T) {
	InitializeDB()

	//todo: implement

}
func TestDeleteItem(t *testing.T) {
	//todo: implement

}
func TestDestroyContainer(t *testing.T) {
	//todo: implement

}
func TestdestroyContainer(t *testing.T) {
	//todo: implement

}
func TestInventoryPut(t *testing.T) {
	InitializeDB()

	//todo: implement

}
func TestItemPut(t *testing.T) {
	//todo: implement

}
func TestContainerPut(t *testing.T) {
	//todo: implement

}
func TestLoginPost(t *testing.T) {
	InitializeDB()

	//todo: implement

}

func TestGenerateToken(t *testing.T) {
	//todo: implement

}

func TestComparePasswords(t *testing.T) {
	//todo: implement

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
func TestIsValidToken(t *testing.T) {
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
func TestHashAndSalt(t *testing.T) {
	//TODO implement
}
