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

* ####  &emsp; Request

* ####  &emsp; Errors

* ####  &emsp; Response

* ####  &emsp; Functionality

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

* ####  &emsp; Request

* ####  &emsp; Errors

* ####  &emsp; Response

* ####  &emsp; Functionality

---------------------

### &ndash; Delete Get Request

* ####  &emsp; Description

* ####  &emsp; Request

* ####  &emsp; Errors

* ####  &emsp; Response

* ####  &emsp; Functionality

---------------------

### &ndash; Inventory Delete Request

* ####  &emsp; Description

* ####  &emsp; Request

* ####  &emsp; Errors

* ####  &emsp; Response

* ####  &emsp; Functionality

---------------------

### &ndash; Inventory Post Request

* ####  &emsp; Description

* ####  &emsp; Request

* ####  &emsp; Errors

* ####  &emsp; Response

* ####  &emsp; Functionality

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

* ####  &emsp; Request

* ####  &emsp; Errors

* ####  &emsp; Response

* ####  &emsp; Functionality

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

* ####  &emsp; Request

* ####  &emsp; Errors

* ####  &emsp; Response

* ####  &emsp; Functionality

---------------------

### &ndash; Tree Get Request

* ####  &emsp; Description

* ####  &emsp; Request

* ####  &emsp; Errors

* ####  &emsp; Response

* ####  &emsp; Functionality
