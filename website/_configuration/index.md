---
---
# Configuration

The following lists all Rodan Client configuration settings. Configuration settings are stored in `configuration.json`. The syntax of the file must conform to that of a JSON file.

## Server
* **`SERVER_HOST` (required, no default)**: Host name of the server to connect to. Example: "my.domain.com".
* **`SERVER_PORT` (required, no default)**: Port of server. Example: 443.
* **`SERVER_HTTPS` (optional, default: `true`)**: The client will connect to the server using HTTPS iff `SERVER_HTTPS` is `true`. Else, HTTP will be used (not recommended). Note: if using sockets, some browsers require that both HTTP and WS be secure or both not be secure, but not mixed.
* **`SERVER_SOCKET_AVAILABLE` (optional, default: `false`)**: The client will use a web socket connection to be notified of updates to the database iff `SERVER_SOCKET_AVAILABLE` is `SERVER_SOCKET_AVAILABLE`. Else, a polling strategy will be used.
* **`SERVER_SOCKET_DEBUG` (optional, default: `false`)**: Set to true iff you want to see socket message data in the console.
* **`SERVER_AUTHENTICATION_TYPE` (required, no default)**: The authentication type. Either 'session' or 'token'.
* **`SERVER_UPDATE_METHOD` (optional, default: `'POLL'`)**: This determines the method to use for loading updates from the server. Either `'POLL'` (default) or `'SOCKET'`.
* **`SERVER_REQUEST_TIME_INTERVAL` (default: 60000)**: Interval (in milliseconds) after which the client will get the server time. Generally, the client extracts the server time from all responses from the server. However, if the client has not received a response from the server after this amount of time, the client will fire an HTTP HEAD request and get the server time. This means that the server MUST exposde the 'Date' response header. As such, it is recommended that this value be greater than the `EVENT_TIMER_FREQUENCY` to reduce traffic.

## Client Admin
* **`ADMIN_CLIENT.NAME` (default: '')**: Name of client admin.
* **`ADMIN_CLIENT.EMAIL` (default: '')**: Email of client admin.

When setting the following, you must JSON use object syntax. For example:

```
ADMIN_CLIENT: {
    NAME: 'John Doe',
    EMAIL: 'john@doe.com'
}
```


## General
* **`WEBSITE_URL` (default: 'http://ddmal.github.io/rodan-client/')**: Website URL.
* **`DATETIME_FORMAT` (default: 'YYYY-MM-DD HH:mm:ss')**: Date/time format. See http://momentjs.com/docs/#/displaying/format/.
* **`EVENT_TIMER_FREQUENCY` (default: 3000)**: Event timer frequency (in milliseconds).
* **`SERVER_WAIT_TIMER` (default: 500)**: If the client has been continuously waiting for responses from the server for this amount of time (in milliseconds), the client will begin to fire `EVENT__SERVER_WAITING` events, which will generally trigger a modal window to lock out the interface. This is used when heavy lifting is going on at the server side, such as a Workflow import.
* **`SERVER_PANIC_TIMER` (default: 8000)**: Same as `SERVER_WAIT_TIMER`, only fires `EVENT__SERVER_PANIC`.
* **`RESOURCE_DISTRIBUTOR_CATEGORY` (default: "Resource Distributor")**: If you have a Job in your Job package meant solely for distributing Resources (i.e. takes in a single Resource and outputs that Resource) you have the option to use a feature that will automatically create a WorkflowJob of the correct Job that satisfies selected InputPorts. (This feature is described in the [[User Manual]]. If this is the case, those Jobs must have their category set to the value of `RESOURCE_DISTRIBUTOR_CATEGORY`. 

## Interactive RunJob
When a user acquires an interactive RunJob the server locks out all other users from acquiring that RunJob for X milliseconds (as defined by the server). The user's client will attempt to continuously reacquire this lock every `RUNJOB_ACQUIRE_INTERVAL` milliseconds, but it will only do this for `RUNJOB_ACQUIRE_DURATION`.

* **`RUNJOB_ACQUIRE_DURATION` (default: 3600000)**: Time (in milliseconds) that the client will attempt to hold a job. 
* **`RUNJOB_ACQUIRE_INTERVAL` (default: 5000)**: Interval (in milliseconds) that the RunJob controller will use to reacquire interactive locks.
 
