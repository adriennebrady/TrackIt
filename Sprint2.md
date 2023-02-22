 
# TrackIt Sprint 2 <p>&nbsp;</p>

## Detail work you've completed in Sprint 2

### Front-End

### Back-End
* Create database using sqlite
* Create Web Login
<p>&nbsp;</p>

## List unit tests and Cypress tests for frontend
<p>&nbsp;</p>

## List unit tests for backend
<p>&nbsp;</p>

## Add documentation for your backend API 
* ### Login Post Request
The LoginPost API call is a HTTP POST request that allows a user to log in to the system by providing their username and password. The API returns a JSON response containing a token that can be used for subsequent API requests that require authentication.

#### Request
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
Response

The response body for the LoginPost API is a JSON object containing a single field:

token: A randomly generated token that is used for authentication in subsequent API requests (string).

Example response:
<pre>
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "e14fa2e2df12692b8475bf5bb5ed5be5"
}
</pre>
#### Errors

The LoginPost API can return the following errors:

400 Bad Request: The request body is missing or invalid.
401 Unauthorized: The username or password is incorrect.
500 Internal Server Error: The token could not be saved to the database.
#### Code

The LoginPost API is implemented in Go using the Gin framework and GORM library. The LoginPost function takes a *gorm.DB as an argument and returns a gin.HandlerFunc. The function first parses the request body and checks if the user exists in the database. If the user exists, the function checks if the password is correct. If the password is correct, the function generates a token and saves it to the database. Finally, the function returns the token in a JSON response.

The generateToken function generates a random token using the crypto/rand and fmt packages. The function returns a hexadecimal representation of the random bytes.
<p>&nbsp;</p>

* ### Register Post Request

This API call allows users to create a new account by providing a unique username and a password.

#### Request Body

The request body must be a JSON object with the following properties:

username (string, required): the username for the new account.
password (string, required): the password for the new account.
password_confirmation (string, required): a confirmation of the password for the new account. This field is used to ensure that the user has entered the same password correctly.
#### Response

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

#### Errors

This API call can return the following errors:

Invalid request body: the request body is not a valid JSON object.
User already exists: a user with the provided username already exists in the database.
Password and password confirmation do not match: the password and password confirmation fields do not match.
Failed to create user: an error occurred while attempting to create the user in the database.

### Inventory Get Request

Endpoint:
GET /inventory

#### Description:
This API endpoint allows retrieving all the inventory items from the database. It verifies the validity of a provided authentication token and then calls the GetAll method of the inventory.Getter interface to fetch the items from the database.

#### Request Headers:
Authorization - An authentication token

#### Request Body:
None

#### Response Status Code:
200 - OK
401 - Unauthorized

#### Response Body:
<pre>
{
"Name": "string",
"Quantity": "int",
"Price": "float64"
}
</pre>

#### Dependencies:

Trackit/Inv/platform/inventory - Package containing the inventory.Getter interface
github.com/gin-gonic/gin - Gin web framework for building APIs
gorm.io/gorm - GORM is an ORM library for Golang.
#### Functions:

InventoryGet - The main function that handles the GET request for the /inventory endpoint.
#### Parameters:

inv (inventory.Getter) - An instance of the inventory.Getter interface that is used to retrieve inventory items.
db (*gorm.DB) - A database object representing the connection to the database.
#### Return:

A gin.HandlerFunc function that can be used as a middleware for the /inventory GET endpoint.
#### Functionality:
The InventoryGet function checks for the presence of a valid authentication token in the request header. If the token is missing, it returns an error response with a status code of 401. If the token is present but invalid, it also returns an error response with a status code of 401.

If the authentication token is valid, the function calls the GetAll method of the inventory.Getter interface to retrieve all the inventory items from the database. It then returns a response with a status code of 200 and the inventory data in JSON format.

The isValidToken function is a helper function that verifies the validity of an authentication token. It first extracts the token from the authentication header and then queries the database to check if a user with the given token exists. If no user with the token is found, the function returns false, indicating that the token is invalid. If a user with the token is found, the function returns true if the token in the user object matches the provided token, indicating that the token is valid.

### Inventory Post Request
Endpoint: POST /inventory

This endpoint allows users to add or manipulate inventory items, containers, and locations.

#### Request Header:

Authorization: a valid token for user authentication
#### Request Body:

Name: string, required
Location: string, required
Kind: string (either "Container" or "Traverse")
##### Possible Values of "Kind":

"Container": create a new container for inventory items
"Traverse": move through existing containers and locations
"": add an inventory item to the current container
#### Example usage:
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

#### Response:

Status Code: 204 (No Content)
#### Notes:

If "Kind" is "Container", a new container with the provided name and location will be created and added to the current inventory container.
If "Kind" is "Traverse", the current inventory container will be updated to the specified location or parent container.
If "Kind" is empty, a new inventory item with the provided name and location will be created and added to the current inventory container.
If the request header is missing or invalid, the response will be a 401 Unauthorized error.

### Inventory Put Request

Update a container or item in the inventory.

#### Request Body

The request body must be a JSON object with the following properties:

Authorization: The authorization token.
Kind: The type of the object to update (Container or Item).
Name: The name of the container or item to update.
Location: The location of the container or item to update.
Type: The type of update (Rename or Relocate).

#### Headers

The following headers must be included in the request:

Authorization: The authorization token.
#### Response
Success

A successful response has a 204 No Content status code.

Error

If the request fails, a JSON object with an error message will be returned, along with an appropriate status code. Possible error responses are:

401 Unauthorized: The authorization token is missing or invalid.
404 Not Found: The container or item does not exist.
422 Unprocessable Entity: The request body is invalid.
#### Example
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

### **Inventory Delete Request**  

Endpoint:
DELETE /inventory

#### Description:
This API endpoint allows deleting an inventory item. It verifies the validity of a provided authentication token and then calls the Delete method of the inventory.Deleter interface to delete the item from the database.

#### Request Headers:
Authorization - An authentication token

#### Request Body:
<pre>
{
"Name": "string"
}
</pre>

#### Response Status Code:
204 - No Content
401 - Unauthorized

#### Response Body:
None

* #### Dependencies:

Trackit/Inv/platform/inventory - Package containing the inventory.Deleter interface
github.com/gin-gonic/gin - Gin web framework for building APIs
gorm.io/gorm - GORM is an ORM library for Golang.
* #### Functions:

InventoryDelete - The main function that handles the DELETE request for the /inventory endpoint.
* #### Parameters:

inv (inventory.Deleter) - An instance of the inventory.Deleter interface that is used to delete inventory items.
db (*gorm.DB) - A database object representing the connection to the database.
* #### Return:

A gin.HandlerFunc function that can be used as a middleware for the /inventory DELETE endpoint.
* #### Functionality:
The InventoryDelete function checks for the presence of a valid authentication token in the request header. If the token is missing, it returns an error response with a status code of 401. If the token is present but invalid, it also returns an error response with a status code of 401.

If the authentication token is valid, the function attempts to parse the request body to get the name of the item to be deleted. It then calls the Delete method of the inventory.Deleter interface to delete the item from the database.

Finally, the function returns a response with a status code of 204 if the item was successfully deleted.
