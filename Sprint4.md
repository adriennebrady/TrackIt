# TrackIt Sprint 4

## Video link
<https://drive.google.com/file/d/1D9-uzMN36SMKHZOIgu5tMal7X6o4HU2y/view?usp=sharing>

## Detail work you've completed in Sprint 4

### Front-End

#### Inventory Page

* Implemented new functionality to allow users to update item counts via a pop-up dialog box.
* Added new increment and decrement buttons to quickly increase/decrease item counts by 1.
* Created a new sidebar with a toggle button to hide/display the navigation tree on the inventory page.
* Added the sidebar navigation tree to all logged-in pages.
* Created a new move/relocate menu to items and containers.
* Added a new "Recently Deleted" page with options to permanently delete or restore items.
* Created new buttons linked to the Recently Deleted page and settings page for logged-in users.
* Implemented a new account settings page with account deletion functionality.
* Designed a password verification pop-up dialog component for account deletion.

#### Components

* Designed a new move/relocate pop-up dialog.
* Designed a new sidebar navigation tree component with buttons that enable users to navigate directly to any container card page.
* Updated the item component to now display the actual item count.
* Updated item HTTP POST request to send "1" as the default item count if a user does not input a value.
* Updated sidenav to take up the entire side of the screen.

#### Bug Fixes

* Fixed container and item GET requests to account for new container and item GET handlers in the backend.
* Fixed sidebar nav so it now automatically updates when containers are added/deleted.
* Fixed recently deleted GET and DELETE HTTP requests.
* Fixed the display of container names.
* Removed the description field from containers and the pop-up dialog.
* Updated existing Cypress tests to succeed without container descriptions.
* Fixed previous Jasmine unit test failures due to software updates.
* Wrote new Jasmine unit tests.
* Wrote a new restore item Cypress test.

### Back-End

#### New features

* Added unit tests for new functions
* Implemented a handler to fetch the user's container tree
* Created a function to return the children within a container
* Implemented a function to get a container's parent
* Created a function to return the highest LocID in the database for handlers
* Enabled manual deletion of recently deleted items
* Implemented auto-deletion of recently deleted items after 30 days
* Added instructions for running the software on a Windows device

#### Fixes and Patches

* Resolved past issues with backend changes in unit tests
* Fixed errors with DeletedGet
* Improved the Get handler for recently deleted items
* Improved the manual deletion of recently deleted items
* Updated the handler to get a container name, which now recursively adds parent containers to the path

#### Improvements

* Updated recently deleted items to include 'location' and 'count' to make it easier to restore them
* Updated RegisterPost to check if a container is empty
* Split InventoryGet into ItemGet and ContainerGet
* Optimized invdelete, invput, and invpost handlers with switches (and added tests)
* Set trusted proxies

<p>&nbsp;</p>

## List frontend unit and Cypress tests

### Cypress Tests

* Visit TrackIt Home Page
* Visit About Page from Home Page
* Visit Login Page from Home Page
* Visit Signup Page from Home Page
* Login Authentication
* Valid User Navigation

### Sprint 4 - Jasmine Unit Tests

* DeleteAccountDialogComponent
* DeletedItemComponent
* SettingsComponent
* MoveMenuComponent
* MoveDialogComponent
* RecountDialogComponent
* RecentlyDeletedComponent

### Sprint 3 - Jasmine Unit Tests

* ContainerCardPageComponent
* SearchItemComponent
* ItemDialogComponent
* SearchComponent
* InvContainerComponent
* ItemComponent

### Sprint 2 - Jasmine Unit Tests

* ContainerComponent
* ItemComponent
* AuthService
* ContainerCardPageComponent
* HomeComponent
* AuthGuard
* ConfirmDialogComponent
* SignUpPageComponent
* AppComponent
* AboutComponent
* InventoryPageComponent
* DialogComponent
* RenameDialogComponent
* LoginPageComponent

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

* **Description**

    This API endpoint allows a user to delete their account. It accepts a JSON payload containing the user's username, password, and password confirmation. If the provided credentials are valid, the account is deleted. This endpoint is implemented using the Gin web framework and GORM ORM for database access.

* **Request**

    The API endpoint is an HTTP POST request that accepts a JSON payload with the following fields:

  * **username**(string): The username of the account to be deleted.
  * **password**(string): The password of the account to be deleted.
  * **password_confirmation**(string): The password confirmation for the deletion process.

* **Errors**

    The API can return the following HTTP status codes and error messages:

  * 400 Bad Request: The request body is invalid or the password and password confirmation do not match.
  * 401 Unauthorized: The username or password is invalid.
  * 404 Not Found: The user does not exist in the database.
  * 406 Not Acceptable: The account could not be deleted from the database.
  * 500 Internal Server Error: An internal server error occurred during the process.

* **Response**

    If successful, the API endpoint returns an HTTP status code and a JSON payload:

  * HTTP 204: The account was deleted successfully.
  * JSON payload: Empty JSON object.

* **Functionality**

    The API endpoint first validates the request payload and checks if the account exists. If the account exists, it checks if the password and password confirmation fields match and if the password provided is correct. If all checks pass, it starts a new transaction to ensure atomicity, deletes the account, and commits the transaction. If any error occurs during this process, it rolls back the transaction and returns an error message with the appropriate HTTP status code.

---------------------

### &ndash; Container Get Request

* **Description**

    This API allows a user to retrieve all containers that belong to them and have a specified container ID as their parent. It validates the user's authorization token, the container ID, and checks if the container belongs to the user.

* **Request**

    This API requires a GET request with the following parameters:

  * Authorization header: A valid user token is required to access this endpoint.
  * **container_id** (integer): The container ID.

* **Errors**
  
    This API may return the following errors:

  * 401 Unauthorized: The user's token is invalid or has expired.
  * 400 Bad Request: The container ID parameter is missing or not an integer.
  * 401 Unauthorized: The container does not belong to the user.
  * 500 Internal Server Error: The server encountered an unexpected error while processing the   request.

* **Response**

    This API returns a JSON response with the following fields:

  * **container_id**(integer): The ID of the container that was requested.
  * **containers**(array): An array of containers that belong to the user and have the specified container ID as their parent.

* **Functionality**
  
  This API starts by checking the user's token using the IsValidToken function. If the token is invalid, it returns an error. It then checks if the container ID is valid and belongs to the user. If the container does not belong to the user, it returns an error. Finally, it retrieves all the containers that have the requested container as their parent and returns them as a JSON response.

---------------------

### &ndash; Delete Delete Request

* **Description**
  
  This API is a Go function that handles HTTP DELETE requests for deleting items from the "recently_deleted_items" table in a database. It takes a database connection object as input and returns a gin.HandlerFunc which is used by the Gin web framework to handle HTTP DELETE requests.

* **Request**
  
  The API expects a JSON request body with the following format:
  *     {
        "id": < integer >,
        "token": < string >
        }
  * where "id" is the ID of the item to be deleted and "token" is the authentication token for the user making the request.

* **Errors**
  
  The API may return the following HTTP error responses:

  * 400 Bad Request: If the request body is invalid.
  * 417 Expectation Failed: If the token is invalid.
  * 500 Internal Server Error: If there is an error while querying the database.

* **Response**
  
  The API returns an HTTP status code:
  * HTTP 204 No Content: If the item is successfully deleted.

* **Functionality**
  
  The API first verifies the validity of the token provided in the request body by calling the IsValidToken() function with the token and the database connection object as arguments. If the token is invalid, the API returns an HTTP 417 Expectation Failed error response.
  
  If the token is valid, the API queries the "recently_deleted_items" table in the database to retrieve the item with the specified ID and the same account ID as the user making the request. If the query fails, the API returns an HTTP 500 Internal Server Error response.
  
  If the item is successfully retrieved, the API deletes the item from the "recently_deleted_items" table. If the deletion fails, the API returns an HTTP 401 Unauthorized error response. If the deletion is successful, the API returns an HTTP 204 No Content response with an empty response body.

---------------------

### &ndash; Delete Get Request

* **Description**

    This API handler function is used to get all recently deleted items for a particular user account. The API endpoint accepts HTTP GET requests and requires a valid access token for authentication.

* **Request**

    The request must be an HTTP GET request with a valid access token included in the Authorization header.

* **Errors**

    The API may return the following error responses:

  * 401 Unauthorized: If the access token is invalid or missing.
  * 500 Internal Server Error: If there is an error retrieving the recently deleted items from the database.

* **Response**

    The API response is a JSON-encoded array of RecentlyDeletedItem objects. Each object contains information about an item that was recently deleted by the user. The fields of the RecentlyDeletedItem object are:

  * ID (int): The unique identifier of the item.
  * Name (string): The name of the item.
  * DeletedAt (time.Time): The time the item was deleted.

* **Functionality**

    The API handler function DeletedGet retrieves all recently deleted items for a particular user account from the database using the provided GORM database object. It first verifies that the provided access token is valid by calling the IsValidToken function, which returns the username associated with the token or an empty string if the token is invalid. If the token is invalid, the API returns a 401 Unauthorized response.

    If the token is valid, the API queries the recently_deleted_items table in the database for all items with an account_id equal to the retrieved username. If the query fails, the API returns a 500 Internal Server Error response.

    Finally, if the query succeeds, the API returns a 200 OK response with a JSON-encoded array of RecentlyDeletedItem objects.

---------------------

### &ndash; Inventory Delete Request

* **Description**

    This API provides an endpoint for deleting items or containers from an inventory management system. It takes in a JSON payload with a token for user authentication, the type of item to delete (either "item" or "container"), and the ID of the item or container to delete. The API uses the Gin framework for HTTP routing and GORM for database operations. The API performs input validation and verifies the token's authenticity before performing any deletion operations.

* **Request**

    The API expects an HTTP POST request to the endpoint /inventory/delete. The request must contain a JSON payload with the following fields:

  * token: A string representing the user's authentication token. This field is required.
  * id: An integer representing the ID of the item or container to delete. This field is required.
  * type: A string representing the type of item to delete. Valid values are "item" and "container". This field is required.

* **Errors**

    The API can return the following error responses:

  * 400 Bad Request: The request payload is missing or invalid.
  * 401 Unauthorized: The provided authentication token is invalid.
  * 404 Not Found: The specified item or container does not exist.
  * 500 Internal Server Error: An error occurred while performing the deletion operation.

* **Response**

    If successful, the API endpoint returns an HTTP status code and a JSON payload:

  * HTTP 204: if the account was deleted successfully.
  * JSON payload: empty JSON object.

* **Functionality**

    The InventoryDelete function is the main handler function that is called when the API endpoint is hit. It takes a GORM database connection as an argument and returns a Gin handler function.

    The Gin handler function first parses the JSON payload and checks for any errors. It then verifies the authentication token and retrieves the username associated with the token. If the token is invalid, the API returns a 401 Unauthorized error.

    The handler function then calls either the DeleteItem or DestroyContainer helper function based on the object type specified in the JSON payload. If the object type is invalid, the API returns a 400 Bad Request error.

    The DeleteItem helper function takes the GORM database connection, the ID of the item to be deleted, and the username of the user as arguments. It first checks if the item belongs to the user. If not, it returns an error. If the item belongs to the user, it creates a RecentlyDeletedItem object with the deleted item's ID, name, location, count, and timestamp, and saves it to the database. It then deletes the item from the database. Finally, it deletes any recently deleted items older than 30 days from the RecentlyDeletedItem table.

    The DestroyContainer helper function takes the GORM database connection, the ID of the container to be deleted, and the username of the user as arguments. It looks up the container in the database and deletes all items and sub-containers associated with the container. It then deletes the container itself.

    Both helper functions return an error if there is a problem deleting the object from the database. The handler function returns a 500 Internal Server Error if either helper function returns an error. If the deletion is successful, the handler function returns a 204 No Content status code.

---------------------

### &ndash; Inventory Post Request

* **Description**

    This API handles requests to create a new container or item in an inventory system. The API takes in an HTTP POST request with a JSON request body that contains information about the new container or item to be created, along with an authorization token for the user making the request. The API verifies the authorization token, checks whether the new item is a container or item, and then creates the new container or item in the database.

* **Request**

    The request should be an HTTP POST request to the endpoint where this API is hosted. The request should contain a JSON request body with the following fields:

  * Authorization (string): The authorization token for the user making the request.
  * Kind (string): Whether the new item to be created is a container or item.
  * ID (int): The ID of the new container or item.
  * Cont (int): The ID of the parent container of the new container or item. Only applicable if the new item is a container.
  * Name (string): The name of the new container or item.
  * Type (string): The type of the new item.
  * Count (int): The count of the new item. Only applicable if the new item is an item.

* **Errors**

    The API may return the following errors:

  * 400 Bad Request: Returned if the request body is invalid.
  * 401 Unauthorized: Returned if the authorization token is invalid.
  * 500 Internal Server Error: Returned if there is an error creating the new container or item.

* **Response**

    The API returns an HTTP response with a status code of 204 (No Content) if the new container or item was created successfully.

* **Functionality**

    The API first parses the JSON request body into a struct called InvRequest. It then checks whether the authorization token provided in the request is valid by calling the IsValidToken function and passing in the token and the database connection. If the token is not valid, the API returns an HTTP response with a status code of 401 (Unauthorized).

    If the token is valid, the API checks whether the new item to be created is a container or item by checking the Kind field in the request body. If the Kind field is "container", the API creates a new Container struct with the information provided in the request body, and then creates a new record in the "containers" table in the database using the GORM Create method. If the Kind field is "item", the API creates a new Item struct with the information provided in the request body, and then creates a new record in the "items" table in the database using the GORM Create method.

  If the API fails to create the new container or item in the database, it returns an HTTP response with a status code of 500 (Internal Server Error).

  If the new container or item was created successfully, the API returns an HTTP response with a status code of 204 (No Content).

---------------------

### &ndash; Inventory Put Request

* **Description**
    This API contains two functions, InventoryPut and its helper functions ContainerPut and ItemPut. It receives a JSON request body with authorization, kind, ID, type, name, count, and cont (container ID) fields. Depending on the kind of request, the API updates the name, location, or count of an item, or the name or location of a container in a database, given a valid authorization token.

* **Request**

    The API expects an HTTP POST request with a JSON request body that includes the following fields:

  * Authorization: A token to authenticate the request.
  * Kind: A string that represents whether the request pertains to a container or an item.
  * ID: An integer that represents the ID of the container or item in the database.
  * Type: A string that represents the type of request. If Kind is "Container", Type can be "Rename" or "Relocate". If Kind is "Item", Type can be "Rename", "Relocate", or "Recount".
  * Name: A string that represents the new name of the container or item (if Type is "Rename").
  * Count: An integer that represents the new count of the item (if Type is "Recount").
  * Cont: An integer that represents the new location of the container (if Type is "Relocate").

* **Errors**

    The API may return the following HTTP status codes and JSON error messages:

  * 400 Bad Request: The request body is invalid.
  * 401 Unauthorized: The token is invalid.
  * 404 Not Found: The container or item ID cannot be found in the database.
  * 500 Internal Server Error: A database error occurs.

* **Response**

    If successful, the API endpoint returns an HTTP status code and a JSON payload:

  * HTTP 200: if the account was deleted successfully.
  * JSON payload: empty JSON object.

* **Functionality**

    The InventoryPut function is a gin.HandlerFunc that takes a gorm.DB object and returns a function that handles the HTTP request. It first reads the JSON request body and validates it. If the request is valid, it checks the authorization token by calling the IsValidToken function. If the token is valid, it processes the request by calling either the ContainerPut or ItemPut function, depending on the Kind field of the request. If an error occurs during processing, it returns an appropriate HTTP status code and JSON error message.

    The ContainerPut function takes an InvRequest object, a gorm.DB object, and a string representing the username of the request's author. It looks up the container in the database by ID and username, then updates its name or location based on the Type field of the request. It saves the changes to the database and returns nil if successful. If an error occurs, it returns a string pointer to an appropriate error message.

    The ItemPut function takes an InvRequest object, a gorm.DB object, and a string representing the username of the request's author. It looks up the item in the database by ID and username, then updates its name, location, or count based on the Type field of the request. It saves the changes to the database and returns nil if successful. If an error occurs, it returns a string pointer to an appropriate error message.

---------------------

### &ndash; Items Get Request

* **Description**

    This API uses the Gin web framework for routing and GORM as an ORM to interact with a database. The function ItemsGet takes a pointer to a gorm.DB object as input and returns a gin.HandlerFunc. The API checks the validity of a token provided in the Authorization header, verifies that the container belongs to the user, and retrieves all items that belong to the container.

* **Request**

    The API expects a GET request to the endpoint /items with the container ID as a query parameter in the URL. The container ID should be an integer. The Authorization header should contain a valid token.

* **Errors**

    The API can return the following error responses:

  * 400 Bad Request if the container ID is invalid
  * 401 Unauthorized if the token is invalid or the container does not belong to the user
  * 500 Internal Server Error if there was an error retrieving the items from the database

* **Response**

    The API returns a JSON response with a status code of 200 OK and an array of Item objects. Each Item object represents an item that belongs to the container. The Item object has the following fields:

  * ID (int): the ID of the item
  * Name (string): the name of the item
  * LocID (int): the ID of the container that the item belongs to
  * CreatedAt (time.Time): the timestamp when the item was created
  * UpdatedAt (time.Time): the timestamp when the item was last updated

* **Functionality**

    The ItemsGet function handles HTTP GET requests to retrieve all items that belong to a container. It first verifies the validity of the token provided in the Authorization header by calling the IsValidToken function. If the token is invalid, the API returns a 401 Unauthorized response.

    Next, the API retrieves the container ID from the query parameter in the URL and checks if the container belongs to the user by querying the Containers table in the database using the db.Table method of GORM. If the container does not belong to the user, the API returns a 401 Unauthorized response.

    If the container belongs to the user, the API retrieves all items that belong to the container by querying the Items table in the database using the db.Table method of GORM. If there was an error retrieving the items, the API returns a 500 Internal Server Error response.

    Finally, the API returns a JSON response with a status code of 200 OK and an array of Item objects. Each Item object represents an item that belongs to the container.

---------------------

### &ndash; Login Post Request

* **Description**

    The LoginPost function is a handler function that is used to handle the HTTP POST requests made to the login endpoint. It takes the username and password from the request body, checks if the user exists and if the password is correct, generates a token and saves it to the database, and then returns the token and the root location ID to the user.

* **Request**

    The LoginPost function receives a JSON payload with the following fields:

  * username (string): The username of the user trying to login.
  * password (string): The password of the user trying to login.

* **Errors**

    The LoginPost function may return the following errors as HTTP status codes and JSON payloads:

  * 400 Bad Request: The request body is not a valid JSON payload.
  * 401 Unauthorized: The username or password is incorrect.
  * 500 Internal Server Error: An error occurred while generating or saving the token or deleting old recently deleted items.

* **Response**

    The LoginPost function returns a JSON payload with the following fields:

  * token (string): The token generated for the user.
  * rootLoc (int): The ID of the user's root location.

* **Functionality**

    The LoginPost function parses the request body and extracts the username and password fields. Then, Queries the database to check if the user with the given username exists. It Compares the password provided by the user with the one stored in the database for the given user. If the username and password are correct, generates a new token and saves it to the database for the user. Then Deletes old recently deleted items from the database. Finally, it returns the token and root location ID in a JSON response.

---------------------

### &ndash; Name Get Request

* **Description**

    NameGet is a handler function that retrieves the name of a container identified by a Container_id query parameter, along with its parent names if any.

* **Request**

    The NameGet function request has the following fields:

  * Container_id (required): The ID of the container whose name should be retrieved.

* **Errors**

  * 401 Unauthorized: If the Authorization header is missing or the token is invalid.
  * 406 Not Acceptable: If the Container_id query parameter is missing or invalid.
  * 404 Not Found: If the container with the specified ID and username is not found.
  * 500 Internal Server Error: If there is an error retrieving the container from the database.

* **Response**

    The function will return the following json response:

  * Status Code: 200 OK
  * Body: The name of the container identified by Container_id, along with its parent names separated by a forward slash ("/").

* **Functionality**

    The function first retrieves the token from the **Authorization** header and checks its validity. Then, it parses the **Container_id** query parameter and retrieves the container with the specified ID and username from the database. It retrieves the name of the container and its parent names, if any, by calling the GetParent function recursively up to a maximum of 10 iterations. Finally, it returns the name of the container and its parent names as a JSON response.

---------------------

### &ndash; Ping Get Request

* **Description**

    This endpoint is used to test that the server is up and running.

* **Request**

    This endpoint does not require any request parameters.

* **Errors**

    This endpoint does not return any errors.

* **Response**

    If the request is successful, the response will be a JSON object containing a single key-value pair:

  * **"hello"**: A greeting message.

* **Functionality**

    The **PingGet** function returns a **gin.HandlerFunc** that simply returns a JSON response with a greeting message and a status code of 200 when the endpoint is called. This is useful for testing that the server is up and running.

---------------------

### &ndash; Register Post Request

* **Description**

    This endpoint receives a JSON payload containing the user's information, such as **username** and **password**. It creates a new account for the user and a root container for them.

* **Request**

    The request must be a POST request to the **/register** endpoint with a JSON payload containing the following fields:

  1. **username**: The user's username.
  2. **password**: The user's password.
  3. **password_confirmation**: The user's password confirmation

* **Errors**

    If the request is invalid or any error occurs while processing it, the endpoint will return one of the following error messages as a JSON payload:

  * **400 Invalid request body**
  * **400 User already exists**
  * **400 Password and confirmation do not match**
  * **500 Failed to get max location ID**
  * **500 Failed to create user**
  * **500 Failed to create container**
  * **500 Failed to update user's RootLoc**

* **Response**

    If the request is successful, the endpoint returns a JSON payload containing the following fields:

  * **token**: The authentication token for the newly created user.
  * **rootLoc**: The ID of the root container created for the new user.

* **Functionality**

    When a request is received, the endpoint first checks if the request body is valid and if the user already exists in the system. If the request is valid and the user does not already exist, it creates a new account and a new root container for the user in the database.

    The endpoint creates the new account by hashing and salting the user's password using the bcrypt package. It also generates a random token for the user's authentication.

    The endpoint then creates a new container object for the user's root container. The new container is assigned a new unique location ID. The endpoint uses a transaction to ensure that the creation of the new user and container objects is atomic.

    If any error occurs during the creation of the user or container objects, the endpoint returns an error message and rolls back the transaction. If the creation is successful, the endpoint commits the transaction and returns the authentication token and the ID of the root container created for the user.

---------------------

### &ndash; Search Get Request

* **Description**

    This endpoint is used to search for items that belong to a user in the database.

* **Request**

    The request to this endpoint must contain a JSON object with the following fields:

  * **Authorization** (string, required): A token that verifies the identity of the user making the request.
  * **Item** (string, required): The name of the item that the user wants to search for.

* **Errors**

    This endpoint may return the following error status codes and messages:

  * **401 Unauthorized**: When the token provided is invalid or has expired.
  * **500 Internal Server Error**: When there was a problem getting the items from the database.

* **Response**

    If the request is successful, the response will be a JSON object containing an array of items that match the search criteria.

* **Functionality**

    The **SearchGet** function takes in a **gorm.DB** object and returns a **gin.HandlerFunc**. When the endpoint is called, it first parses the JSON request body into a **SearchRequest** object. It then verifies that the token provided is valid by calling the **IsValidToken** function, passing in the token and the **gorm.DB** object.

    If the token is valid, the function proceeds to retrieve all items from the **items** table in the database that match the **ItemName** and **username** fields provided in the request body. Finally, the function returns the retrieved items as a JSON response with a status code of 200. If there was an error, the function aborts the request and returns an appropriate error message with the corresponding HTTP status code.

---------------------

### &ndash; Tree Get Request

* **Description**

    **TreeGet** is a handler function that retrieves the hierarchical tree structure of all containers owned by a user. It returns a JSON response with the root container and its children containers. The function requires a valid authorization token in the request header.

* **Request**

    **GET /containers/tree**

    Headers:

  * **Authorization**: The authorization token of the user.

* **Errors**

    The following error responses may be returned by the function:

  * **401 Unauthorized**: The authorization token is invalid or not provided.
  * **404 Not Found**: The user associated with the provided authorization token does not exist.

* **Response**

    The function returns a JSON response with the following structure:

```
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
```

* **Container**: The root container of the user.
* **Children**: An array of child containers. Each child container has the same structure as the root container, and may contain its own children containers.

* **Functionality**

    The function performs the following steps:

  * Retrieves the authorization token from the request header.
  * Validates the authorization token using the **IsValidToken** function.
  * Retrieves the root location of the user from the **accounts** table.
  * Calls the **GetChildren** function recursively to retrieve the hierarchical tree structure of all child containers.
  * Constructs and returns a JSON response with the root container and its children containers.
  <p>&nbsp;</p>

    The **GetChildren** function performs the following steps:

  * Retrieves all child containers of the specified parent container from the **Containers** table.
  * Creates a new **ContainerTree** object for each child container.
  * Calls the **GetChildren** function recursively for each child container to retrieve its own children containers.
  * Assigns the array of children containers to the **Children** field of the current **ContainerTree** object.
  * Returns an array of **ContainerTree** objects representing the child containers.
