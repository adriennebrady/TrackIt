 
# TrackIt Sprint 2

## Detail work you've completed in Sprint 2

### Front-End
* Implemented login and sign-up functionalities and connected them to the backend through an authService.
* Clicking "login" or "sign up" now makes a post request that checks for the user in the database and returns a token upon login or sign up. This token is stored in the local storage and is used to make inventory requests or check if the user is logged in.
* Connected existing features to the backend.
* Added functionality to all buttons on the navbar, making it possible for users to navigate to different pages on the website.
* Implemented conditional display of navbar buttons based on login status. Prior to logging in, the navbar displays login and sign-up buttons. However, after logging in, these buttons are replaced with the "my inventory" button.
* Implemented an authGuard that redirects users to the login page if they try to access a specific page only accessible to logged-in users. After successfully logging in, the user is redirected back to the page they were trying to access.
* Connected the inventory to the backend, enabling users to create, delete, and rename items through post, delete, and put requests, respectively.
* Enabled users to navigate directly to containers using containers/ID, and clicking "back" will bring them back to the previous page.

### Back-End
* Create database using sqlite
* Adding, Relocating, Renaming, Deleting (Containers and Items) updated
* Create Web Login
<p>&nbsp;</p>

## List unit tests and Cypress tests for frontend
### Cypress Tests
* Visit TrackIt Home Page
* Visit About Page from Home Page
* Visit Login Page from Home Page
* Visit Signup Page from Home Page
* Login Authentication
* Visit About Page from My Inventory Page
* Login User then Signout
* Create Container 

### Unit Tests
* ContainerComponent
  * should create
  * should call openConfirmDialog on click of delete button
  * should display the container name and description
* ItemComponent
  * should create
  * should display the item name and location
* AuthService
  * should logout a user
  * should signup a user
  * should be created
  * should login a user
  * should return true if the user is authenticated
  * should return the token
* ContainerCardPageComponent
  * should create
* HomeComponent
  * should display the home page description
  * should display the home page title
  * should have a button to get started
  * should have a button for Login
  * should have a button for About
  * should have a button for Sign Up
  * should display the TRACKIT logo
* AuthGuard
  * canActivate
  * should return true for user with token in localStorage
  * should return true for authenticated user
  * should redirect to login page for unauthenticated user
  * checkLogin
  * should return true for authenticated user
  * should return true for user with token in localStorage
  * should redirect to login page for unauthenticated user
* ConfirmDialogComponent
  * should create
  * should display confirm dialog title
* SignUpPageComponent
  * should create
  * onSubmit() should not navigate to inventory page if passwords do not match
  * constructor should navigate to inventory page if user is already authenticated
  * onSubmit() should call authService.signup() and navigate to inventory page on successful sign-up
* AppComponent
  * should have as title 'cen3031-project'
  * should create the app
* AboutComponent
  * should create
  * should display the correct content when user is logged out
  * should display the correct content when user is logged in
* InventoryPageComponent
  * should display the correct page title and description
  * should create
  * should display the correct navigation
  * should call openDialog on click of new container button
* DialogComponent
  * should call onNoClick() when cancel button is clicked
  * should display rename dialog title
  * should create
* RenameDialogComponent
  * should call cancel() when cancel button is clicked
  * should display rename dialog title
  * should create
* LoginPageComponent
  * should create
  * onSubmit
  * should navigate to /inventory on successful login and no redirect URL is set
  * should navigate to the redirect URL on successful login and a redirect URL is set
  * should call authService.loginSuccess on successful login
  * should call authService.login with the correct user

## List unit tests for backend
### (Included in the video)
* #### TestAdd
* #### TestGetAll
* #### TestRename
* #### TestRelocate
* #### TestDelete
* #### TestAddContainer
* #### TestTraverseContainer
* #### TestRenameContainer
* #### TestRelocateContainer
* #### TestDeleteContainer

## Add documentation for your backend API 
### &ndash; Login Post Request
* #### &emsp; Description:
The LoginPost API call is a HTTP POST request that allows a user to log in to the system by providing their username and password. The API returns a JSON response containing a token that can be used for subsequent API requests that require authentication.

* #### &emsp; Request:
The request body for the LoginPost API must be in JSON format and contain the following fields:
username: The username of the user trying to log in (string).
password: The password of the user trying to log in (string).

Example request:
<pre>
POST /login
Content-Type: application/json

{
  "username": "example_user",
  "password": "example_password"
}
</pre>
Response: The response body for the LoginPost API is a JSON object containing a single field:

token: A randomly generated token that is used for authentication in subsequent API requests (string).

Example response:
<pre>
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "e14fa2e2df12692b8475bf5bb5ed5be5"
}
</pre>
* #### &emsp; Errors:

The LoginPost API can return the following errors:

400 Bad Request: The request body is missing or invalid.
401 Unauthorized: The username or password is incorrect.
500 Internal Server Error: The token could not be saved to the database.
* #### &emsp; Code:

The LoginPost API is implemented in Go using the Gin framework and GORM library. The LoginPost function takes a *gorm.DB as an argument and returns a gin.HandlerFunc. The function first parses the request body and checks if the user exists in the database. If the user exists, the function checks if the password is correct. If the password is correct, the function generates a token and saves it to the database. Finally, the function returns the token in a JSON response.

The generateToken function generates a random token using the crypto/rand and fmt packages. The function returns a hexadecimal representation of the random bytes.

---------------------

### &ndash; Register Post Request
* ####  &emsp; Description:
This API call allows users to create a new account by providing a unique username and a password.

* ####  &emsp; Request Body:

The request body must be a JSON object with the following properties:

username (string, required): the username for the new account.
password (string, required): the password for the new account.
password_confirmation (string, required): a confirmation of the password for the new account. This field is used to ensure that the user has entered the same password correctly.
* ####  &emsp; Response:

If the registration is successful, the API will return an HTTP 200 OK response with a JSON object containing a token string:

<pre>
{
  "token": "<token>"
}
</pre>

If the registration fails due to a bad request, the API will return an HTTP 400 Bad Request response with a JSON object containing an error message:

<pre>
{
  "error": "<error message>"
}
</pre>

If the registration fails due to an internal server error, the API will return an HTTP 500 Internal Server Error response with a JSON object containing an error message:

<pre>
{
  "error": "Failed to create user"
}
</pre>

* #### &emsp; Errors:

This API call can return the following errors:

Invalid request body: the request body is not a valid JSON object.
User already exists: a user with the provided username already exists in the database.
Password and password confirmation do not match: the password and password confirmation fields do not match.
Failed to create user: an error occurred while attempting to create the user in the database.

---------------------

###  &ndash; Inventory Get Request
* ####  &emsp;  Description:
This API endpoint allows retrieving all the inventory items from the database. It verifies the validity of a provided authentication token and then calls the GetAll method of the inventory.Getter interface to fetch the items from the database.

* ####  &emsp;Request Headers:
Authorization - An authentication token

* ####  &emsp; Request Body:
None

* ####  &emsp; Response Status Code:
200 - OK
401 - Unauthorized

* ####  &emsp; Response Body:
<pre>
{
"Name": "string",
"Quantity": "int",
"Price": "float64"
}
</pre>

* ####  &emsp; Functions:

InventoryGet - The main function that handles the GET request for the /inventory endpoint.
* ####  &emsp; Parameters:

inv (inventory.Getter) - An instance of the inventory.Getter interface that is used to retrieve inventory items.
db (*gorm.DB) - A database object representing the connection to the database.
* ####  &emsp; Return:

A gin.HandlerFunc function that can be used as a middleware for the /inventory GET endpoint.
* ####  &emsp; Functionality:
The InventoryGet function checks for the presence of a valid authentication token in the request header. If the token is missing, it returns an error response with a status code of 401. If the token is present but invalid, it also returns an error response with a status code of 401.

If the authentication token is valid, the function calls the GetAll method of the inventory.Getter interface to retrieve all the inventory items from the database. It then returns a response with a status code of 200 and the inventory data in JSON format.

The isValidToken function is a helper function that verifies the validity of an authentication token. It first extracts the token from the authentication header and then queries the database to check if a user with the given token exists. If no user with the token is found, the function returns false, indicating that the token is invalid. If a user with the token is found, the function returns true if the token in the user object matches the provided token, indicating that the token is valid.

---------------------

###  &ndash; Inventory Post Request

* ####  &emsp; Request Header:

Authorization: a valid token for user authentication
* ####  &emsp;  Request Body:

Name: string, required
Location: string, required
Kind: string (either "Container" or "Traverse")

* ####  &emsp; Example usage:
<pre>
await fetch('/inventory', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
        Name: 'brush',
        Location: 'dresser'
    })
})

await fetch('/inventory', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
        Name: 'brush',
        Location: 'brusher',
        Type: 'Rename'
    })
})

await fetch('/inventory', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
        Name: 'brush',
        Location: 'closet',
        Type: 'Relocate'
    })
})
</pre>

* ####  &emsp; Response:

Status Code: 204 (No Content)
* ####  &emsp; Notes:

If "Kind" is "Container", a new container with the provided name and location will be created and added to the current inventory container.
If "Kind" is "Traverse", the current inventory container will be updated to the specified location or parent container.
If "Kind" is empty, a new inventory item with the provided name and location will be created and added to the current inventory container.
If the request header is missing or invalid, the response will be a 401 Unauthorized error.

---------------------

### &ndash;Inventory Put Request
* ####  &emsp; Description:
This API endpoint allows updating a container or item in the inventory.

* ####  &emsp; Request Body:

The request body must be a JSON object with the following properties:

Authorization: The authorization token.
Kind: The type of the object to update (Container or Item).
Name: The name of the container or item to update.
Location: The location of the container or item to update.
Type: The type of update (Rename or Relocate).

* ####  &emsp; Headers:

The following headers must be included in the request:

Authorization: The authorization token.
* ####  &emsp; Response:
Success: A successful response has a 204 No Content status code.

Error: If the request fails, a JSON object with an error message will be returned, along with an appropriate status code. Possible error responses are:

401 Unauthorized: The authorization token is missing or invalid.
404 Not Found: The container or item does not exist.
422 Unprocessable Entity: The request body is invalid.
* ####  &emsp; Example:
Request
<pre>
PUT /inventory HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
    "Kind": "Container",
    "Name": "myContainer",
    "Location": "newLocation",
    "Type": "Relocate"
}
</pre>

Response
<pre>
HTTP/1.1 204 No Content
</pre>

---------------------

### &ndash;Inventory Delete Request

* ####  &emsp; Description:
This API endpoint allows deleting an inventory item. It verifies the validity of a provided authentication token and then calls the Delete method of the inventory.Deleter interface to delete the item from the database.

* ####  &emsp; Request Headers:
Authorization - An authentication token

* ####  &emsp; Request Body:
<pre>
{
"Name": "string"
}
</pre>

* ####  &emsp; Response Status Code:
204 - No Content
401 - Unauthorized

* ####  &emsp; Response Body:
None

* ####  &emsp; Functions:

InventoryDelete - The main function that handles the DELETE request for the /inventory endpoint.
* ####  &emsp; Parameters:

inv (inventory.Deleter) - An instance of the inventory.Deleter interface that is used to delete inventory items.
db (*gorm.DB) - A database object representing the connection to the database.
* ####  &emsp; Return:

A gin.HandlerFunc function that can be used as a middleware for the /inventory DELETE endpoint.
* ####  &emsp; Functionality:
The InventoryDelete function checks for the presence of a valid authentication token in the request header. If the token is missing, it returns an error response with a status code of 401. If the token is present but invalid, it also returns an error response with a status code of 401.

If the authentication token is valid, the function attempts to parse the request body to get the name of the item to be deleted. It then calls the Delete method of the inventory.Deleter interface to delete the item from the database.

Finally, the function returns a response with a status code of 204 if the item was successfully deleted.
