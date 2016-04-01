/**
 * This is a sample configuration file.
 * Make sure to make a copy and rename it to 'Configuration.js'.
 */

var Configuration = {
///////////////////////////////////////////////////////////////////////////////////////
// Server parameters
///////////////////////////////////////////////////////////////////////////////////////
    // URL of the server to connect to.
    SERVER_URL: '',

    // Authentication type. Either 'session' or 'token'.
    SERVER_AUTHENTICATION_TYPE: '',

    // Interval after which the client will get the server time (ms).
    // Generally, the client extracts the server time from all responses from the server.
    // However, if the client has not received a response from the server after this
    // amount of time, the client will fire an HTTP HEAD request and get the server 
    // time. This means that the server MUST exposde the 'Date' response header. As
    // such, it is recommended that this value be greater than the 
    // EVENT_TIMER_FREQUENCY to reduce traffic.
    SERVER_REQUEST_TIME_INTERVAL: 8000,

///////////////////////////////////////////////////////////////////////////////////////
// General behavior parameters
///////////////////////////////////////////////////////////////////////////////////////
    // Date/time format. See http://momentjs.com/docs/#/displaying/format/
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',

    // Event timer frequency (ms).
    EVENT_TIMER_FREQUENCY: 3000,

    // Milliseconds to wait before the client goes into a 'wait' mode. This is used in the WorkflowBuilder when heavy lifting is going on, such as a Workflow import.
    SERVER_WAIT_TIMER: 500,

    // Milliseconds to wait before the client 'panics' mode. This is used in the WorkflowBuilder when heavy lifting is going on, such as a Workflow import.
    // This should be bigger than SERVER_WAIT_TIMER.
    SERVER_PANIC_TIMER: 8000,

    // If you have a Job package meant solely for distributing Resources (i.e. takes in a single Resource and outputs that Resource) you have the option to use a 
    // feature that will automatically create a WorkflowJob of the correct Job that satisfies selected InputPorts. If this is the case, those Jobs must have
    // their category set to the value of RESOURCE_DISTRIBUTOR_CATEGORY.
    RESOURCE_DISTRIBUTOR_CATEGORY: 'Resource Distributor',

///////////////////////////////////////////////////////////////////////////////////////
// Interactive RunJob parameters
///////////////////////////////////////////////////////////////////////////////////////
    // Time (in milliseconds) that the CLIENT will attempt to hold a job.
    RUNJOB_ACQUIRE_DURATION: 3600000,

    // Interval (in milliseconds) that the RunJob controller will use to reacquire interactive locks.
    RUNJOB_ACQUIRE_INTERVAL: 5000,

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowBuilder GUI parameters
///////////////////////////////////////////////////////////////////////////////////////
    WORKFLOWBUILDER: {

        // Identifier for this client.
        USER_AGENT: 'rodan-standard',

        // Grid parameters.
        GRID:
        {
            DIMENSION: 20,
            LINE_COLOR: '#606060',
            LINE_WIDTH: 0.5  
        },

        // Zoom settings. These are percentages of the paper zoom.
        ZOOM_MAX: 3.0,
        ZOOM_MIN: 1.0,
        ZOOM_RATE: 0.05,
        ZOOM_INITIAL: 1.7,

        // Item sizes (pixels).
        WORKFLOWJOB_WIDTH: 20,
        WORKFLOWJOB_HEIGHT: 22,
        PORT_WIDTH: 8,
        PORT_HEIGHT: 8,

        // Appearance parameters.
        OUTPUTPORT_COLOR: '#00ff00',
        INPUTPORT_COLOR_SATISFIED: '#00ff00',
        INPUTPORT_COLOR_UNSATISFIED: '#ff8800',
        STROKE_COLOR: '#000000',
        FILL_COLOR: '#ccccff',
        WORKFLOWJOBGROUP_FILL_COLOR: '#8888ff',
        STROKE_WIDTH: 1,
        FONT_SIZE: 10,
        STROKE_COLOR_SELECTED: '#0000ff',
        STROKE_WIDTH_SELECTED: 2,
        CONNECTION_CIRCLE_RADIUS: 4,

        // Hover time. This is the amount of time the mouse must
        // hover over an item for a pop-up to appear in milliseconds.
        HOVER_TIME: 1000
    },

///////////////////////////////////////////////////////////////////////////////////////
// DON'T EDIT BELOW THIS LINE (unless you know what you're doing)
///////////////////////////////////////////////////////////////////////////////////////
    // Routes without OPTIONS. if the route name is in here, the client won't try to grab them.
    ROUTES_WITHOUT_OPTIONS: ['auth-reset-token', 'taskqueue-status', 'auth-change-password', 'auth-register', 'taskqueue-scheduled', 'taskqueue-active', 'auth-token'],

    // Client admin info. Leave fields empty if you don't want to be bothered. ;)
    ADMIN_CLIENT: {
        name: '',
        email: ''
    }
};

///////////////////////////////////////////////////////////////////////////////////////
// Loader methods
///////////////////////////////////////////////////////////////////////////////////////
/**
 * Requests 'configuration.json' from the client host. Whatever it gets from the host
 * it will merge with the default configuration.
 *
 * When finished it will fire the provided callback.
 */
Configuration.loadConfiguration = function(callback)
{
    var request = new XMLHttpRequest();
    request.open('GET', 'configuration.json', true);
    request.onreadystatechange = (event) => this._handleStateChange(event, callback);
    request.send();
}

/**
 * Handle state change of request.
 */
Configuration._handleStateChange = function(event, callback)
{
    var request = event.currentTarget;
    switch (request.readyState)
    {
        case 0: //UNSENT
        {
            break;
        }

        case 1: //OPENED
        {
            break;
        }

        case 2: //HEADERS_RECEIVED
        {
            break;
        }

        case 3: //LOADING
        {
            break;
        }

        case 4:
        {
            var configuration = JSON.parse(request.response);
            $.extend(this, configuration);
            if (callback)
            {
                callback();
            }
            break;
        }

        default:
        {
            // TODO error
            console.error('failed to load configuration.json');
            break;
        }
    }
}

export default Configuration;
