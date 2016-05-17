---
---
# Installation
The following are instructions for installing Rodan Client on a Linux environment. For Windows or Mac the steps should be relatively similar except for commands such as `git` or `npm`.

For the instructions below, we'll assume that you are `user` logged on `computer` and working in your `~` (home) directory.

## Setup Rodan server for the client

You will most likely have to have the Rodan server administrator whitelist the IP and port you wish to host the client on to enable [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). Furthermore, you will need the following information from the Rodan server:

 * server IP, port, and HTTP protocol (http or https)
 * authentication method (token or session).

This information will be used later in the installation.

You will also need the Rodan server administrator to create an accounts for those users you wish to have access.

## Installation Steps

### 1. Install Node.js
Rodan Client uses [Node.js](https://nodejs.org/en/) for many of its dependencies. Installation instructions for various platforms can be found [here](https://nodejs.org/en/download/package-manager/).

### 2. Install latest version of npm
[npm](https://www.npmjs.com/) is a package manager for JavaScript. When Node.js is installed, npm is also installed, but not necessarily the latest version. It is recommended that you install version 3.8.2 or later. Instructions for updating npm can be found [here](https://docs.npmjs.com/getting-started/installing-node).

### 3. Clone the repository
The Rodan Client source is hosted on GitHub (which you probably already knew).

```
user@computer:~$ git clone https://github.com/DDMAL/rodan-client.git
```

### 4. Install development dependencies
Part of the deployment of Rodan Client is the installation of build dependencies. These are declared in the `devDependencies` section of `package.json`. When `npm install` is run from the root repository directory (i.e. `rodan-client`), npm downloads and installs each of the development dependencies in `rodan-client/node_modules`.

```
user@computer:~$ cd rodan-client
user@computer:~/rodan-client$ npm install
```

### 5. Install application dependencies.
The application dependencies are JavaScript applications that Rodan Client requires when running in a browser. These are managed and installed by [jspm](http://jspm.io/). jspm was installed as a local development dependency in the previous step.

The binaries for locally-install Node.js applications, such as jspm, are located in `rodan-client/node_modules/.bin/`. 

```
user@computer:~/rodan-client$ ./node_modules/.bin/jspm install -y
```

The above command will:
* create a directory `rodan-client/web`
* create a file `rodan-client/web/config.js`
* download and install the application dependencies to `rodan-client/web/libs/`.

What jspm is doing is creating a web application directory (i.e. `web`) where the application will reside.

### 6. Configure
Rodan Client requires very little configuration to get started. Only two files need to be managed:

* `rodan-client/configuration.json`
* `rodan-client/js/Plugins.js`.

When Rodan Client is cloned, these files do not yet exist. Instead, there is:

* `rodan-client/configuration.json.example`
* `rodan-client/js/Plugins.js.example`.

First, we need to copy these files without the `.example` extension.

```
user@computer:~/rodan-client$ cp configuration.json.example configuration.json
user@computer:~/rodan-client$ cp js/Plugins.js.example Plugins.js
```

Next, we need make small edits to each.

##### `configuration.json`
At a minimum, we need tell Rodan Client where the Rodan server is and how to connect to it.

* `SERVER_HOST`: This is the host name of the Rodan server you want the client to interact with. For example, if the server was at IP 123.456.789.1, you would set `"SERVER_HOST": "123.456.789.1"`.

* `SERVER_PORT`: This is the port for connecting to the Rodan server.

* `SERVER_HTTPS`: The client will connect to the server using HTTPS iff `SERVER_HTTPS` is `true`. Else, HTTP will be used (not recommended).

* `SERVER_AUTHENTICATION_TYPE`: This tells the client which authentication type to use - token or session. Token is recommended, but it depends on the Rodan server. For example, if the server uses token authentication, you would set `"SERVER_AUTHENTICATION_TYPE": "token"`.

_Note: The `WORKFLOWBUILDERGUI` settings in `configuration.json` are the settings for the Workflow Builder GUI plugin. This plugin is discussed below._

##### `js/Plugins.js`
Rodan Client comes with a plugin that allows a user to create and edit Workflows via a GUI, the Workflow Builder GUI. `js/Plugins.js` lets Rodan Client know what plugins exist and where the are located. For a standard Rodan Client install, no modifications need to be made to `js/Plugins.js`. However, if you wish to add plugins in the future, this file will have to be modified.

### 7. Deploy
Rodan Client uses [Gulp](http://gulpjs.com/) to manage deployment, both for development and production. How Rodan Client can be deployed is defined in `gulpfile.js`. Just like jspm, Gulp was installed as a development dependency, so its binary is located in `node_modules/.bin'. 

The `gulpfile.js` defines three entry points to deploy Rodan Client. Choose the one best suited for your needs.

##### Development
```
user@computer:~/rodan-client$ ./node_modules/.bin/gulp
```

or

```
user@computer:~/rodan-client$ ./node_modules/.bin/gulp develop
```

The `develop` task is the default task in `gulpfile.js`. This type of deployment is meant for debugging and development. It will:
 * link JavaScript source files, resources, styles, and configuration to `rodan-client/web`
 * run [JSHint](http://jshint.com/) on the JavaScript source
 * start a small web server that hosts the application on your machine's IP at port 9001.

##### Production
```
user@computer:~/rodan-client$ ./node_modules/.bin/gulp dist
```

The `dist` task will create a single JavaScript bundle file for the application and copy only those files required for deployment. This type of deployment is meant for production. All files required are stored in `rodan-client/dist`. You will have to setup a web server to statically serve the contents of this directory.

If you wish to test the bundle, you can run:

```
user@computer:~/rodan-client$ ./node_modules/.bin/gulp dist:server
```

This does the same as the simple `dist` task, but also runs a small development server just as the `develop` task does on port 9001.
