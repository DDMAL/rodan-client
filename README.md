# __rodan-client__

Rodan-Client is a GUI that allows you to interact with Rodan jobs and workflows. 

## Installation
  1. Clone project. ```git clone https://github.com/DDMAL/rodan-client```
  2. Travel to the project directory and run ```yarn install```
  3. Copy the ```configuration.example.json``` file, and name it ```configuration.json```. 
  4. Edit the ```SERVER_HOST``` and ```SERVER_PORT``` accordingly. 
    - If you're using docker in local development, use ```localhost``` for the server, and ```port 8000```. You will also need to set ```SERVER_HTTPS``` to false. 
  5. From the root project directory, travel to ```./node_modules/.bin/``` and run ```./jspm install -y```
  6. Run ```gulp```.

## Prerequisites
1. Install Homebrew.
  - ```/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"```.
2.  Install Yarn.
  - ```brew install yarn```.
3. Install Gulp.
  - To install it globally, use ```yarn global add gulp```.
  - If you do not install it globally, you will have to run gulp from the ```./node_modules/.bin``` folder. 
4. Install Git.
  - ```git``` and follow the directions (it will automatically ask you to install Xcode Command Line Tools). 
5. Install Rodan.
  - Use the ```Rodan-Docker``` or visit https://github.com/DDMAL/Rodan and install it yourself. 
