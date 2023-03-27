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

func TestDeleteItem(t *testing.T) {
	//todo: implement

}

func TestDDestroyContainer(t *testing.T) {
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
func TestItemPut(t *testing.T) {
	// Set up the test database.
	setupTestDB()

	// Add some test data.
	username := "testuser"
	item := Item{
		ItemID:   1,
		User:     username,
		ItemName: "Test Item",
		LocID:    1,
		Count:    1,
	}
	db.Create(&item)

	// Test renaming the item.
	requestBody := handler.InvRequest{
		Type: "Rename",
		ID:   1,
		Name: "New Item Name",
	}
	result := handler.ItemPut(requestBody, db, username)
	if result != "" {
		t.Errorf("Unexpected error: %s", result)
	}
	var updatedItem Item
	db.First(&updatedItem, "ItemID = ? AND username = ?", 1, username)
	if updatedItem.ItemName != "New Item Name" {
		t.Errorf("Item name was not updated correctly: expected '%s', got '%s'", "New Item Name", updatedItem.ItemName)
	}

	// Test relocating the item.
	requestBody = handler.InvRequest{
		Type: "Relocate",
		ID:   1,
		Cont: 2,
	}
	result = handler.ItemPut(requestBody, db, username)
	if result != "" {
		t.Errorf("Unexpected error: %s", result)
	}
	db.First(&updatedItem, "ItemID = ? AND username = ?", 1, username)
	if updatedItem.LocID != 2 {
		t.Errorf("Item location was not updated correctly: expected %d, got %d", 2, updatedItem.LocID)
	}

	// Clean up.
	db.Unscoped().Delete(&item)
}
func TestContainerPut(t *testing.T) {
	// Initialize test data
	setupTestDB()
	// Create a test container in the database
	testContainer := Container{Name: "Test Container", ParentID: 0, User: "testUser"}
	result := db.Create(&testContainer)
	if result.Error != nil {
		t.Errorf("Error creating test container: %s", result.Error.Error())
	}

	// Call the function to update the container's name
	requestBody := handler.InvRequest{ID: testContainer.LocID, Type: "Rename", Name: "New Name", Cont: 0}
	resultMsg := handler.ContainerPut(requestBody, db, "testUser")
	if resultMsg != "" {
		t.Errorf("Error updating container: %s", resultMsg)
	}

	// Check that the container's name was updated in the database
	var updatedContainer Container
	result = db.First(&updatedContainer, "LocID = ? AND username = ?", testContainer.LocID, "testUser")
	if result.Error != nil {
		t.Errorf("Error retrieving updated container from database: %s", result.Error.Error())
	} else if updatedContainer.Name != "New Name" {
		t.Errorf("Container name was not updated correctly")
	}

	// Call the function to update the container's location
	requestBody = handler.InvRequest{ID: testContainer.LocID, Type: "Relocate", Name: "", Cont: 1}
	resultMsg = handler.ContainerPut(requestBody, db, "testUser")
	if resultMsg != "" {
		t.Errorf("Error updating container: %s", resultMsg)
	}

	// Check that the container's location was updated in the database
	result = db.First(&updatedContainer, "LocID = ? AND username = ?", testContainer.LocID, "testUser")
	if result.Error != nil {
		t.Errorf("Error retrieving updated container from database: %s", result.Error.Error())
	} else if updatedContainer.ParentID != 1 {
		t.Errorf("Container location was not updated correctly")
	}
}
func TestDestroyContainer(t *testing.T) {
	// Set up a new in-memory SQLite database for testing.
	setupTestDB()

	// Create a test user and container.
	testUser := Account{Username: "testuser", Password: "password123", Token: "token123"}
	testContainer := Container{Name: "Test Container", User: "testuser"}
	if result := db.Create(&testUser); result.Error != nil {
		t.Fatalf("failed to create test user: %v", result.Error)
	}
	if result := db.Create(&testContainer); result.Error != nil {
		t.Fatalf("failed to create test container: %v", result.Error)
	}

	// Create a test item inside the test container.
	testItem := Item{ItemName: "Test Item", Count: 5, LocID: testContainer.LocID, User: "testuser"}
	if result := db.Create(&testItem); result.Error != nil {
		t.Fatalf("failed to create test item: %v", result.Error)
	}

	// Call the function under test.
	if err := handler.DestroyContainer(db, testContainer.LocID, "testuser"); err != nil {
		t.Errorf("DestroyContainer returned an error: %v", err)
	}

	// Verify that the container and item were deleted from the database.
	var count int64
	if result := db.Table("containers").Where("LocID = ?", testContainer.LocID).Count(&count); result.Error != nil {
		t.Fatalf("failed to query database: %v", result.Error)
	}
	if count != 0 {
		t.Errorf("DestroyContainer did not delete the container from the database")
	}
	if result := db.Table("items").Where("LocID = ?", testContainer.LocID).Count(&count); result.Error != nil {
		t.Fatalf("failed to query database: %v", result.Error)
	}
	if count != 0 {
		t.Errorf("DestroyContainer did not delete the items from the database")
	}
}
func TestInventoryGet(t *testing.T) {
	setupTestDB()

	// Insert a test user with a valid token into the database.
	validTokenUser := Account{Username: "testuser", Password: "testpassword", Token: "validtoken"}
	if err := db.Create(&validTokenUser).Error; err != nil {
		t.Fatalf("Failed to insert test user: %v", err)
	}
	// Create a test user and containers.
	user := Account{Username: "testuser", Token: "testtoken"}
	db.Create(&user)
	container1 := Container{LocID: 1, Name: "Container 1", ParentID: 0, User: "testuser"}
	db.Create(&container1)
	container2 := Container{LocID: 2, Name: "Container 2", ParentID: 0, User: "testuser"}
	db.Create(&container2)
	container3 := Container{LocID: 3, Name: "Container 3", ParentID: 1, User: "testuser"}
	db.Create(&container3)

	// Create some test items.
	item1 := Item{ItemID: 1, User: "testuser", ItemName: "Item 1", LocID: 1, Count: 1}
	db.Create(&item1)
	item2 := Item{ItemID: 2, User: "testuser", ItemName: "Item 2", LocID: 2, Count: 1}
	db.Create(&item2)
	item3 := Item{ItemID: 3, User: "testuser", ItemName: "Item 3", LocID: 3, Count: 1}
	db.Create(&item3)

	router := gin.Default()
	router.GET("/inventory", handler.InventoryGet(db))

	/* FAIL (DEBUG) Test case 1: successful request.
	req1, _ := http.NewRequest("GET", "/inventory?container_id=1", nil)
	req1.Header.Set("Authorization", "Bearer testtoken")
	resp1 := httptest.NewRecorder()
	router.ServeHTTP(resp1, req1)
	assert.Equal(t, http.StatusOK, resp1.Code)*/

	// Test case 2: missing authorization token.
	req2, _ := http.NewRequest("GET", "/inventory?container_id=1", nil)
	resp2 := httptest.NewRecorder()
	router.ServeHTTP(resp2, req2)
	assert.Equal(t, http.StatusUnauthorized, resp2.Code)

	// Test case 3: invalid authorization token.
	req3, _ := http.NewRequest("GET", "/inventory?container_id=1", nil)
	req3.Header.Set("Authorization", "Bearer invalidtoken")
	resp3 := httptest.NewRecorder()
	router.ServeHTTP(resp3, req3)
	assert.Equal(t, http.StatusUnauthorized, resp3.Code)

	/* FAIL (DEBUG) Test case 4: invalid container ID.
	req4, _ := http.NewRequest("GET", "/inventory?container_id=invalid", nil)
	req4.Header.Set("Authorization", "Bearer testtoken")
	resp4 := httptest.NewRecorder()
	router.ServeHTTP(resp4, req4)
	assert.Equal(t, http.StatusBadRequest, resp4.Code)*/

	// Test case 5: invalid container for user.
	req5, _ := http.NewRequest("GET", "/inventory?container_id=2", nil)
	req5.Header.Set("Authorization", "Bearer testtoken")
	resp5 := httptest.NewRecorder()
	router.ServeHTTP(resp5, req5)
	assert.Equal(t, http.StatusUnauthorized, resp5.Code)
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
