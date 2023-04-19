# CEN3031 Project: TrackIt

<img src="https://github.com/evaeia/TrackIt/blob/main/logo.png?raw=true" alt="Your image title" width="250"/>

## Project Description

TrackIt is a personal inventory tracker that allows users to create virtual furniture, such as a cabinet or fridge, and containers inside it, such as shelves, to keep a visual and accessible inventory of their belongings. Users can add items to the containers they have created, and finding items is made simple by searching for the name of the item they are looking for, which will take them to its exact location. The inventory tracker stores the user's items using their usernames and passwords as identifiers.

## Members

**Front End**: Adrienne Brady  
**Front End**: Sara Winner  
**Back End**: Tana Desir  
**Back End**: Israel Solano

## These instructions are for Windows 10/11

### Prerequisites

* Latest stable version of Node.js **(<https://nodejs.org/en/>)**
* Angular CLI (**'npm install -g @angular/cli'**)
* Latest stable version of golang **(<https://go.dev/doc/install>)**
* GCC (Download from **<http://tdm-gcc.tdragon.net/download>**)

### Running the Backend

* Clone the project by running **'git clone https://github.com/evaeia/TrackIt.git'**
  * This should be done at your golang project root
* Navigate to the golang project root by running **'cd Trackit'**.
* Run the backend by running **'go run Inv/httpd/main.go'**

### Running the Frontend

* In another terminal, navigate to the project root by running **'cd Trackit**'
* Install the required packages by running **'npm install'**
* Update the packages by running npm update **'npm update'**
* Run the frontend by running **'ng serve'**
* If this fails to load from SecurityError, try running:
  * set-ExecutionPolicy RemoteSigned -Scope CurrentUser
* Open a browser and navigate to **(http://localhost:4200/)**.

Congratulations! You have successfully set up and run TrackIt.
