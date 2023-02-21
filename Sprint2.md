 
# TrackIt Sprint 2

## Detail work you've completed in Sprint 2

### Front-End

### Back-End
* Create database using sqlite
* Create Web Login

## List unit tests and Cypress tests for frontend

## List unit tests for backend

## Add documentation for your backend API 
### Login Post Request
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

### Register Post Request

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

### Inventory Post Request

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

### Inventory Delete Request
