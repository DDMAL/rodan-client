/**
 * Backbone.Radio events use in the client.
 */
var Events = 
{
// todo
// make sure Events can only be listened to and requests can only be requested
// CONTROLLERS: workflow, workflowjob, workflowjobgroup, workflowrun: they all message the builder and they shouldn't

// TODO - in final docs, explain
// 
//  make model saves like workflowjob controller; only specify the "changed" fields
//  after creating workflowjob, ports, etc...validation should happen based on an event, not via the controllers
//  server errors (json)
//  explain options for route
//  data: {query parameters}
//  explain the "Global" collections
//  difference between events and requests
//  fields: {object with attributes to change}
//  naming convention of Events and Requests
// how configuration.js is used for some events
//  why we use "Collection" and not "List"
//  mark some of these as "hidden" or try to remove them 
    EVENT__NAVIGATION_SELECTED_NODE: 'EVENT__NAVIGATION_SELECTED_NODE', // Triggered when the user clicks on a navigation element in the vertical menu. Sends {node: ViewNavigationNode or one of its descendants}.
    REQUEST__MODAL_SHOW_WAITING: 'REQUEST__MODAL_SHOW_WAITING', // Request special modal window to show/open. This modal window disables all input and informs the user that the client is waiting on the server. If another modal is currently open the request will not show. 
    REQUEST__RESOURCE_SHOWLAYOUTVIEW: 'REQUEST__RESOURCE_SHOWLAYOUTVIEW',   // Show LayoutView for Resource control (outside of the primary Resources view). This tells the ControllerResource which LayoutView to reference upon events. Takes {layoutView: LayoutView}.
    REQUEST__RUNJOB_SHOWLAYOUTVIEW: 'REQUEST__RUNJOB_SHOWLAYOUTVIEW',   // Show LayoutView for RunJob control (outside of the primary RunJobs view). This tells the ControllerRunJob which LayoutView to reference upon events. Takes {layoutView: LayoutView}.
    EVENT__SERVER_WENTAWAY: 'EVENT__SERVER_WENTAWAY',                           // Called on server disconnect. No pass.
    EVENT__SERVER_PANIC: 'EVENT__SERVER_PANIC',                                 // Called when the app suspects that something went wrong.
    REQUEST__SYSTEM_DISPLAY_MESSAGE: 'REQUEST__SYSTEM_DISPLAY_MESSAGE', // Request message to be displayed in status bar. Takes {text: string}.
    REQUEST__SYSTEM_HANDLE_ERROR: 'REQUEST__SYSTEM_HANDLE_ERROR',       // Sends error to error handler. Takes {model: BaseModel, response: HTTP response, option: associated options}.
    REQUEST__WORKFLOWJOBGROUP: 'REQUEST__WORKFLOWJOBGROUP',

    // these two really require an event system
    REQUEST__WORKFLOWJOBGROUP_UNGROUP: 'REQUEST__WORKFLOWJOBGROUP_UNGROUP',
    REQUEST__WORKFLOWJOBGROUP_DELETE: 'REQUEST__WORKFLOWJOBGROUP_DELETE',



///////////////////////////////////////////////////////////////////////////////////////
// Authentication
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__AUTHENTICATION_ERROR_NULL: 'EVENT__AUTHENTICATION_ERROR_NULL',           // Triggered when authentication error occurred with no other info.
    EVENT__AUTHENTICATION_LOGIN_SUCCESS: 'EVENT__AUTHENTICATION_LOGIN_SUCCESS',     // Triggered on success of authentication check. Sends {user: User}.
    EVENT__AUTHENTICATION_LOGINREQUIRED: 'EVENT__AUTHENTICATION_LOGINREQUIRED',     // Triggered after authentication attempt; user must log in.
    EVENT__AUTHENTICATION_LOGOUT_SUCCESS: 'EVENT__AUTHENTICATION_LOGOUT_SUCCESS',   // Triggered on success of deauthentication.
    REQUEST__AUTHENTICATION_CHECK: 'REQUEST__AUTHENTICATION_CHECK',                 // Request check of authentication status. The client will make a request to the Rodan server. Upon response from the server, the client will fire one of the above AUTHENTICATION events.
    REQUEST__AUTHENTICATION_LOGIN: 'REQUEST__AUTHENTICATION_LOGIN',                 // Request login authentication. Takes {username: string, password: string}. Upon response from the server, the client will fire one of the above AUTHENTICATION events.
    REQUEST__AUTHENTICATION_LOGOUT: 'REQUEST__AUTHENTICATION_LOGOUT',               // Request logout for currently logged in user. Upon response from the server, the client will fire one of the above AUTHENTICATION events.
    REQUEST__AUTHENTICATION_USER: 'REQUEST__AUTHENTICATION_USER',                   // Request currently logged in User. Returns User or null.

///////////////////////////////////////////////////////////////////////////////////////
// Global Collections
//
// The 'LOAD' commands are not meant for general use. They are called on startup.
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__GLOBAL_INPUTPORTTYPE_COLLECTION: 'REQUEST__GLOBAL_INPUTPORTTYPE_COLLECTION',   // Request all InputPortTypes. Returns GlobalInputPortTypeCollection.
    REQUEST__GLOBAL_INPUTPORTTYPES_LOAD: 'REQUEST__GLOBAL_INPUTPORTTYPES_LOAD',             // Request load of InputPortTypes from server. Takes {data: {query parameters}}.
    REQUEST__GLOBAL_JOB_COLLECTION: 'REQUEST__GLOBAL_JOB_COLLECTION',                       // Request all Jobs. Returns GlobalJobCollection.
    REQUEST__GLOBAL_JOBS_LOAD: 'REQUEST__GLOBAL_JOBS_LOAD',                                 // Request load of Jobs from server. Takes {data: {query parameters}}.
    REQUEST__GLOBAL_OUTPUTPORTTYPE_COLLECTION: 'REQUEST__GLOBAL_OUTPUTPORTTYPE_COLLECTION', // Request all OutputPortTypes. Returns GlobalOutputPortTypeCollection.
    REQUEST__GLOBAL_OUTPUTPORTTYPES_LOAD: 'REQUEST__GLOBAL_OUTPUTPORTTYPES_LOAD',           // Request load of OutputPortTypes from server. Takes {data: {query parameters}}.
    REQUEST__GLOBAL_PROJECT_COLLECTION: 'REQUEST__GLOBAL_PROJECT_COLLECTION',               // Request all Projects. Returns GlobalProjectCollection.
    REQUEST__GLOBAL_PROJECTS_LOAD: 'REQUEST__GLOBAL_PROJECTS_LOAD',                         // Request load of Projects from server. Takes {data: {query parameters}}.
    REQUEST__GLOBAL_RESOURCETYPE_COLLECTION: 'REQUEST__GLOBAL_RESOURCETYPE_COLLECTION',     // Request all ResourceTypes. Returns GlobalResourceTypeCollection.
    REQUEST__GLOBAL_RESOURCETYPES_LOAD: 'REQUEST__GLOBAL_RESOURCETYPES_LOAD',               // Request load of ResourceTypes from server. Takes {data: {query parameters}}.

///////////////////////////////////////////////////////////////////////////////////////
// Main Region
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__MAINREGION_SHOW_VIEW: 'REQUEST__MAINREGION_SHOW_VIEW', // Request main region be filled with provided Marionette View. Takes {view: Marionette.View}.

///////////////////////////////////////////////////////////////////////////////////////
// Modal
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__MODAL_HIDE: 'REQUEST__MODAL_HIDE',                 // Request modal window to hide/close.
    REQUEST__MODAL_SHOW: 'REQUEST__MODAL_SHOW',                 // Request modal window to show/open with provided Marionette View. If another modal is currently open the request will not show. Takes {view: Marionette.View, title: string}.
    REQUEST__MODAL_SHOW_SIMPLE: 'REQUEST__MODAL_SHOW_SIMPLE',   // Request modal window to show/open without view. If another modal is currently open the request will not show. Takes {title: string, text: string}.

///////////////////////////////////////////////////////////////////////////////////////
// Model
//
// In addition to the three events below, each model will fire its own custom events:
//  - EVENT__MODEL_CHANGE<model_url>
//  - EVENT__MODEL_SYNC<model_url>
//
// These events are fired on the 'rodan' Radio channel. These are useful if you wish
// to listen only for events by specific models, but regardless of the encapsulating
// Backbone object.
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__COLLECTION_ADD: 'EVENT__COLLECTION_ADD', // Triggered when an instance of BaseModel has been added to a Backbone.Collection. Sends {model: BaseModel, collection: BaseCollection, options: Javascript object}).
    EVENT__MODEL_CHANGE: 'EVENT__MODEL_CHANGE',     // Triggered when an instance of BaseModel has changed (bound to 'change' event in Backbone). Sends {model: BaseModel, response: XMLHTTPRequest, options: Javascript object}.
    EVENT__MODEL_SYNC: 'EVENT__MODEL_SYNC',         // Triggered when an instance of BaseModel has been synced (bound to 'sync' event in Backbone). Sends {model: BaseModel, response: XMLHTTPRequest, options: Javascript object}.

///////////////////////////////////////////////////////////////////////////////////////
// Project
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__PROJECT_SELECTED: 'EVENT__PROJECT_SELECTED',                         // Triggered when the user selects an individual Project. Sends {project: Project}.
    EVENT__PROJECT_SELECTED_COLLECTION: 'EVENT__PROJECT_SELECTED_COLLECTION',   // Triggered when the user selects to see all available Projects.
    REQUEST__PROJECT_CREATE: 'REQUEST__PROJECT_CREATE',                         // Request a Project be created. Takes {creator: User}.
    REQUEST__PROJECT_DELETE: 'REQUEST__PROJECT_DELETE',                         // Request a Project be deleted. Takes {project: Project}.
    REQUEST__PROJECT_GET_ACTIVE: 'REQUEST__PROJECT_GET_ACTIVE',                 // Request currently active/open Project. Returns Project (or null).
    REQUEST__PROJECT_SAVE: 'REQUEST__PROJECT_SAVE',                             // Request a Project be saved/updated. Takes {project: Project, fields: {object with attributes to change}}.
    REQUEST__PROJECT_SET_ACTIVE: 'REQUEST__PROJECT_SET_ACTIVE',                 // Request a Project be set as active Project. Takes {project: Project}.

///////////////////////////////////////////////////////////////////////////////////////
// Resource
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__RESOURCE_SELECTED: 'EVENT__RESOURCE_SELECTED',                       // Triggered when the user selects an individual Resource. Sends {resource: Resource}.
    EVENT__RESOURCE_SELECTED_COLLECTION: 'EVENT__RESOURCE_SELECTED_COLLECTION', // Triggered when the user selects to see all available Resources. Sends {project: Project (Project associated with ResourceCollection)}.
    REQUEST__RESOURCE_CREATE: 'REQUEST__RESOURCE_CREATE',                       // Request a Resource be created. Takes {project: Project, file: JavaScript File object}.
    REQUEST__RESOURCE_DELETE: 'REQUEST__RESOURCE_DELETE',                       // Request a Resource be deleted. Takes {resource: Resource}.
    REQUEST__RESOURCE_SAVE: 'REQUEST__RESOURCE_SAVE',                           // Request a Resource be saved/updated. Takes {resource: Resource, fields: {object with attributes to change}}.
    REQUEST__RESOURCES_LOAD: 'REQUEST__RESOURCES_LOAD',                         // Request a ResourceCollection to be loaded. Takes {data: Object (query parameters)}. Returns ResourceCollection.

///////////////////////////////////////////////////////////////////////////////////////
// RunJob
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__RUNJOB_SELECTED: 'EVENT__RUNJOB_SELECTED',   // Triggered when the user selects an individual RunJob. Sends {runjob: RunJob}.

///////////////////////////////////////////////////////////////////////////////////////
// Server
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__SERVER_ERROR: 'EVENT__SERVER_ERROR',                                 // Triggered on Rodan-based server errors. Sends {json: JSON object of error}.
    EVENT__SERVER_IDLE: 'EVENT__SERVER_IDLE',                                   // Triggered when the client has no pending HTTP requests waiting to complete. Only fires if EVENT__SERVER_WAITING had previously been fired.
    EVENT__SERVER_ROUTESLOADED: 'EVENT__SERVER_ROUTESLOADED',                   // Triggered when server routes have been loaded.
    EVENT__SERVER_WAITING: 'EVENT__SERVER_WAITING',                             // Triggered when client has been waiting a predefined amount of time for 'complete' state (i.e. not waiting on server response).
    REQUEST__SERVER_GET_HOSTNAME: 'REQUEST__SERVER_GET_HOSTNAME',               // Request server hostname. Returns string (hostname).
    REQUEST__SERVER_GET_ROUTE: 'REQUEST__SERVER_GET_ROUTE',                     // Request server URL for route. Takes {route: string}. Returns string (URL).
    REQUEST__SERVER_GET_ROUTE_OPTIONS: 'REQUEST__SERVER_GET_ROUTE_OPTIONS',     // Request options for server route. Takes {route: string}. Returns Javascript object with all options for route.
    REQUEST__SERVER_GET_VERSION: 'REQUEST__SERVER_GET_VERSION',                 // Request version of server. Returns string.
    REQUEST__SERVER_LOAD_ROUTES: 'REQUEST__SERVER_LOAD_ROUTES',                 // Request the client to load all routes. EVENT__SERVER_ROUTESLOADED is triggered on success.
    REQUEST__SERVER_LOAD_ROUTE_OPTIONS: 'REQUEST__SERVER_LOAD_ROUTE_OPTIONS',   // Request the client to load all options for routes. Must authenticate prior to making this request.

///////////////////////////////////////////////////////////////////////////////////////
// Timer
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__TIMER_CLEAR: 'REQUEST__TIMER_CLEAR',               // Request the Timer to clear timed event. Takes nothing.
    REQUEST__TIMER_SET_EVENT: 'REQUEST__TIMER_SET_EVENT',       // Request a (Radio) Event to be scheduled. Takes {event: Event string, options: options for the event that will be passed to listeners}.
    REQUEST__TIMER_SET_FUNCTION: 'REQUEST__TIMER_SET_FUNCTION', // Request a function to be scheduled. Takes {function: function callback}. It is recommended that you use ES6 "fat arrow" notation to preserver scope and pass arguments to the function.
    REQUEST__TIMER_SET_REQUEST: 'REQUEST__TIMER_SET_REQUEST',   // Request a (Radio) Request to be scheduled. Takes {event: Event string, options: options for the event that will be passed to listeners}.

///////////////////////////////////////////////////////////////////////////////////////
// Workflow
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__WORKFLOW_SELECTED: 'EVENT__WORKFLOW_SELECTED',                       // Triggered when the user selects an individual Workflow. Sends {workflow: Workflow}.
    EVENT__WORKFLOW_SELECTED_COLLECTION: 'EVENT__WORKFLOW_SELECTED_COLLECTION', // Triggered when the user selects to see all available Workflows. Sends {project: Project (Project associated with WorkflowCollection)}.
    REQUEST__WORKFLOW_CREATE: 'REQUEST__WORKFLOW_CREATE',                       // Request a Workflow be created. Takes {project: Project}.
    REQUEST__WORKFLOW_DELETE: 'REQUEST__WORKFLOW_DELETE',                       // Request a Workflow be deleted. Takes {workflow: Workflow}.
    REQUEST__WORKFLOW_SAVE: 'REQUEST__WORKFLOW_SAVE',                           // Request a Workflow be saved/updated. Takes {workflow: Workflow, fields: {object with attributes to change}}.

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowBuilder
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__WORKFLOWBUILDER_WORKFLOW_VALIDATED: 'EVENT__WORKFLOWBUILDER_WORKFLOW_VALIDATED',     // Triggered when Workflow in WorkflowBuilder has been validated.
    REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT: 'REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT',           // Called when InputPort needs to be added to WorkflowJob. Takes {inputportype: InputPortType, workflowjob: WorkflowJob (may be null, in which case currently selected WorkflowJob will be used)}.
    REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT: 'REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT',         // Called when OutputPort needs to be added to WorkflowJob. Takes {outputporttype: OutputPortType, workflowjob: WorkflowJob (may be null, in which case currently selected WorkflowJob will be used), targetinputports: [InputPort] optional}.
                                                                                                // targetinputports are InputPorts that will automatically have a Connection created
    REQUEST__WORKFLOWBUILDER_DELETE_INPUTPORT: 'REQUEST__WORKFLOWBUILDER_DELETE_INPUTPORT',     // Called when InputPort needs to be deleted from workflow job. Takes {model: InputPort}.
    REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOB: 'REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOB',       // Called when WorkflowJob needs to be added to active Workfoow. Takes {job: Job}.
    REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOB: 'REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOB', // Delete WorkflowJob. Takes {model: WorkflowJob}.
    REQUEST__WORKFLOWBUILDER_DELETE_OUTPUTPORT: 'REQUEST__WORKFLOWBUILDER_DELETE_OUTPUTPORT',   // Called when OutputPort needs to be deleted from workflow job. Takes {model: OutputPort}.
    REQUEST__WORKFLOWBUILDER_SAVE_WORKFLOWJOB: 'REQUEST__WORKFLOWBUILDER_SAVE_WORKFLOWJOB',     // Called when WorkflowJob needs to be saved. Takes {workflowjob: WorkflowJob}.
    REQUEST__WORKFLOWBUILDER_ADD_CONNECTION: 'REQUEST__WORKFLOWBUILDER_ADD_CONNECTION',         // Called when Connection should be created. Takes {inputportid: string, outputportid: string}.
    REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW: 'REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW',   // Called when Workflow needs to be saved.
    REQUEST__WORKFLOWBUILDER_RUN_WORKFLOW: 'REQUEST__WORKFLOWBUILDER_RUN_WORKFLOW',             // Called when Workflow needs to be run.
    REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW: 'REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW',
    REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB: 'REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB',
    REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOBGROUP: 'REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOBGROUP',
    REQUEST__WORKFLOWBUILDER_GET_INPUTPORT: 'REQUEST__WORKFLOWBUILDER_GET_INPUTPORT',
    REQUEST__WORKFLOWBUILDER_GET_OUTPUTPORT: 'REQUEST__WORKFLOWBUILDER_GET_OUTPUTPORT',
    REQUEST__WORKFLOWBUILDER_GET_CONNECTION: 'REQUEST__WORKFLOWBUILDER_GET_CONNECTION',
    REQUEST__WORKFLOWBUILDER_IMPORT_WORKFLOW: 'REQUEST__WORKFLOWBUILDER_IMPORT_WORKFLOW',       // Import provided Workflow into Workflow loaded in the WorkflowBuilder. Takes {workflow: Workflow}.
    REQUEST__WORKFLOWBUILDER_DELETE_CONNECTION: 'REQUEST__WORKFLOWBUILDER_DELETE_CONNECTION',
    REQUEST__WORKFLOWBUILDER_GET_WORKFLOW: 'REQUEST__WORKFLOWBUILDER_GET_WORKFLOW',             // Returns currently loaded Workflow.
    EVENT__WORKFLOWBUILDER_SELECTED: 'EVENT__WORKFLOWBUILDER_SELECTED',                         // Called on WorkflowBuilder opening. Takes {workflow: Workflow}. May be null if new workflow needed.
    REQUEST__WORKFLOWBUILDER_GET_RESOURCEASSIGNMENTS: 'REQUEST__WORKFLOWBUILDER_GET_RESOURCEASSIGNMENTS',
    REQUEST__WORKFLOWBUILDER_UNGROUP_WORKFLOWJOBGROUP: 'REQUEST__WORKFLOWBUILDER_UNGROUP_WORKFLOWJOBGROUP',
    REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOBGROUP: 'REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOBGROUP',
    REQUEST__WORKFLOWBUILDER_CREATE_DISTRIBUTOR: 'REQUEST__WORKFLOWBUILDER_CREATE_DISTRIBUTOR',   // Called when a resource distributor WorkflowJob should be created. Takes {urls: [{url: string}]}.
    REQUEST__WORKFLOWBUILDER_ASSIGN_RESOURCE: 'REQUEST__WORKFLOWBUILDER_ASSIGN_RESOURCE',       
    REQUEST__WORKFLOWBUILDER_CREATE_WORKFLOWRUN: 'EVENT__WORKFLOWBUILDER_CREATE_WORKFLOWRUN',   // Create a WorkflowRun (but do not save). Takes {model: WorkflowRun}.
    REQUEST__WORKFLOWBUILDER_GET_COMPATIBLE_RESOURCETYPES: 'REQUEST__WORKFLOWBUILDER_GET_COMPATIBLE_RESOURCETYPES', // Given an array of InputPort URLs, returns list of ResourceType URLs that would satisfy it. Takes {urls: [string]}.
    REQUEST__WORKFLOWBUILDER_UNASSIGN_RESOURCE: 'REQUEST__WORKFLOWBUILDER_UNASSIGN_RESOURCE',
    REQUEST__WORKFLOWBUILDER_SHOW_RESOURCEASSIGNMENT_VIEW: 'REQUEST__WORKFLOWBUILDER_SHOW_RESOURCEASSIGNMENT_VIEW',
    REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOW_VIEW: 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOW_VIEW',
    REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_VIEW: 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_VIEW',
    REQUEST__WORKFLOWBUILDER_SHOW_JOB_LIST_VIEW: 'REQUEST__WORKFLOWBUILDER_SHOW_JOB_LIST_VIEW',
    REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOW_LIST_VIEW: 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOW_LIST_VIEW',
    REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOBGROUP_VIEW: 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOBGROUP_VIEW',
    REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_PORTS_VIEW: 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_PORTS_VIEW',
    REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_SETTINGS_VIEW: 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_SETTINGS_VIEW',
    REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOBGROUP: 'REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOBGROUP',

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowJob
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__WORKFLOWJOB_CREATE: 'REQUEST__WORKFLOWJOB_CREATE', // Request a WorkflowJob be created of a Job type and added to a Workflow. Takes {job: Job, workflow: Workflow, addports: boolean, targetinputports: [InputPort] (optional)}. The minimum required InputPorts will be created iff addports is true. If targetinputports array of InputPorts is provided, Connections will be made to those InputPorts (from this WorkflowJob's OutputPort) iff the WorkflowJob created has one and only one OutputPort.
    REQUEST__WORKFLOWJOB_DELETE: 'REQUEST__WORKFLOWJOB_DELETE', // Request a WorkflowJob be deleted. Takes {workflowjob: WorkflowJob}.
    REQUEST__WORKFLOWJOB_SAVE: 'REQUEST__WORKFLOWJOB_SAVE',     // Request a WorkflowJob be saved/updated. Takes {workflowjob: WorkflowJob}.

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowJobGroup
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__WORKFLOWJOBGROUP_CREATE: 'REQUEST__WORKFLOWJOBGROUP_CREATE',                   // Request a WorkflowJobGroup be created. Takes {workflowjobs: [WorkflowJob], workflow: Workflow}.
    REQUEST__WORKFLOWJOBGROUP_IMPORT: 'REQUEST__WORKFLOWJOBGROUP_IMPORT',                   // Request a Workflow (origin) be imported into another Workflow (target) as a WorkflowJobGroup. Takes {target: Workflow, origin: Workflow}.
    REQUEST__WORKFLOWJOBGROUP_LOAD_COLLECTION: 'REQUEST__WORKFLOWJOBGROUP_LOAD_COLLECTION', // Request WorkflowJobGroups be loaded for a given Workflow. Takes {workflow: Workflow}.
    REQUEST__WORKFLOWJOBGROUP_SAVE: 'REQUEST__WORKFLOWJOBGROUP_SAVE',                       // Request a WorkflowJobGroup be saved/updated. Takes {workflowjobgroup: WorkflowJobGroup}.
    REQUEST__WORKFLOWJOBGROUP_GET_PORTS: 'REQUEST__WORKFLOWJOBGROUP_GET_PORTS',             // Request arrays of InputPort URLs and OutputPort URLs for the given WorkflowJobGroup. Takes {url: string (WorkflowJobGroup URL)}. Returns {inputports: [InputPort], outputports: [OutputPort]}.

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowRun
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__WORKFLOWRUN_SELECTED: 'EVENT__WORKFLOWRUN_SELECTED',                         // Triggered when the user selects an individual WorkflowRun. Sends {workflow: WorkflowRun}.
    EVENT__WORKFLOWRUN_SELECTED_COLLECTION: 'EVENT__WORKFLOWRUN_SELECTED_COLLECTION',   // Triggered when the user selects to see all available WorkflowRuns. Sends {project: Project (Project associated with WorkflowRunCollection)}.
    REQUEST__WORKFLOWRUN_CREATE: 'REQUEST__WORKFLOWRUN_CREATE',                         // Request a WorkflowRun be created. Takes {workflow: Workflow, assignments: [string (Resource URLs or individual ResourceList URL)] (index by InputPort URLs)}.
    REQUEST__WORKFLOWRUN_SAVE: 'REQUEST__WORKFLOWRUN_SAVE'                              // Request a WorkflowRun be saved/updated. Takes {model: WorkflowRun}.
};

export default Events;