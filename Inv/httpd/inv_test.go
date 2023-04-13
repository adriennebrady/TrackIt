package main

import (
	"Trackit/Inv/httpd/handler"
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"regexp"

	//"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestInventoryPut(t *testing.T) {
	setupTestDB()
	t.Errorf("Not implemented")
	//todo: implement

}
func TestAccountDelete(t *testing.T) {
	// Set up the test database and server.
	setupTestDB()

	Handler := handler.AccountDelete(db)
	router := gin.Default()
	router.DELETE("/account", Handler)

	// Seed the database with a test user.
	testUser := Account{
		Username: "test_user",
		Password: handler.HashAndSalt([]byte("password")),
	}
	db.Table("accounts").Create(&testUser)

	// Call the API endpoint to trigger auto-delete.
	reqBody := handler.RegisterRequest{
		Username:             "test_user",
		Password:             "password",
		PasswordConfirmation: "password",
	}

	reqBodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		t.Fatalf(FTM, err)
	}
	req, err := http.NewRequest("DELETE", "/account", bytes.NewBuffer(reqBodyBytes))
	if err != nil {
		t.Fatalf(FTC, err)
	}
	req.Header.Set(CT, "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Check that the response has a 200 status code.
	if status := w.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check that the test user was deleted from the database.
	var deletedUser Account
	if result := db.Table("accounts").Where("username = ?", "test_user").First(&deletedUser); result.Error == nil {
		t.Errorf("Expected user to be deleted from the database but found user: %v", deletedUser)
	}

}

func TestDeletedGet(t *testing.T) {
	// Set up the test database and server.
	setupTestDB()

	Handler := handler.DeletedGet(db)
	router := gin.Default()
	router.GET("/deleted", Handler)

	// Insert a test user with a valid token into the database.
	validTokenUser := Account{Username: "testuser", Password: "testpassword", Token: "validtoken"}
	if err := db.Create(&validTokenUser).Error; err != nil {
		t.Fatalf("Failed to insert test user: %v", err)
	}

	// Insert a test item with a valid token into the database.
	validItem := RecentlyDeletedItem{ItemID: 1, AccountID: "testuser", DeletedItemName: "Where", DeletedItemLocation: 1,
		DeletedItemCount: 1, Timestamp: time.Now()}

	if err := db.Create(&validItem).Error; err != nil {
		t.Fatalf("Failed to insert test item: %v", err)
	}

	// Create a test request with a valid token and item name
	req, err := http.NewRequest("GET", "/deleted?Authorization=validtoken", nil)
	if err != nil {
		t.Fatalf(FTC, err)
	}

	// Perform the request using the test router
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
	assert.Equal(t, "[{\"ItemID\":1,\"AccountID\":\"testuser\",\"DeletedItemName\":\"Where\",\"DeletedItemLocation\":1,\"DeletedItemCount\":1,\"Timestamp\": \""+validItem.Timestamp.String()+"}]", resp.Body.String())

}


// ////////////////////* GOOD *////////////////////////////////

func TestTreeGet(t *testing.T) {
	// Set up the test database and server.
	setupTestDB()

	Handler := handler.TreeGet(db)
	router := gin.Default()
	router.GET("/tree", Handler)

	// Insert a test user with a valid token into the database.
	validTokenUser := Account{Username: "testuser", Password: "testpassword", Token: "validtoken"}
	if err := db.Create(&validTokenUser).Error; err != nil {
		t.Fatalf("Failed to insert test user: %v", err)
	}

	parentContainer := Container{
		Name:     "Parent",
		ParentID: 0,
		User:     "testuser",
		LocID:    1,
	}

	err = db.Create(&parentContainer).Error
	if err != nil {
		t.Fatalf("Failed to create parent container: %v", err)
	}

	childContainer := Container{
		Name:     "child",
		ParentID: 1,
		User:     "testuser",
		LocID:    2,
	}

	err = db.Create(&childContainer).Error
	if err != nil {
		t.Fatalf("Failed to create parent container: %v", err)
	}

	child2Container := Container{
		Name:     "child2",
		ParentID: 2,
		User:     "testuser",
		LocID:    3,
	}

	err = db.Create(&child2Container).Error
	if err != nil {
		t.Fatalf("Failed to create parent container: %v", err)
	}

	// Create a test request with a valid authorization token.
	req, err := http.NewRequest("GET", "/tree", nil)
	if err != nil {
		t.Fatalf("Failed to create HTTP request: %v", err)
	}
	req.Header.Set("Authorization", "validtoken")

	// Call the handler function and record the response.
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	// Verify that the response status code is 200 OK.
	assert.Equal(t, http.StatusOK, rr.Code)

	// Verify that the response body contains a JSON-encoded container tree.
	var tree handler.ContainerTree
	err = json.Unmarshal(rr.Body.Bytes(), &tree)
	if err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}

}

func TestGetMaxLocID(t *testing.T) {
	// Create a mock database.
	setupTestDB()
	// Test for empty container
	maxLocID := handler.GetMaxLocID(db)
	if maxLocID != 0 {
		t.Errorf("Expected maxLocID to be 0, but got %v", maxLocID)
	}
	// Create a new container with LocID 1
	cont := Container{LocID: 1, Name: "Test Container", ParentID: 0, User: "testUser"}
	db.Create(&cont)


	// Test for non-empty container
	maxLocID = handler.GetMaxLocID(db)
	if maxLocID != 1 {
		t.Errorf("Expected maxLocID to be 1, but got %v", maxLocID)
	}

	db.Delete(&cont)

	// Test for non-empty container
	maxLocID = handler.GetMaxLocID(db)
	if maxLocID != 0 {
		t.Errorf("Expected maxLocID to be 0, but got %v", maxLocID)
	}
}

func TestInventoryPost(t *testing.T) {
	// Set up the test database and server.
	setupTestDB()

	Handler := handler.InventoryPost(db)
	router := gin.Default()
	router.POST("/inventory", Handler)

	// Insert a test user with a valid token into the database.
	validTokenUser := Account{Username: "testuser", Password: "testpassword", Token: "validtoken"}
	if err := db.Create(&validTokenUser).Error; err != nil {
		t.Fatalf("Failed to insert test user: %v", err)
	}

	// Call the API endpoint to trigger auto-delete.
	reqBody := handler.InvRequest{
		Authorization: "validtoken",
		Kind:          "container",
		ID:            1,
		Cont:          0,
		Name:          "cont1",
		Type:          "",
		Count:         0,
	}

	reqBodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		t.Fatalf(FTM, err)
	}
	req, err := http.NewRequest("POST", "/inventory", bytes.NewBuffer(reqBodyBytes))
	if err != nil {
		t.Fatalf(FTC, err)
	}
	req.Header.Set(CT, "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	status := w.Code

	// Check that the response has a 200 status code.
	if status != http.StatusNoContent {
		t.Errorf("Handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
}

func TestItemsGet(t *testing.T) {
	// Set up the test database and server.
	setupTestDB()

	Handler := handler.ItemsGet(db)
	router := gin.Default()
	router.GET("/items", Handler)

	// Insert a test user with a valid token into the database.
	validTokenUser := Account{Username: "testuser", Password: "testpassword", Token: "validtoken"}
	if err := db.Create(&validTokenUser).Error; err != nil {
		t.Fatalf("Failed to insert test user: %v", err)
	}

	parentContainer := Container{
		Name:     "Parent",
		ParentID: 0,
		User:     "testuser",
		LocID:    1,
	}

	err = db.Create(&parentContainer).Error
	if err != nil {
		t.Fatalf("Failed to create parent container: %v", err)
	}

	// Create some test containers.
	Item1 := Item{
		ItemName: "Item1",
		ItemID:   1,
		LocID:    1,
		User:     "testuser",
		Count:    1,
	}
	Item2 := Item{
		ItemName: "Item2",
		ItemID:   2,
		LocID:    1,
		User:     "testuser",
		Count:    1,
	}

	err = db.Create(&Item1).Error
	if err != nil {
		t.Fatalf("Failed to create item1: %v", err)
	}
	err = db.Create(&Item2).Error
	if err != nil {
		t.Fatalf("Failed to create item2 1: %v", err)
	}

	// Create a test request with a valid token and item name
	req, err := http.NewRequest("GET", "/items?container_id=1", nil)
	if err != nil {
		t.Fatalf(FTC, err)
	}
	req.Header.Set("Authorization", "validtoken")

	// Perform the request using the test router
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	var items []Item
	err = json.Unmarshal(resp.Body.Bytes(), &items)
	if err != nil {
		t.Errorf("Failed to unmarshal response: %v", err)
	}

	if len(items) != 2 {
		t.Errorf("Unexpected number of containers: got %v, want %v", len(items), 2)
	}

	if items[0].ItemName != "Item1" {
		t.Errorf("Unexpected container name: got %v, want %v", items[0].ItemName, "Item1")
	}
	if items[1].ItemName != "Item2" {
		t.Errorf("Unexpected container name: got %v, want %v", items[0].ItemName, "Item2")
	}
}

func TestContainersGet(t *testing.T) {
	// Set up the test database and server.
	setupTestDB()

	Handler := handler.ContainersGet(db)
	router := gin.Default()
	router.GET("/containers", Handler)

	// Insert a test user with a valid token into the database.
	validTokenUser := Account{Username: "testuser", Password: "testpassword", Token: "validtoken"}
	if err := db.Create(&validTokenUser).Error; err != nil {
		t.Fatalf("Failed to insert test user: %v", err)
	}

	// Create some test containers.
	parentContainer := Container{
		Name:     "Parent",
		ParentID: 0,
		LocID:    1,
		User:     "testuser",
	}
	childContainer1 := Container{
		Name:     "Child1",
		ParentID: 1,
		LocID:    2,
		User:     "testuser",
	}
	childContainer2 := Container{
		Name:     "Child2",
		ParentID: 1,
		LocID:    3,
		User:     "testuser",
	}

	err = db.Create(&parentContainer).Error
	if err != nil {
		t.Fatalf("Failed to create parent container: %v", err)
	}
	err = db.Create(&childContainer1).Error
	if err != nil {
		t.Fatalf("Failed to create child container 1: %v", err)
	}
	err = db.Create(&childContainer2).Error
	if err != nil {
		t.Fatalf("Failed to create child container 2: %v", err)
	}

	// Create a test request with a valid token and item name
	req, err := http.NewRequest("GET", "/containers?container_id=1", nil)
	if err != nil {
		t.Fatalf(FTC, err)
	}
	req.Header.Set("Authorization", "validtoken")

	// Perform the request using the test router
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	var containers []Container
	err = json.Unmarshal(resp.Body.Bytes(), &containers)
	if err != nil {
		t.Errorf("Failed to unmarshal response: %v", err)
	}

	if len(containers) != 2 {
		t.Errorf("Unexpected number of containers: got %v, want %v", len(containers), 2)
	}

	if containers[0].Name != "Child1" {
		t.Errorf("Unexpected container name: got %v, want %v", containers[0].Name, "Child1")
	}
	if containers[1].Name != "Child2" {
		t.Errorf("Unexpected container name: got %v, want %v", containers[0].Name, "Child1")
	}

}

func TestNameGet(t *testing.T) {
	// Set up the test database and server.
	setupTestDB()

	Handler := handler.NameGet(db)
	router := gin.Default()
	router.GET("/name", Handler)

	// Insert a test user with a valid token into the database.
	validTokenUser := Account{Username: "testuser", Password: "testpassword", Token: "validtoken"}
	if err := db.Create(&validTokenUser).Error; err != nil {
		t.Fatalf("Failed to insert test user: %v", err)
	}

	// Seed the database with some test data.
	container1 := Container{Name: "Container 1", LocID: 1, ParentID: 0, User: "testuser"}
	db.Create(&container1)

	container2 := Container{Name: "Container 2", LocID: 2, ParentID: 1, User: "testuser"}
	db.Create(&container2)

	expectedOutput := "\"Container 1/Container 2\""

	// Create a test request with a valid token and item name
	req, err := http.NewRequest("GET", "/name?Container_id=2", nil)
	if err != nil {
		t.Fatalf(FTC, err)
	}
	req.Header.Set("Authorization", "validtoken")

	// Perform the request using the test router
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	assert.Equal(t, expectedOutput, resp.Body.String())

}

func TestRegisterPost(t *testing.T) {
	// Set up the test database and server.
	setupTestDB()

	Handler := handler.RegisterPost(db)
	router := gin.Default()
	router.POST("/register", Handler)

	// Call the API endpoint to trigger auto-delete.
	reqBody := handler.RegisterRequest{
		Username:             "testuser",
		Password:             "password",
		PasswordConfirmation: "password",
	}

	reqBodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		t.Fatalf(FTM, err)
	}
	req, err := http.NewRequest("POST", "/register", bytes.NewBuffer(reqBodyBytes))
	if err != nil {
		t.Fatalf(FTC, err)
	}
	req.Header.Set(CT, "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Check that the response has a 200 status code.
	if status := w.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check that the response body contains a token and root location ID.
	var responseBody handler.LoginResponse
	if err := json.Unmarshal(w.Body.Bytes(), &responseBody); err != nil {
		t.Fatalf("Failed to unmarshal response body to JSON: %s", err)
	}

	if responseBody.Token == "" {
		t.Error("Response body did not contain a token")
	}

	if responseBody.RootLoc == 0 {
		t.Error("Response body did not contain a root location ID")
	}

	//Check that the token was saved to the database.
	var account handler.Account
	result := db.Table("accounts").Where("username = ?", "testuser").First(&account)
	assert.NoError(t, result.Error)
	assert.NotEmpty(t, account.Token)

}

func TestLoginPost(t *testing.T) {

	//Register
	// Set up the test database and server.
	setupTestDB()

	Handler := handler.RegisterPost(db)
	router := gin.Default()
	router.POST("/register", Handler)

	// Call the API endpoint to trigger auto-delete.
	reqBody := handler.RegisterRequest{
		Username:             "testuser",
		Password:             "password",
		PasswordConfirmation: "password",
	}

	reqBodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		t.Fatalf(FTM, err)
	}
	req, err := http.NewRequest("POST", "/register", bytes.NewBuffer(reqBodyBytes))
	if err != nil {
		t.Fatalf(FTC, err)
	}
	req.Header.Set(CT, "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Check that the response has a 200 status code.
	if status := w.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check that the response body contains a token and root location ID.
	var responseBody handler.LoginResponse
	if err := json.Unmarshal(w.Body.Bytes(), &responseBody); err != nil {
		t.Fatalf("Failed to unmarshal response body to JSON: %s", err)
	}

	if responseBody.Token == "" {
		t.Error("Response body did not contain a token")
	}

	if responseBody.RootLoc == 0 {
		t.Error("Response body did not contain a root location ID")
	}

	//Check that the token was saved to the database.
	var account handler.Account
	result := db.Table("accounts").Where("username = ?", "testuser").First(&account)
	assert.NoError(t, result.Error)
	assert.NotEmpty(t, account.Token)

	// LOGIN
	// Call the API endpoint to trigger auto-delete.
	reqBody2 := handler.LoginRequest{
		Username: "testuser",
		Password: "password",
	}

	reqBodyBytes2, err2 := json.Marshal(reqBody2)
	if err2 != nil {
		t.Fatalf(FTM, err2)
	}
	req2, err2 := http.NewRequest("POST", "/login", bytes.NewBuffer(reqBodyBytes2))
	if err2 != nil {
		t.Fatalf(FTC, err2)
	}
	req2.Header.Set(CT, "application/json")
	w2 := httptest.NewRecorder()
	router.ServeHTTP(w2, req2)

	if w2.Code == http.StatusOK {
		responseBody := struct {
			Token string `json:"token"`
		}{}
		err = json.Unmarshal(w2.Body.Bytes(), &responseBody)
		if err != nil {
			t.Fatal(err)
		}
		assert.NotEmpty(t, responseBody.Token)
		// expectedToken = responseBody.Token
	}

	// Check that the token was saved to the database.
	var account2 handler.Account
	result2 := db.Table("accounts").Where("username = ?", "testuser").First(&account2)
	assert.NoError(t, result2.Error)
	assert.NotEmpty(t, account2.Token)

}

func TestInventoryDelete(t *testing.T) {
	// Set up the test database and server.
	setupTestDB()

	Handler := handler.InventoryDelete(db)
	router := gin.Default()
	router.DELETE("/inventory", Handler)

	//Create container
	cont := Container{
		LocID:    1,
		Name:     "testcont",
		ParentID: 0,
		User:     "testuser",
	}

	if result := db.Table("containers").Create(&cont); result.Error != nil {
		t.Fatalf("failed to create recently deleted item: %v", result.Error)
	}

	cont2 := Container{
		LocID:    2,
		Name:     "testcont2",
		ParentID: 0,
		User:     "testuser",
	}

	if result := db.Table("containers").Create(&cont2); result.Error != nil {
		t.Fatalf("failed to create recently deleted item: %v", result.Error)
	}

	// Add a recently deleted item with a timestamp more than 30 days ago.
	oldItem := Item{
		ItemID:   1,
		User:     "testuser",
		ItemName: "old test item",
		LocID:    1,
		Count:    1,
	}

	if result := db.Table("items").Create(&oldItem); result.Error != nil {
		t.Fatalf("failed to create item: %v", result.Error)
	}

	newItem := Item{
		ItemID:   2,
		User:     "testuser",
		ItemName: "new test item",
		LocID:    2,
		Count:    2,
	}

	if result := db.Table("items").Create(&newItem); result.Error != nil {
		t.Fatalf("failed to create item: %v", result.Error)
	}

	// Call the API endpoint to trigger auto-delete.
	reqBody := handler.DeleteRequest{
		Token: "testtoken",
		ID:    2,
		Type:  "container",
	}

	reqBodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		t.Fatalf(FTM, err)
	}
	req, err := http.NewRequest("POST", "/delete", bytes.NewBuffer(reqBodyBytes))
	if err != nil {
		t.Fatalf(FTC, err)
	}
	req.Header.Set(CT, "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Verify that the new  item and container still exists.
	var deletedItem handler.Item
	if result := db.Table("items").First(&deletedItem, oldItem.ItemID); result.Error != nil {
		t.Fatalf("failed to find recently deleted item: %v", result.Error)
	}

	var deletedCont handler.Container
	if result := db.Table("containers").First(&deletedCont, cont.LocID); result.Error != nil {
		t.Fatalf("failed to find recently deleted item: %v", result.Error)
	}

	// Verify that the new  item and container was deleted.
	if result := db.Table("items").First(&deletedItem, newItem.ItemID); !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		t.Errorf("expected recently deleted item to be deleted, but found: %v", deletedItem)
	}

	if result := db.Table("containers").First(&deletedCont, cont2.LocID); result.Error == nil {
		t.Fatalf("failed to find recently deleted item: %v", result.Error)
	}

}

func TestDeleteDelete(t *testing.T) {
	// Set up the test database and server.
	setupTestDB()

	Handler := handler.DeleteDelete(db)
	router := gin.Default()
	router.DELETE("/delete", Handler)

	user := Account{
		Username: "testuser",
		Password: "password",
		Token:    "AB",
		RootLoc:  0,
	}
	// Save the test user account and item to the database.
	db.Create(&user)

	// Add a recently deleted item with a timestamp less than 30 days ago.
	newDeletedItem := RecentlyDeletedItem{
		ItemID:              2,
		AccountID:           "testuser",
		DeletedItemName:     "test item",
		DeletedItemLocation: 1,
		DeletedItemCount:    1,
		Timestamp:           time.Now(),
	}

	if result := db.Table("recently_deleted_items").Create(&newDeletedItem); result.Error != nil {
		t.Fatalf("failed to create recently deleted item: %v", result.Error)
	}

	// Call the API endpoint to trigger auto-delete.
	reqBody := handler.DeleteRequest{
		Token: "AB",
		ID:    2,
		Type:  "item",
	}

	reqBodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		t.Fatalf(FTM, err)
	}
	req, err := http.NewRequest("DELETE", "/delete", bytes.NewBuffer(reqBodyBytes))
	if err != nil {
		t.Fatalf(FTC, err)
	}
	req.Header.Set(CT, "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Verify that the recently deleted item with a timestamp less than 30 days ago still exists.
	var deletedItem handler.RecentlyDeletedItem
	// Verify that the recently deleted item with a timestamp more than 30 days ago was deleted.
	if result := db.Table("recently_deleted_items").First(&deletedItem, newDeletedItem.ItemID); !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		t.Errorf("expected recently deleted item to be deleted, but found: %v", deletedItem)
	}
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
		t.Fatalf(FTC, err)
	}

	// Perform the request using the test router
	resp := httptest.NewRecorder()
	r.ServeHTTP(resp, req)

	// Verify the response code and body
	assert.Equal(t, http.StatusOK, resp.Code)
	assert.Equal(t, "[{\"ItemID\":1,\"User\":\"testuser\",\"ItemName\":\"Where\",\"LocID\":0,\"Count\":0}]", resp.Body.String())
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

func TestAutoDeleteRecentlyDeletedItems(t *testing.T) {
	// Set up the test database and server.
	setupTestDB()

	Handler := handler.InventoryDelete(db)
	router := gin.Default()
	router.POST("/delete", Handler)

	Acc := Account{ //gorm.Model?
		Username: "testuser",
		Password: "password",
		Token:    "testtoken",
		RootLoc:  1,
	}

	db.Create(&Acc)

	// Add a recently deleted item with a timestamp more than 30 days ago.
	oldDeletedItem := RecentlyDeletedItem{
		ItemID:              1,
		AccountID:           "testuser",
		DeletedItemName:     "test item",
		DeletedItemLocation: 1,
		DeletedItemCount:    1,
		Timestamp:           time.Now().AddDate(0, 0, -31),
	}

	if result := db.Table("recently_deleted_items").Create(&oldDeletedItem); result.Error != nil {
		t.Fatalf("failed to create recently deleted item: %v", result.Error)
	}

	// Add a recently deleted item with a timestamp less than 30 days ago.
	newDeletedItem := Item{
		ItemID:   2,
		User:     "testuser",
		ItemName: "test item1",
		LocID:    1,
		Count:    1,
	}
	if result := db.Table("items").Create(&newDeletedItem); result.Error != nil {
		t.Fatalf("failed to create recently deleted item: %v", result.Error)
	}

	// Call the API endpoint to trigger auto-delete.
	reqBody := handler.DeleteRequest{
		Token: "testtoken",
		ID:    2,
		Type:  "item",
	}
	reqBodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		t.Fatalf(FTM, err)
	}
	req, err := http.NewRequest("POST", "/delete", bytes.NewBuffer(reqBodyBytes))
	if err != nil {
		t.Fatalf(FTC, err)
	}
	req.Header.Set(CT, "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Verify that the recently deleted item with a timestamp less than 30 days ago still exists.
	var deletedItem handler.RecentlyDeletedItem
	if result := db.Table("recently_deleted_items").First(&deletedItem, newDeletedItem.ItemID); result.Error != nil {
		t.Fatalf("failed to find recently deleted item: %v", result.Error)
	}

	// Verify that the recently deleted item with a timestamp more than 30 days ago was deleted.
	if result := db.Table("recently_deleted_items").First(&deletedItem, oldDeletedItem.ItemID); !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		t.Errorf("expected recently deleted item to be deleted, but found: %v", deletedItem)
	}
}

func TestGetChildren(t *testing.T) {
	// Create a mock database.
	setupTestDB()
	db.Create(&Container{LocID: 1, Name: "Parent"})
	db.Create(&Container{LocID: 2, Name: "Child1", ParentID: 1})
	db.Create(&Container{LocID: 3, Name: "Child2", ParentID: 1})

	// Test with a parent ID that has children.
	result := handler.GetChildren(1, "", db)
	if len(result) != 2 {
		t.Errorf("Expected 2 children, but got %d", len(result))
	}
	if result[0].Container.Name != "Child1" {
		t.Errorf("Expected first child name to be \"Child1\", but got %s", result[0].Container.Name)
	}
	if result[1].Container.Name != "Child2" {
		t.Errorf("Expected second child name to be \"Child2\", but got %s", result[1].Container.Name)
	}

	// Test with a parent ID that has no children.
	result = handler.GetChildren(2, "", db)
	if len(result) != 0 {
		t.Errorf("Expected 0 children, but got %d", len(result))
	}
}
func TestGetParent(t *testing.T) {
	// Create a mock database.
	setupTestDB()
	// Insert a test container into the database.
	container := Container{Name: "test-container", ParentID: 1, LocID: 123}
	if err := db.Create(&container).Error; err != nil {
		t.Fatalf("Failed to insert container: %v", err)
	}

	// Call the GetParent function with the test container's LocID.
	name, parentID := handler.GetParent(db, 123)

	// Check that the function returned the correct values.
	if name != "test-container" {
		t.Errorf("Expected name to be 'test-container', but got '%s'", name)
	}
	if parentID != 1 {
		t.Errorf("Expected parentID to be 1, but got %d", parentID)
	}

}

func TestDeleteItem(t *testing.T) {
	// Create a new in-memory database for testing purposes.
	setupTestDB()

	// Create a test user account and item to be deleted.
	user := Account{
		Username: "testuser",
		Password: "password",
	}
	item := Item{
		ItemID:   1,
		User:     "testuser",
		ItemName: "Test Item",
		LocID:    1,
		Count:    1,
	}
	// Save the test user account and item to the database.
	db.Create(&user)
	db.Create(&item)

	// Call the DeleteItem function to delete the test item.
	err = handler.DeleteItem(db, item.ItemID, user.Username)
	if err != nil {
		t.Fatalf("Failed to delete item: %v", err)
	}

	// Verify that the item has been deleted from the database.
	var deletedItem Item
	if result := db.Where("ItemID = ? AND username = ?", item.ItemID, user.Username).First(&deletedItem); !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		t.Fatalf("Expected item to be deleted, but found: %v", deletedItem)
	}

	// Verify that the recently deleted item has been added to the database.
	var recentlyDeleted RecentlyDeletedItem
	if result := db.Where("item_id = ? AND account_id = ?", item.ItemID, user.Username).First(&recentlyDeleted); result.Error != nil {
		t.Fatalf("Expected recently deleted item to be created, but found error: %v", result.Error)
	}
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
	if result != nil {
		t.Errorf("Unexpected error: %v", result)
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
	if result != nil {
		t.Errorf("Unexpected error: %v", result)
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
	if resultMsg != nil {
		t.Errorf("Error updating container: %v", resultMsg)
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
	if resultMsg != nil {
		t.Errorf("Error updating container: %v", resultMsg)
	}

	// Check that the container's location was updated in the database
	result = db.First(&updatedContainer, "LocID = ? AND username = ?", testContainer.LocID, "testUser")
	if result.Error != nil {
		t.Errorf("Error retrieving updated container from database: %s", result.Error.Error())
	} else if updatedContainer.ParentID != 1 {
		t.Errorf("Container location was not updated correctly")
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

// file::memory:?cache=shared or try this?
func setupTestDB() {
	db, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	db.AutoMigrate(&handler.Account{})
	db.AutoMigrate(&handler.Container{})
	db.AutoMigrate(&handler.Item{})
	db.AutoMigrate(&handler.RecentlyDeletedItem{})

}

var CT string = "Content-Type"
var FTM string = "failed to marshal request body: %v"
var FTC string = "failed to create request: %v"
