# CEN3031 Project

<img src="https://github.com/evaeia/TrackIt/blob/main/logo.png?raw=true" alt="Your image title" width="250"/>

## Project Name: TrackIt

## Project Description

Personal inventory tracker that allows users to create virtual furniture, like a cabinet or fridge, and create containers inside, such as shelves to have a visual and accessible inventory of their belongings. Once the container is created, the user simply adds their items inside. From here, finding items is simple. The user can quickly search the name of the item they wish to find and they are brought right to the exact location. The inventory tracker stores user’s items using their usernames and passwords as identifiers.

Users will be able to put tags on an item, which allow groups of items to appear when searched. For example, tagging all dairy items in a fridge with the tag "dairy" allows a search for dairy to return all these items together. Or, if the user calls an item "power cable", but forgets and searches for a "power cord", tagging the item with "power" "cord" "cable" "charging" allows for the item to come up with a search containing the tag instead.

## Members

**Front End**: Adrienne Brady  
**Front End**: Sara Winner  
**Back End**: Tana Desir  
**Back End**: Israel Solano

## These instructions are for Windows 10/11

### Prerequisites for running end-to-end tests:

* Latest stable version of Node.js https://nodejs.org/en/
* Angular CLI npm install -g @angular/cli
* Latest stable version of golang

### Running golang backend
* git clone https://github.com/evaeia/TrackIt.git
* cd Trackit
* go run Inv/httpd/main.go

### Running Angular in another terminal
* In another terminal for the front end
* cd Trackit
* npm install
* ng serve
   * If this fails to load from SecurityError, try running:
    * set-ExecutionPolicy RemoteSigned -Scope CurrentUser

Open browser to http://localhost:4200/, success!