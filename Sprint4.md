# TrackIt Sprint 4

## Detail work you've completed in Sprint 4

### Front-End

* Adrienne Brady
  * Added new functionality to allow user to update the item count with a pop-up dialog
  * Added new functionality & increment/decrement buttons to allow user to quickly increase/decrease an item's count by 1
  * Added new sidebar functionality on the inventory page with a toggle button to hide/display the navigation tree
  * Added sidebar navigation tree to all logged in pages
  * Added new move/relocate menu to items and containers
  * Added new recently deleted page with options to permanently delete or restore items
  * Added buttons linked to recently deleted page and settings page for logged in users
  * Created new account settings page with account deletion functionality
  * Created password verification pop up dialog component for account deletion
  * Created new move/relocate pop up dialog
  * Created new sidebar navigation tree component w/buttons to directly navigate to any container card page
  * Updated item component to now display actual item count
  * Updated item HTTP POST request to send "1" as the default item count if user doesn't input a value
  * Updated sidenav to take up entire side of screen
  * Fixed container and item GET requests to account for new container and item GET handlers in the backend
  * Fixed sidebar nav. so it now automatically updates when containers are added/deleted
  * Fixed recently deleted get and delete HTTP requests
  * Fixed display of container name

* Sara Winner
  * Remove description from containers
  * Remove description field from pop-up dialog
  * Update existing Cypress tests to succeed without container description
  * Fixed the following Jasmine unit test failures due to software updates:
    * MoveMenuComponent—should create
    * SidebarNavComponent—should create
    * DeletedItemComponent—should create
    * RecentlyDeletedComponent—should create
    * RecountDialogComponent—should create
    * SettingsComponent—should create
    * DeleteAccountDialogComponent—should create
    * AboutComponent—should display the correct content when user is logged in
    * MoveDialogComponent—should create
    * ContainerCardPageComponent
    * InventoryPageComponent
    * SearchComponent

### Back-End

* New additions
  * Tests for new functions
  * Handler for getting the user's tree of containers
  * Function that returns the children inside a container
  * Function for getting a container's parent
  * Function that returns the highest LocID in database for handlers
  * Manual deletion of recently deleted items
  * Auto-deletion of recently deleted items after 30 days
  * Instructions for running on a Windows device
* Fixes/Patches
  * Unit tests past issues for backend changes
  * DeletedGet errors
  * Get handler for recently deleted items
  * Manual deletion of recently deleted items
  * Handler for getting container name that recursively adds parent containers to path
* Improvements
  * Updated recently deleted to include 'location' and 'Count' to help when restoring a recently deleted item
  * Updated RegisterPost to check if container is empty
  * Split InventoryGet into ItemGet and ContainerGet
  * Optimized invdelete, invput, and invpost handlers with switches (and put tests)
  * Set trusted proxies

<p>&nbsp;</p>

## List frontend unit and Cypress tests

* (List here)

<p>&nbsp;</p>

## List backend unit tests

* ### Sprint 4
  
  * TestAccountDelete
  * TestDeletedGet
  * TestInventoryPut
  * TestTreeGet
  * TestGetMaxLocID
  * TestInventoryPost
  * TestItemsGet
  * TestContainersGet
  * TestNameGet
  * TestRegisterPost
  * TestLoginPost
  * TestInventoryDelete
  * TestDeleteDelete
  * TestAutoDeleteRecentlyDeletedItems
  * TestGetChildren
  * TestGetParent

* ### Sprint 3
  
  * TestDeleteItem
  * TestItemPut
  * TestContainerPut
  * TestDestroyContainer
  * TestInventoryGet
  * TestSearchGet
  * TestIsValidToken
  * TestComparePasswords
  * TestPingGet
  * TestGenerateToken
  * TestHashAndSalt
  
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

<p>&nbsp;</p>

## Show updated documentation for your backend API

### &ndash; Account Delete Request

* ####  &emsp; Description

This API endpoint is designed to delete an existing account. It takes in a JSON payload containing a username, password, and password confirmation. If the account exists, the password is correct, and the password confirmation matches the password, the account will be deleted. If the account doesn't exist, an error message will be returned. If the password is incorrect, an error message will also be returned. The endpoint is implemented using the Gin web framework and GORM ORM for database access.

* ####  &emsp; Request
The API endpoint is an HTTP POST request that accepts a JSON payload with the following fields:

  1. username: a string representing the username of the account to be deleted.
  2. password: a string representing the password of the account to be deleted.
  3. password_confirmation: a string representing the confirmation password for the deletion   process.

* ####  &emsp; Errors

The API can return the following HTTP status codes and error messages:

  1. 400 Bad Request: If the request body is invalid or if the password and password confirmation do not match.
  2. 401 Unauthorized: If the username or password is invalid.
  3. 404 Not Found: If the user does not exist in the database.
  4. 406 Not Acceptable: If the account could not be deleted from the database.
  5. 500 Internal Server Error: If there is an internal server error during the process.

* ####  &emsp; Response

The API endpoint returns an HTTP status code and a JSON payload:

  1. HTTP 204: if the account was deleted successfully.
  2. HTTP 400: if the request payload is invalid.
  3. HTTP 401: if the password provided is incorrect.
  4. HTTP 404: if the account does not exist.
  5. HTTP 406: if an error occurs during the deletion process.
  6. JSON payload: empty JSON object.

* ####  &emsp; Functionality
The API endpoint first validates the request payload and checks if the account exists. If the account exists, it checks if the password and password confirmation fields match and if the password provided is correct. If all checks pass, it starts a new transaction to ensure atomicity, deletes the account, and commits the transaction. If any error occurs during this process, it rolls back the transaction and returns an error message with the appropriate HTTP status code.

---------------------

### &ndash; Container Get Request

* ####  &emsp; Description

This API provides functionality for getting all the containers that belong to a user and have a specified container ID as their parent. It validates the user's authorization token, the container ID, and checks if the container belongs to the user.

* ####  &emsp; Request

This API requires a GET request with the following parameters:

  1. Authorization header: A valid user token is required to access this endpoint.
  2. container_id: An integer parameter that specifies the container ID.

* ####  &emsp; Errors

This API may return the following errors:

  1. 401 Unauthorized: The user's token is invalid or has expired.
  2, 400 Bad Request: The container ID parameter is missing or not an integer.
  3. 401 Unauthorized: The container does not belong to the user.
  4. 500 Internal Server Error: The server encountered an unexpected error while processing the   request.

* ####  &emsp; Response

This API returns a JSON response with the following fields:

  1. container_id: The ID of the container that was requested.
  2. containers: An array of containers that belong to the user and have the specified container ID as their parent.

* ####  &emsp; Functionality

This API starts by checking the user's token using the IsValidToken function. If the token is invalid, it returns an error. It then checks if the container ID is valid and belongs to the user. If the container does not belong to the user, it returns an error. Finally, it retrieves all the containers that have the requested container as their parent and returns them as a JSON response.

---------------------

### &ndash; Delete Delete Request

* ####  &emsp; Description
This API is a Go function that handles HTTP DELETE requests for deleting items from the "recently_deleted_items" table in a database. It takes a database connection object as input and returns a gin.HandlerFunc which is used by the Gin web framework to handle HTTP DELETE requests.

* ####  &emsp; Request

The API expects a JSON request body with the following format:
{
"id": <integer>,
"token": <string>
}

where "id" is the ID of the item to be deleted and "token" is the authentication token for the user making the request.

* ####  &emsp; Errors
The API may return the following HTTP error responses:

  1. 400 Bad Request: If the request body is invalid.
  2. 417 Expectation Failed: If the token is invalid.
  3. 500 Internal Server Error: If there is an error while querying the database.

* ####  &emsp; Response
The API returns a response with HTTP status code 204 No Content if the item is successfully deleted.

* ####  &emsp; Functionality
The API first verifies the validity of the token provided in the request body by calling the IsValidToken() function with the token and the database connection object as arguments. If the token is invalid, the API returns an HTTP 417 Expectation Failed error response.

If the token is valid, the API queries the "recently_deleted_items" table in the database to retrieve the item with the specified ID and the same account ID as the user making the request. If the query fails, the API returns an HTTP 500 Internal Server Error response.

If the item is successfully retrieved, the API deletes the item from the "recently_deleted_items" table. If the deletion fails, the API returns an HTTP 401 Unauthorized error response.

If the deletion is successful, the API returns an HTTP 204 No Content response with an empty response body.

---------------------

### &ndash; Delete Get Request

* ####  &emsp; Description
This API handler function is used to get all recently deleted items for a particular user account. The API endpoint accepts HTTP GET requests and requires a valid access token for authentication.

* ####  &emsp; Request
The request must be an HTTP GET request with a valid access token included in the Authorization header.

* ####  &emsp; Errors
The API may return the following error responses:

  1. 401 Unauthorized: If the access token is invalid or missing.
  2. 500 Internal Server Error: If there is an error retrieving the recently deleted items from the database.

* ####  &emsp; Response
The API response is a JSON-encoded array of RecentlyDeletedItem objects. Each object contains information about an item that was recently deleted by the user. The fields of the RecentlyDeletedItem object are:

  1. ID (int): The unique identifier of the item.
  2. Name (string): The name of the item.
  3. DeletedAt (time.Time): The time the item was deleted.

* ####  &emsp; Functionality

The API handler function DeletedGet retrieves all recently deleted items for a particular user account from the database using the provided GORM database object. It first verifies that the provided access token is valid by calling the IsValidToken function, which returns the username associated with the token or an empty string if the token is invalid. If the token is invalid, the API returns a 401 Unauthorized response.

If the token is valid, the API queries the recently_deleted_items table in the database for all items with an account_id equal to the retrieved username. If the query fails, the API returns a 500 Internal Server Error response.

Finally, if the query succeeds, the API returns a 200 OK response with a JSON-encoded array of RecentlyDeletedItem objects.

---------------------

### &ndash; Inventory Delete Request

* ####  &emsp; Description
This API provides an endpoint for deleting items or containers from an inventory management system. It takes in a JSON payload with a token for user authentication, the type of item to delete (either "item" or "container"), and the ID of the item or container to delete. The API uses the Gin framework for HTTP routing and GORM for database operations. The API performs input validation and verifies the token's authenticity before performing any deletion operations.

* ####  &emsp; Request
The API expects an HTTP POST request to the endpoint /inventory/delete. The request must contain a JSON payload with the following fields:

  1. token: A string representing the user's authentication token. This field is required.
  2. id: An integer representing the ID of the item or container to delete. This field is required.
  3. type: A string representing the type of item to delete. Valid values are "item" and "container". This field is required.

* ####  &emsp; Errors
The API can return the following error responses:

  1. 400 Bad Request: The request payload is missing or invalid.
  2. 401 Unauthorized: The provided authentication token is invalid.
  3. 404 Not Found: The specified item or container does not exist.
  4. 500 Internal Server Error: An error occurred while performing the deletion operation.

* ####  &emsp; Response
The API returns an HTTP status code indicating the success or failure of the request. If the deletion operation is successful, the API returns an HTTP status code of 204 No Content with an empty response body.

* ####  &emsp; Functionality
The InventoryDelete function is the main handler function that is called when the API endpoint is hit. It takes a GORM database connection as an argument and returns a Gin handler function.

The Gin handler function first parses the JSON payload and checks for any errors. It then verifies the authentication token and retrieves the username associated with the token. If the token is invalid, the API returns a 401 Unauthorized error.

The handler function then calls either the DeleteItem or DestroyContainer helper function based on the object type specified in the JSON payload. If the object type is invalid, the API returns a 400 Bad Request error.

The DeleteItem helper function takes the GORM database connection, the ID of the item to be deleted, and the username of the user as arguments. It first checks if the item belongs to the user. If not, it returns an error. If the item belongs to the user, it creates a RecentlyDeletedItem object with the deleted item's ID, name, location, count, and timestamp, and saves it to the database. It then deletes the item from the database. Finally, it deletes any recently deleted items older than 30 days from the RecentlyDeletedItem table.

The DestroyContainer helper function takes the GORM database connection, the ID of the container to be deleted, and the username of the user as arguments. It looks up the container in the database and deletes all items and sub-containers associated with the container. It then deletes the container itself.

Both helper functions return an error if there is a problem deleting the object from the database. The handler function returns a 500 Internal Server Error if either helper function returns an error. If the deletion is successful, the handler function returns a 204 No Content status code.

---------------------

### &ndash; Inventory Post Request

* ####  &emsp; Description
This API handles requests to create a new container or item in an inventory system. The API takes in an HTTP POST request with a JSON request body that contains information about the new container or item to be created, along with an authorization token for the user making the request. The API verifies the authorization token, checks whether the new item is a container or item, and then creates the new container or item in the database.

* ####  &emsp; Request
The request should be an HTTP POST request to the endpoint where this API is hosted. The request should contain a JSON request body with the following fields:

  1. Authorization (string): The authorization token for the user making the request.
  2. Kind (string): Whether the new item to be created is a container or item.
  3. ID (int): The ID of the new container or item.
  4. Cont (int): The ID of the parent container of the new container or item. Only applicable if the new item is a container.
  5. Name (string): The name of the new container or item.
  6. Type (string): The type of the new item.
  7. Count (int): The count of the new item. Only applicable if the new item is an item.

* ####  &emsp; Errors
The API may return the following errors:

  1. http.StatusBadRequest: If the request body is invalid.
  2. http.StatusUnauthorized: If the authorization token is invalid.
  3. http.StatusInternalServerError: If the API fails to create the new container or item in the database.

* ####  &emsp; Response
The API returns an HTTP response with a status code of 204 (No Content) if the new container or item was created successfully.

* ####  &emsp; Functionality
The API first parses the JSON request body into a struct called InvRequest. It then checks whether the authorization token provided in the request is valid by calling the IsValidToken function and passing in the token and the database connection. If the token is not valid, the API returns an HTTP response with a status code of 401 (Unauthorized).

If the token is valid, the API checks whether the new item to be created is a container or item by checking the Kind field in the request body. If the Kind field is "container", the API creates a new Container struct with the information provided in the request body, and then creates a new record in the "containers" table in the database using the GORM Create method. If the Kind field is "item", the API creates a new Item struct with the information provided in the request body, and then creates a new record in the "items" table in the database using the GORM Create method.

If the API fails to create the new container or item in the database, it returns an HTTP response with a status code of 500 (Internal Server Error).

If the new container or item was created successfully, the API returns an HTTP response with a status code of 204 (No Content).

---------------------

### &ndash; Inventory Put Request

* ####  &emsp; Description

* ####  &emsp; Request

* ####  &emsp; Errors

* ####  &emsp; Response

* ####  &emsp; Functionality

---------------------

### &ndash; Items Get Request

* ####  &emsp; Description

* ####  &emsp; Request

* ####  &emsp; Errors

* ####  &emsp; Response

* ####  &emsp; Functionality

---------------------

### &ndash; Login Post Request

* ####  &emsp; Description

* ####  &emsp; Request

* ####  &emsp; Errors

* ####  &emsp; Response

* ####  &emsp; Functionality

---------------------

### &ndash; Name Get Request

* ####  &emsp; Description

* ####  &emsp; Request

* ####  &emsp; Errors

* ####  &emsp; Response

* ####  &emsp; Functionality

---------------------

### &ndash; Ping Get Request

* ####  &emsp; Description

This endpoint is used to test that the server is up and running.

* ####  &emsp; Request

This endpoint does not require any request parameters.

* ####  &emsp; Errors

This endpoint does not return any errors.

* ####  &emsp; Response

If the request is successful, the response will be a JSON object containing a single key-value pair:

  1. **"hello"**: A greeting message.

* ####  &emsp; Functionality

The **PingGet** function returns a **gin.HandlerFunc** that simply returns a JSON response with a greeting message and a status code of 200 when the endpoint is called. This is useful for testing that the server is up and running.

---------------------

### &ndash; Register Post Request

* ####  &emsp; Description

* ####  &emsp; Request

* ####  &emsp; Errors

* ####  &emsp; Response

* ####  &emsp; Functionality

---------------------

### &ndash; Search Get Request

* ####  &emsp; Description

This endpoint is used to search for items that belong to a user in the database.

* ####  &emsp; Request

The request to this endpoint must contain a JSON object with the following fields:

  1. **Authorization** (string, required): A token that verifies the identity of the user making the request.
  2. **Item** (string, required): The name of the item that the user wants to search for.

* ####  &emsp; Errors

This endpoint may return the following error status codes and messages:

  1. **401 Unauthorized**: When the token provided is invalid or has expired.
  2. **500 Internal Server Error**: When there was a problem getting the items from the database.

* ####  &emsp; Response

If the request is successful, the response will be a JSON object containing an array of items that match the search criteria.

* ####  &emsp; Functionality

The **SearchGet** function takes in a **gorm.DB** object and returns a **gin.HandlerFunc**. When the endpoint is called, it first parses the JSON request body into a **SearchRequest** object. It then verifies that the token provided is valid by calling the **IsValidToken** function, passing in the token and the **gorm.DB** object.

If the token is valid, the function proceeds to retrieve all items from the **items** table in the database that match the **ItemName** and **username** fields provided in the request body. Finally, the function returns the retrieved items as a JSON response with a status code of 200. If there was an error, the function aborts the request and returns an appropriate error message with the corresponding HTTP status code.

---------------------

### &ndash; Tree Get Request

* ####  &emsp; Description

**TreeGet** is a handler function that retrieves the hierarchical tree structure of all containers owned by a user. It returns a JSON response with the root container and its children containers. The function requires a valid authorization token in the request header.

* ####  &emsp; Request

**GET /containers/tree**

Headers:

  1. **Authorization**: The authorization token of the user.


* ####  &emsp; Errors

The following error responses may be returned by the function:

  1. **401 Unauthorized**: The authorization token is invalid or not provided.
  2. **404 Not Found**: The user associated with the provided authorization token does not exist.
Response

The function returns a JSON response with the following structure:

<pre>
{
  "Container": {
    "LocID": 1,
    "Name": "root",
    "Description": "Root container",
    "ParentID": null,
    "OwnerID": 1
  },
  "Children": [
    {
      "Container": {
        "LocID": 2,
        "Name": "child1",
        "Description": "First child container",
        "ParentID": 1,
        "OwnerID": 1
      },
      "Children": [
        {
          "Container": {
            "LocID": 3,
            "Name": "grandchild1",
            "Description": "First grandchild container",
            "ParentID": 2,
            "OwnerID": 1
          },
          "Children": null
        }
      ]
    },
    {
      "Container": {
        "LocID": 4,
        "Name": "child2",
        "Description": "Second child container",
        "ParentID": 1,
        "OwnerID": 1
      },
      "Children": null
    }
  ]
}
</pre>

  1. **Container**: The root container of the user.
  2. **Children**: An array of child containers. Each child container has the same structure as the root container, and may contain its own children containers.

* ####  &emsp; Functionality

The function performs the following steps:

  1. Retrieves the authorization token from the request header.
  2. Validates the authorization token using the **IsValidToken** function.
  3. Retrieves the root location of the user from the **accounts** table.
  4. Calls the **GetChildren** function recursively to retrieve the hierarchical tree structure of all child containers.
  5. Constructs and returns a JSON response with the root container and its children containers.

The **GetChildren** function performs the following steps:

  1. Retrieves all child containers of the specified parent container from the **Containers** table.
  2. Creates a new **ContainerTree** object for each child container.
  3. Calls the **GetChildren** function recursively for each child container to retrieve its own children containers.
  4. Assigns the array of children containers to the **Children** field of the current **ContainerTree** object.
  5. Returns an array of **ContainerTree** objects representing the child containers.
