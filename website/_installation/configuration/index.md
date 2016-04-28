---
---
# Configuration

The following lists all Rodan Client configuration settings. Configuration settings are stored in `configuration.json`. The syntax of the file must conform to that of a JSON file.

## Server
* **`SERVER_URL` (required, no default)**: URL of the server to connect to. This includes listing the protocol (http or https), the IP or domain, and the port. Example: `https://123.456.789.1:8080`.
* **`SERVER_AUTHENTICATION_TYPE` (required, no default)**: The authentication type. Either 'session' or 'token'.
* **`SERVER_REQUEST_TIME_INTERVAL` (default: 60000)**: Interval (in milliseconds) after which the client will get the server time. Generally, the client extracts the server time from all responses from the server. However, if the client has not received a response from the server after this amount of time, the client will fire an HTTP HEAD request and get the server time. This means that the server MUST exposde the 'Date' response header. As such, it is recommended that this value be greater than the `EVENT_TIMER_FREQUENCY` to reduce traffic.

## Client Admin
* **`ADMIN_CLIENT.NAME` (default: '')**: Name of client admin.
* **`ADMIN_CLIENT.EMAIL` (default: '')**: Email of client admin.

When setting the following, you must JSON object syntax. For example:

```
ADMIN_CLIENT: {
    NAME: 'John Doe',
    EMAIL: 'john@doe.com'
}
```


## General
* **`DATETIME_FORMAT` (default: 'YYYY-MM-DD HH:mm:ss')**: Date/time format. See http://momentjs.com/docs/#/displaying/format/.
* **`EVENT_TIMER_FREQUENCY` (default: 3000)**: Event timer frequency (in milliseconds).
* **`SERVER_WAIT_TIMER` (default: 500)**: If the client has been continuously waiting for responses from the server for this amount of time (in milliseconds), the client will begin to fire `EVENT__SERVER_WAITING` events, which will generally trigger a modal window to lock out the interface. This is used when heavy lifting is going on at the server side, such as a Workflow import.
* **`SERVER_PANIC_TIMER` (default: 8000)**: Same as `SERVER_WAIT_TIMER`, only fires `EVENT__SERVER_PANIC`.
* **`RESOURCE_DISTRIBUTOR_CATEGORY` (default: 'Resource Distributor')**: If you have a Job in your Job package meant solely for distributing Resources (i.e. takes in a single Resource and outputs that Resource) you have the option to use a feature that will automatically create a WorkflowJob of the correct Job that satisfies selected InputPorts. (This feature is described in the [[User Manual]]. If this is the case, those Jobs must have their category set to the value of `RESOURCE_DISTRIBUTOR_CATEGORY`. 

## Interactive RunJob
When a user acquires an interactive RunJob the server locks out all other users from acquiring that RunJob for X milliseconds (as defined by the server). The user's client will attempt to continuously reacquire this lock every `RUNJOB_ACQUIRE_INTERVAL` milliseconds, but it will only do this for `RUNJOB_ACQUIRE_DURATION`.

* **`RUNJOB_ACQUIRE_DURATION` (default: 3600000)**: Time (in milliseconds) that the client will attempt to hold a job. 
* **`RUNJOB_ACQUIRE_INTERVAL` (default: 5000)**: Interval (in milliseconds) that the RunJob controller will use to reacquire interactive locks.
 
