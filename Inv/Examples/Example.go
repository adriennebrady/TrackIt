package example

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// album represents data about a record album.
type album struct {
	ID     string  `json:"id"`
	Title  string  `json:"title"`
	Artist string  `json:"artist"`
	Price  float64 `json:"price"`
}

// albums slice to seed record album data.
var albums = []album{
	{ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
	{ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
	{ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

func main() {
	router := gin.Default()
	router.GET("/albums", getAlbums)
	router.GET("/albums/:id", getAlbumByID) ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	router.POST("/albums", postAlbums)

	router.Run("localhost:8080")
}

// getAlbums responds with the list of all albums as JSON.
func getAlbums(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, albums)
}

// postAlbums adds an album from JSON received in the request body.
func postAlbums(c *gin.Context) {
	var newAlbum album

	// Call BindJSON to bind the received JSON to
	// newAlbum.
	if err := c.BindJSON(&newAlbum); err != nil {
		return
	}

	// Add the new album to the slice.
	albums = append(albums, newAlbum)
	c.IndentedJSON(http.StatusCreated, newAlbum)
}

// getAlbumByID locates the album whose ID value matches the id
// parameter sent by the client, then returns that album as a response.
func getAlbumByID(c *gin.Context) {
	id := c.Param("id")

	// Loop through the list of albums, looking for
	// an album whose ID value matches the parameter.
	for _, a := range albums {
		if a.ID == id {
			c.IndentedJSON(http.StatusOK, a)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
}

/*

func TestAccountDelete(t *testing.T) {
	// Set up the test database and server.
	setupTestDB()

	Handler := handler.AccountDelete(db)
	router := gin.Default()
	router.DELETE("/account", Handler)

	// Seed the database with a test user.
	testuser := Account{
		Username: "testuser",
		Password: handler.HashAndSalt([]byte("password")),
		RootLoc:  2,
	}

	if err := db.Table("accounts").Create(&testuser).Error; err != nil {
		t.Fatalf("Failed to insert test user: %+v", err)

	}
	Cont := Container{
		ParentID: 0,
		User:     "testuser",
		Name:     "Test Cont",
		LocID:    2,
	}
	db.Create(&Cont)

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
	req, err := http.NewRequest("DELETE", "/account", bytes.NewBuffer(reqBodyBytes))
	if err != nil {
		t.Fatalf(FTC, err)
	}
	req.Header.Set(CT, "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Check that the response has a 200 status code.
	if status := w.Code; status != http.StatusNoContent {
		t.Errorf("Handler returned wrong status code: got %v want %v",
			status, http.StatusNoContent)
	}

	// Check that the test user was deleted from the database.
	var deletedUser Account
	if result := db.Table("accounts").Where("username = ?", "testuser").First(&deletedUser); result.Error == nil {
		t.Errorf("Expected user to be deleted from the database but found user: %v", deletedUser)
	}

}
*/
