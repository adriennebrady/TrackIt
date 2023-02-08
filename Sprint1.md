# TrackIt Sprint 1
## User stories
* As a site visitor, I want to be able to visit the website and get a sense of the service so that I can determine if it meets my needs.
* As a site member, I want an easy way to access the items and containers in my inventory, so that I can easily find items when I need to.
* As a site member, I want to be able to see clearly what is in a container so that at a glance I can see what's inside.
* As a user with an account, I want to be able to log in so I can see my inventory and save my previously made containers and items.
* As a site member, I want to be able to save the containers and items in my inventory so that I can come back to the website when I need to find an item.
* As a site member, I want to quickly find my items in the inventory so that I can locate them in real life.
* As a new TrackIt user, I want to be able to clearly understand how to use TrackIt so that I can use it to manage my inventory effectively.
* As a user without an account, I want to be able to create an account with a secure password and start tracking my inventory.
* As an frequent reorganizer, I want to be able to move where I put my items and furniture in my inventory, so that it can reflect my need for change.
* As a user with seasonal inventory, I want to be able to export and view archives of my inventory, so that I can find where I placed items in the past.
* As a user with sectioned organizers, I want to be able to create segments within the containers of my inventory, so that I can locate the specific section my item is in.
* As a user with a family, I want to be able to share access to my inventory, so that anyone in my family can update locations of items.
* As an overthinker, I want to be able to restore deleted items to my inventory, so that I don't accidentally lose my information permanently.

## What issues we planned to address
### Front-End
* Create the "Home" page for a non-logged in user
* Create the "Home" page for a logged-in user -- "My Inventory" page
* Create the "Container Card" page
### Back-End
* Create the "Inventory"
* Add items to "Inventory"
* Delete items from "Inventory"
* Relocate items to different "Inventory"
* Rename items in "Inventory"

## Which ones were successfully completed
### Front-End  
* Create the "Home" page for a non-logged in user 
    * Created Home, About, Login, Sign Up Components
    * Added Router Links from the home page
* Create the "Home" page for a logged-in user -- "My Inventory" page 
    * Created inventory and container components 
    * Added functionality to create/display containers 
    * Added delete functionality/warning dialog for containers
* Create the "Container Card" page
    * Created container page and container components 
    * Added functionality to create/display containers 
    * Added delete functionality/warning dialog for containers
### Back-End
* Create the "Inventory" (with http request)
* Add items to "Inventory" (with http request)
* Delete items to "Inventory" (with http request)
* Relocate items to different "Inventory" (Functionality Only)
* Rename items in "Inventory" (Functionality Only)

## Which ones didn't and why?
### Front-End
* "Rename" and "Move" buttons have been created in the container components, however they do not have functionality yet as we are working on a way to update container data, such as name and location.
* "See Inside" and "Back" buttons have been created in the container and container-page components, however they do not have functionality yet as we are working on a way to create unique IDs for each container to be able to pass this ID to the container-page to display the selected container on its own page.

### Back-End
* Relocate items to different "Inventory" (with http request) and Rename items in "Inventory"  (with http request). These did not work because we are still working on a way to implement these functionalities using http request

## Front-End and Back-End Demo Links:  
**Front End:** https://drive.google.com/file/d/1QvPKT_SI78Bd_i55tlwHwln-wusRxHeb/view?usp=sharing  
Record a video with both members demoing your frontend work. Use a mocked up backend, if necessary.
    
**Back End:**  
Record a video with both members demoing your backend work. Use the command line or Postman.
