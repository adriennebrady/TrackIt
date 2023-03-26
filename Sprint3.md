# TrackIt Sprint 3

## Video Link

## Detail work you've completed in Sprint 3

### Front-End
* (List here)

### Back-End
* (List here)
<p>&nbsp;</p>

## List frontend unit tests
* (List here)

## List backend unit tests
### (Included in the video)
* #### Sprint 2
  * TestAdd
  * TestGetAll
  * TestRename
  * TestRelocate
  * TestDelete
  * TestAddContainer
  * TestTraverseContainer
  * TestRenameContainer
  * TestRelocateContainer
  * TestDeleteContainer

* #### Sprint 3
  * (List more...)
<p>&nbsp;</p>

## Show updated documentation for your backend API 
### &ndash; Login Post Request
* ####  &emsp; Description:
This API contains a handler package that provides an endpoint for user authentication. Specifically, it allows users to log in and generate a token, which can be used to authenticate future requests to the API.

* ####  &emsp; Request:
The API provides a single POST endpoint for user authentication. The request should include a JSON payload with a username and password field. The endpoint expects the payload to be in the following format:

<pre>
{
"username": "example_username",
"password": "example_password"
}
</pre>

* ####  &emsp; Errors:
The API returns these possible error responses:
   1. Invalid request body (HTTP 400): If the request payload is not in the expected format, the API returns an HTTP 400 error.
   2. Invalid username or password (HTTP 401): If the provided username or password is incorrect, the API returns an HTTP 401 error.
   3. Failed to save token (HTTP 500): If the API fails to save the generated token to the database, it returns an HTTP 500 error.

* ####  &emsp; Response:
If the authentication is successful, the API returns a JSON payload with a token and rootLoc field. The token can be used to authenticate future requests, and the rootLoc field specifies the user's root location.

The response payload is in the following format:

{
"token": "example_token",
"rootLoc": 0
}

* ####  &emsp; Functionality:
The API's LoginPost function handles the POST request for user authentication. It first checks if the request payload is in the expected format, and if not, returns an HTTP 400 error. Next, it queries the database to check if the user exists and if the provided password is correct. If either of these checks fails, the function returns an HTTP 401 error.

If the user authentication is successful, the function generates a token and saves it to the database. If the saving process fails, the function returns an HTTP 500 error. Otherwise, the function returns a JSON payload with the generated token and the user's root location.


---------------------

### &ndash; Register Post Request
* ####  &emsp; Description:
This API handles registration of new users by accepting HTTP POST requests with JSON payloads containing the user's desired username, password, and password confirmation. The API then checks if the user already exists and if the password and password confirmation match. If the checks pass, the API creates a new user account, generates a hash and salted password, generates a unique token for the user, creates a new container for the user, and commits all changes to the database.

* ####  &emsp; Request:
The request is a POST HTTP request to the endpoint /register, containing a JSON payload with the following fields:

  * username: a string representing the user's desired username
  * password: a string representing the user's desired password
  * password_confirmation: a string representing the user's password confirmation

* ####  &emsp; Errors:
The API returns the following error responses:

  * 400 Bad Request with a JSON payload containing "error": "Invalid request body" if the request body is invalid.
  * 400 Bad Request with a JSON payload containing "error": "User already exists" if a user with the provided username already exists.
  * 400 Bad Request with a JSON payload containing "error": "Password and password confirmation do not match" if the provided password and password confirmation do not match.
  * 500 Internal Server Error with a JSON payload containing "error": "Failed to get max LocID", "error": "Failed to create user", "error": "Failed to create container", or "error": "Failed to update user's RootLoc" if there are any database errors.

* ####  &emsp; Response:
The API returns a JSON payload with the following fields:

  * token: a string representing the user's unique token.
  * rootLoc: an integer representing the unique ID of the user's container.

* ####  &emsp; Functionality:
The API accepts HTTP POST requests to the /register endpoint. Upon receiving a valid request, it creates a new user account and generates a unique token for the user. The API also creates a new container for the user and commits all changes to the database. Finally, the API returns the token and container ID to the user.

---------------------

###  &ndash; Inventory Get Request
* ####  &emsp; Description:
This API is used to retrieve a list of containers and items in a specific container. It checks the validity of the token and the user's authorization before executing the request.

* ####  &emsp; Request
The request is a GET request with the following parameters:

  * Authorization - A token for user authorization.
  * container_id - The ID of the container to retrieve.

* ####  &emsp; Errors
The API may return the following errors:

  * Invalid token - The provided token is not valid.
  * Invalid container ID - The provided container ID is not valid.
  * Invalid container - The provided container does not belong to the user.
  * Failed to get containers - There was an error retrieving the list of containers.
  * Failed to get items - There was an error retrieving the list of items.

* ####  &emsp; Response
The API will return a JSON response with the following data:

  * Containers - A list of containers that have the requested container as their parent.
  * Items - A list of items that are in the requested container.

* ####  &emsp; Functionality
The API will check the user's authorization by validating the token provided in the request header. If the token is invalid, the API will return an error response. If the token is valid, the API will get the container ID from the URL parameter and check if the container belongs to the user. If the container does not belong to the user, the API will return an error response.

If the container belongs to the user, the API will retrieve all containers that have the requested container as their parent and all items that are in the requested container. The containers and items are merged into a single slice, which is returned as a JSON response.


---------------------

###  &ndash; Inventory Post Request
* ####  &emsp; Description:
The InventoryPost API is a RESTful API that allows users to add items or containers to the inventory by sending a POST request with a JSON payload. This API authenticates the user by verifying the user token before proceeding to add the requested item or container. The API is built with the Gin Gonic framework and uses the GORM ORM for database operations.

* ####  &emsp; Request:
The API expects a POST request with a JSON payload containing the following fields:

  * Authorization: The user token for authentication.
  * Kind: Indicates the type of object to add, whether a container or an item.
  * ID: A unique ID for the object to add.
  * Cont: The parent container ID if the object is an item.
  * Name: The name of the object.
  * Type: The type of object to add, such as a "book" or "tool".

* ####  &emsp; Errors:
The API returns the following HTTP error codes and response messages:

  * 400 Bad Request: Returned when the request payload is invalid.
  * 401 Unauthorized: Returned when the user token is invalid.
  * 500 Internal Server Error: Returned when an error occurs while processing the request.

* ####  &emsp; Response:
The API returns an HTTP status code of 204 No Content upon successful creation of the requested item or container.

* ####  &emsp; Functionality:
The InventoryPost API accepts a POST request with a JSON payload and adds the requested item or container to the inventory database. If the request payload is invalid or the user token is invalid, the API returns an appropriate HTTP error code and response message. The API returns an HTTP status code of 204 No Content upon successful creation of the requested item or container. The API can be tested using a variety of tools such as cURL or JavaScript fetch() method.

---------------------

### &ndash; Inventory Put Request
* ####  &emsp; Description:
This API allows authorized users to update the inventory by either renaming or relocating a container or an item within a container. The API uses Gin for handling HTTP requests and GORM for database management.

* ####  &emsp; Request:
The API expects a PUT request to be sent with a JSON payload in the following format:
{
"Authorization": "Bearer <token>",
"Kind": "Container/Item",
"ID": "<ID of the container/item to be updated>",
"Type": "Rename/Relocate",
"Name": "<New name of the container/item>",
"Cont": "<New location of the container/item>"
}

The Authorization field should contain a valid JWT token that the API uses to authenticate and authorize the user. The Kind field specifies whether the update is for a container or an item. The ID field contains the ID of the container or item to be updated. The Type field specifies whether the update is for renaming or relocating the container or item. The Name field contains the new name for the container or item (if the update type is Rename). The Cont field contains the new location for the container or item (if the update type is Relocate).

* ####  &emsp; Errors:
The API returns the following error messages:

  * Invalid request body: Returned when the request body is missing or invalid.
  * Invalid token: Returned when the token in the Authorization field is invalid.
  * Invalid Kind: Returned when the Kind field in the request is neither "Container" nor "Item".
  * Container/Item not found: Returned when the container/item ID in the request is not found in the database.
  * Database error: Returned when there is an error while updating the container/item in the database.
  
* ####  &emsp; Response:
The API returns a 204 No Content status code if the container/item is updated successfully.

* ####  &emsp; Functionality:
The InventoryPut function is the main handler function for the API. It extracts the request payload, validates the token, and delegates the update request to the appropriate handler function depending on the Kind field. The ContainerPut and ItemPut functions handle the container and item updates, respectively. They first look up the container/item in the database by ID and username, then update the container/item's name or location based on the Type field in the request, and finally save the changes to the database. If any error occurs while updating the container/item, the functions return an error message that is propagated back to the client.

---------------------

### &ndash; Inventory Delete Request
* ####  &emsp; Description:
This API provides functionality for deleting items and containers from an inventory management system. The API expects requests to include a valid token, a type (either "item" or "container"), and an ID corresponding to the item or container to be deleted.

* ####  &emsp; Request:
The request to the API should include a JSON body with the following fields:

  * "token": A string containing a valid token for the user making the request.
  * "type": A string indicating whether the ID corresponds to an item or container.
  * "id": An integer representing the ID of the item or container to be deleted.

* ####  &emsp; Errors:
The API will return an error response if any of the following occur:

  * The request body is invalid.
  * The token is invalid.
  * The type field is invalid.
  * There is an error deleting the item or container.

* ####  &emsp; Response:
The API will return a response with a status code indicating success or failure. If the request is successful, the API will return a status code of 204 (No Content).

* ####  &emsp; Functionality:
The InventoryDelete function is the primary endpoint of the API. It takes in a database connection and returns a gin.HandlerFunc to handle HTTP requests. The function validates the request body, token, and type before calling either the deleteItem or DestroyContainer function depending on the type field. The deleteItem function deletes the specified item and saves a record of the deletion to the database. The DestroyContainer function deletes the specified container and all items and sub-containers associated with it.

---------------------

### &ndash; Name Get Request
* ####  &emsp; Description:
This API endpoint allows a user to get the name of a container given its ID.

* ####  &emsp; Request
The endpoint accepts a GET request with the following parameters:

  * Authorization: a token string that verifies the identity of the user.
  * Container_id: an integer representing the ID of the container to be retrieved.

* ####  &emsp; Errors
The endpoint can return the following errors:

  * 401 Unauthorized: when the Authorization token is missing or invalid.
  * 400 Bad Request: when the container ID is not a valid integer.
  * 500 Internal Server Error: when there is a problem retrieving the container name from the database.

* ####  &emsp; Response
If successful, the endpoint returns a JSON object with the following format:

<pre>
{
  "names": "container_name"
}
</pre>

* ####  &emsp; Functionality
When the API is called, it first checks the Authorization token to verify the identity of the user. If the token is valid, it retrieves the container ID from the request parameter and queries the database for the name of the container that matches the given ID and username. If the query is successful, it returns a JSON response with the name of the container. Otherwise, it returns an error with an appropriate message.

---------------------

### &ndash; Search Get Request
* ####  &emsp; Description:
This API allows a user to search for a specific item in their account. It takes in a search request that contains an authorization token and an item name, and responds with a JSON object containing a list of all items in the account that match the specified item name.

* ####  &emsp; Request:
The API expects an HTTP GET request to the endpoint "/search". The request must contain a JSON object with the following fields:

<pre>
{
    Authorization string `json:"Authorization"`
	  Item          string `json:"Item"`
}
</pre>

Authorization (string): A valid authorization token.
Item (string): The name of the item to search for.

* ####  &emsp; Errors:
If the API encounters an error, it will respond with an HTTP error code and a JSON object containing an error message. The following error codes may be returned:

  * 401 Unauthorized: The authorization token is invalid.
  * 500 Internal Server Error: An error occurred while processing the request.

* ####  &emsp; Response:
If the request is successful, the API will respond with an HTTP status code of 200 and a JSON object containing a list of all items in the account that match the specified item name. The JSON object will contain the following fields for each item:

  * ItemID (int): The unique identifier for the item.
  * ItemName (string): The name of the item.
  * Quantity (int): The quantity of the item.
  * Username (string): The username of the account the item belongs to.

* ####  &emsp; Functionality:
This API takes in a search request with an authorization token and an item name. It verifies that the token is valid and belongs to the user whose items are being searched. It then searches the account for all items that match the specified item name and responds with a JSON object containing a list of all matching items. If an error occurs, the API will respond with an appropriate error code and error message.


---------------------

### &ndash; Account Delete Request
* ####  &emsp; Description:
This API deletes an account from the system, along with associated resources. It takes in a JSON request containing the username and password of the account to be deleted, and returns a status code of 204 if successful.

* ####  &emsp; Request:
This API expects a POST request to the endpoint /account/delete, with the following JSON request body:

<pre>
{
    "username": "string",
    "password": "string",
    "passwordConfirmation": "string"
}
</pre>

  * username: the username of the account to be deleted (required)
  * password: the password of the account to be deleted (required)
  * passwordConfirmation: the confirmation of the password (required)

* ####  &emsp; Errors:
This API returns the following error responses:

  * 400 Bad Request: The request is invalid.
  * 404 Not Found: The requested user does not exist.
  * 401 Unauthorized: Invalid username or password.
  * 500 Internal Server Error: An unexpected error occurred.
  *
* ####  &emsp; Response:
If the request is successful, the API returns a status code of '204 No Content', indicating that the request was successful but there is no response body.

* ####  &emsp; Functionality:
The API first parses the request body and ensures that the provided username and password match an existing account in the system. If the user does not exist or the passwords do not match, an appropriate error response is returned.

If the username and password are correct, the API begins a database transaction to ensure atomicity. It then calls the 'destroyUserResources' function to delete any resources associated with the user, such as files or directories. If this step fails, an appropriate error response is returned and the transaction is rolled back.

Finally, the API deletes the user's account from the database, commits the transaction, and returns a success response.
