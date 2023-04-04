# TrackIt Sprint 4

## Detail work you've completed in Sprint 3

### Front-End
* Adrienne Brady
  * Added new functionality to allow user to update the item count with a pop-up dialog
  * Added new functionality & increment/decrement buttons to allow user to quickly increase/decrease an item's count by 1
  * Updated item component to now display actual item count
  * Updated item HTTP POST request to send "1" as the default item count if user doesn't input a value
  * Fixed container and item GET requests to account for new container and item GET handlers in the backend

* Sara Winner
  * (List here)

### Back-End
* Tana Desir
  *  Created Auto-deletion of recently deleted items after 30 days
  *  Created Unit test for Auto-deletion of recently deleted items after 30 days
  *  Fixed manual deletion of recently deleted items
  *  Fixed unit test for manual deletion of recently deleted items
  *  Changed recently deleted to include 'location' and 'Count' to help when restoring a recently deleted item
  *  Edited RegisterPost to check if container is empty
  *  Created Unit test for registerPost
* Israel Solano
  *  Created manual deletion of recently deleted items
  *  Created Unit test for manual deletion of recently deleted items
  *  Split InventoryGet into ItemGet and ContainerGet
  *  Fix Get handler for recently deleted items
  *  Update unittests
  *  Update handler for getting container name that recursively adds parent containers to path
  *  Optimize invdelete, invput, and invpost handlers with switches (and put tests)
  *  Created a handler for getting the user's tree of containers
  *  Created a function that returns the children inside a container
  *  Created a unit test for getChildren
<p>&nbsp;</p>

## List frontend unit and Cypress tests
* (List here)
<p>&nbsp;</p>

## List backend unit tests
* (List here)
<p>&nbsp;</p>

## Show updated documentation for your backend API 
