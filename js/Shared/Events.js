/**
 * Backbone.Radio events use in the client.
 */
var Events = 
{
///////////////////////////////////////////////////////////////////////////////////////
// Authentication
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__SET_TIMED_EVENT: 'REQUEST__SET_TIMED_EVENT',       // Called when an Event is to be scheduled. Takes {event: Event string, options: options for the event}.
    REQUEST__SET_TIMED_REQUEST: 'REQUEST__SET_TIMED_REQUEST',   // Called when a Request is to be scheduled.  Takes {event: Event string, options: options for the event, callback: callback function that takes the response of the request; may be null}.
    REQUEST__CLEAR_TIMED_EVENT: 'REQUEST__CLEAR_TIMED_EVENT',   // Called to clear timed event.
    EVENT__TIMER_TEST: 'EVENT__TIMER_TEST',                     // DO NOT USE.
    REQUEST__TIMER_TEST: 'REQUEST__TIMER_TEST',                 // DO NOT USE.

///////////////////////////////////////////////////////////////////////////////////////
// Authentication
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__AUTHENTICATION_LOGIN: 'REQUEST__AUTHENTICATION_LOGIN',
    REQUEST__AUTHENTICATION_LOGOUT: 'REQUEST__AUTHENTICATION_LOGOUT',
    REQUEST__AUTHENTICATION_CHECK: 'REQUEST__AUTHENTICATION_CHECK',
    EVENT__AUTHENTICATION_ERROR_400: 'EVENT__AUTHENTICATION_ERROR_400',
    EVENT__AUTHENTICATION_ERROR_401: 'EVENT__AUTHENTICATION_ERROR_401',
    EVENT__AUTHENTICATION_ERROR_403: 'EVENT__AUTHENTICATION_ERROR_403',
    EVENT__AUTHENTICATION_ERROR_NULL: 'EVENT__AUTHENTICATION_ERROR_NULL',
    EVENT__AUTHENTICATION_ERROR_UNKNOWN: 'EVENT__AUTHENTICATION_ERROR_UNKNOWN',
    EVENT__AUTHENTICATION_LOGINREQUIRED: 'EVENT__AUTHENTICATION_LOGINREQUIRED', // Called to inform listeners that the user has to login.
    EVENT__AUTHENTICATION_SUCCESS: 'EVENT__AUTHENTICATION_SUCCESS',             // Called on success of authentication check. Takes {user: User}.
    EVENT__DEAUTHENTICATION_SUCCESS: 'EVENT__DEAUTHENTICATION_SUCCESS',         // Called on success of deauthentication.
    REQUEST__AUTHENTICATION_USER: 'REQUEST__AUTHENTICATION_USER',

///////////////////////////////////////////////////////////////////////////////////////
// Global Collections
//
// The 'LOAD' commands are not meant for general use. They are called on startup.
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__GLOBAL_INPUTPORTTYPE_COLLECTION: 'REQUEST__GLOBAL_INPUTPORTTYPE_COLLECTION',   // Returns InputPortTypes.
    REQUEST__GLOBAL_INPUTPORTTYPES_LOAD: 'REQUEST__GLOBAL_INPUTPORTTYPES_LOAD',             // Load InputPortTypes from server. Takes {data: {query parameters}}.
    REQUEST__GLOBAL_JOB_COLLECTION: 'REQUEST__GLOBAL_JOB_COLLECTION',                       // Returns Jobs.
    REQUEST__GLOBAL_JOBS_LOAD: 'REQUEST__GLOBAL_JOBS_LOAD',                                 // Load Jobs from server. Takes {data: {query parameters}}.
    REQUEST__GLOBAL_OUTPUTPORTTYPE_COLLECTION: 'REQUEST__GLOBAL_OUTPUTPORTTYPE_COLLECTION', // Returns OutputPortTypes.
    REQUEST__GLOBAL_OUTPUTPORTTYPES_LOAD: 'REQUEST__GLOBAL_OUTPUTPORTTYPES_LOAD',           // Load OutputPortTypes from server. Takes {data: {query parameters}}.
    REQUEST__GLOBAL_PROJECT_COLLECTION: 'REQUEST__GLOBAL_PROJECT_COLLECTION',               // Returns Projects.
    REQUEST__GLOBAL_PROJECTS_LOAD: 'REQUEST__GLOBAL_PROJECTS_LOAD',                         // Load Projects from server. Takes {data: {query parameters}}.
    REQUEST__GLOBAL_RESOURCETYPE_COLLECTION: 'REQUEST__GLOBAL_RESOURCETYPE_COLLECTION',     // Returns ResourceTypes.
    REQUEST__GLOBAL_RESOURCETYPES_LOAD: 'REQUEST__GLOBAL_RESOURCETYPES_LOAD',               // Load ResourceTypes from server. Takes {data: {query parameters}}.

///////////////////////////////////////////////////////////////////////////////////////
// Job
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__JOB_SELECTED: 'EVENT__JOB_SELECTED', // Called on Job selection.

///////////////////////////////////////////////////////////////////////////////////////
// Model
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__MODEL_HASCHANGED: 'EVENT__MODEL_HASCHANGED', // Called when a model has changed (bound to 'hasChanged' in Backbone). Takes {model: BaseModel};

///////////////////////////////////////////////////////////////////////////////////////
// Navigation/UI
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__NAVIGATION_NODE_SELECTED: 'EVENT__NAVIGATION_NODE_SELECTED',         // Informs of node selection. Takes {node: ViewNavigationNode}.
    REQUEST__NAVIGATION_LAYOUTVIEW_SHOW: 'REQUEST__NAVIGATION_LAYOUTVIEW_SHOW',

///////////////////////////////////////////////////////////////////////////////////////
// Project
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__PROJECT_SELECTED: 'EVENT__PROJECT_SELECTED',         // Called on Project selection. Takes {project: Project}.
    EVENT__PROJECTS_SELECTED: 'EVENT__PROJECTS_SELECTED',       // Called on Project selection.
    REQUEST__PROJECT_ACTIVE: 'REQUEST__PROJECT_ACTIVE',         // Returns currently active Project.
    REQUEST__PROJECT_CREATE: 'REQUEST__PROJECT_CREATE',         // Create Project. Takes {creator: User}.
    REQUEST__PROJECT_DELETE: 'REQUEST__PROJECT_DELETE',         // Delete Project. Takes {project: Project}.
    REQUEST__PROJECT_SAVE: 'REQUEST__PROJECT_SAVE',             // Save Project. Takes {project: Project, fields: {object with attributes to change}}.
    REQUEST__PROJECT_SET_ACTIVE: 'REQUEST__PROJECT_SET_ACTIVE', // Set active Project. Takes {project: Project}.
    REQUEST__PROJECTS_SYNC: 'REQUEST__PROJECTS_SYNC',           // Updates the ProjectCollection without resetting.

///////////////////////////////////////////////////////////////////////////////////////
// Resource
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__RESOURCE_SELECTED: 'EVENT__RESOURCE_SELECTED',                   // Called on Resource selection. Takes {resource: Resource}.
    EVENT__RESOURCES_SELECTED: 'EVENT__RESOURCES_SELECTED',                 // Called on Resources selection. Takes (project: Project}.
    REQUEST__RESOURCE_CREATE: 'REQUEST__RESOURCE_CREATE',                   // Create Resource. Takes {project: Project, file: JavaScript File object}.
    REQUEST__RESOURCE_DELETE: 'REQUEST__RESOURCE_DELETE',                   // Delete Resource. Takes {resource: Resource}.
    REQUEST__RESOURCE_SAVE: 'REQUEST__RESOURCE_SAVE',                       // Save Resource. Takes {resource: Resource, fields: {object with attributes to change}}.
    REQUEST__RESOURCE_SHOWLAYOUTVIEW: 'REQUEST__RESOURCE_SHOWLAYOUTVIEW',   // Show LayoutView for Resource control (outside of the primary Resources view). This tells the ResourceController which LayoutView to reference upon events. Takes {layoutView: LayoutView}.
    REQUEST__RESOURCES_LOAD: 'REQUEST__RESOURCES_LOAD',                     // Load Resources from server. Takes {data: Object (query parameters)}. The ResourceController will manage/update to the ResourceCollection.
    REQUEST__RESOURCES_SYNC: 'REQUEST__RESOURCES_SYNC',                     // Update the ResourceCollection without resetting.

///////////////////////////////////////////////////////////////////////////////////////
// RunJob
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__RUNJOB_SELECTED: 'EVENT__RUNJOB_SELECTED',                   // Called on RunJob selection. Takes {runjob: RunJob}.
    REQUEST__RUNJOB_SHOWLAYOUTVIEW: 'REQUEST__RUNJOB_SHOWLAYOUTVIEW',   // Show LayoutView for RunJob control (outside of the primary RunJobs view). This tells the RunJobController which LayoutView to reference upon events. Takes {layoutView: LayoutView}.

///////////////////////////////////////////////////////////////////////////////////////
// Server
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__SERVER_ROUTE: 'REQUEST__SERVER_ROUTE', // Returns server route. Pass associated string.
    REQUEST__SERVER_HOSTNAME: 'REQUEST__SERVER_HOSTNAME', // Returns server hostname. No pass.
    REQUEST__SERVER_VERSION_RODAN: 'REQUEST__SERVER_VERSION_RODAN', // Returns server version (Rodan). No pass.
    EVENT__SERVER_WENT_AWAY: 'EVENT__SERVER_WENT_AWAY', // Called on server disconnect. No pass.
    EVENT__SERVER_ROUTESLOADED: 'EVENT__SERVER_ROUTESLOADED', // Called when routes loaded. No pass.
    REQUEST__SERVER_GET_ROUTES: 'REQUEST__SERVER_GET_ROUTES',
    EVENT__SERVER_WAITING: 'EVENT__SERVER_WAITING',             // Fired when client has been waiting a predefined amount of time for 'complete' state (i.e. not waiting on server response).
    EVENT__SERVER_IDLE: 'EVENT__SERVER_IDLE',                   // Fired when server no longer waiting. Only happens if a EVENT__SERVER_WAITING had previously been fired.

///////////////////////////////////////////////////////////////////////////////////////
// System
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__DISPLAY_MESSAGE: 'REQUEST__DISPLAY_MESSAGE',   // Sends messages to the status bar. Takes {text: string}.
    REQUEST__HANDLER_ERROR: 'REQUEST__HANDLER_ERROR',       // Sends error to error handler. Takes {model: BaseModel, response: HTTP response, option: associated options}.
    EVENT__APPLICATION_READY: 'EVENT__APPLICATION_READY',   // Called when app is ready.

///////////////////////////////////////////////////////////////////////////////////////
// Workflow
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__WORKFLOW_SHOWLAYOUTVIEW: 'REQUEST__WORKFLOW_SHOWLAYOUTVIEW',   // Called when a LayoutView wishes to be used for showing Workflows (outside of the primary Workflows view). This tells the WorkflowController which LayoutView to reference upon events. Takes {layoutView: LayoutView}.
    REQUEST__WORKFLOW_ADD: 'REQUEST__WORKFLOW_ADD',                         // Called when Workflow needs to be added. Takes {project: Project}.
    REQUEST__WORKFLOW_SAVE: 'REQUEST__WORKFLOW_SAVE',                       // Called when a Workflow needs to be saved. This is different from the builder save as it only saves the name and description. Takes {workflow: Workflow}.
    REQUEST__WORKFLOWS_SYNC: 'REQUEST__WORKFLOWS_SYNC',                     // Updates the Workflows collection without resetting.
    REQUEST__WORKFLOW_DELETE: 'REQUEST__WORKFLOW_DELETE',                   // Called when Workflow needs to be deleted. Takes {workflow: Workflow}.
    EVENT__WORKFLOW_SELECTED: 'EVENT__WORKFLOW_SELECTED',                   // Called on Workflow selection. Takes {workflow: Workflow}.
    EVENT__WORKFLOWS_SELECTED: 'EVENT__WORKFLOWS_SELECTED',                 // Called on Workflows selection.
    REQUEST__WORKFLOW_IMPORT: 'REQUEST__WORKFLOW_IMPORT',                     // Imports Workflow into another. Takes {target: Workflow, origin: Workflow}. 'origin' is imported into 'target'.

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowBuilder
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT: 'REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT',           // Called when InputPort needs to be added to WorkflowJob. Takes {inputportype: InputPortType, workflowjob: WorkflowJob (may be null, in which case currently selected WorkflowJob will be used)}.
    REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT: 'REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT',         // Called when OutputPort needs to be added to WorkflowJob. Takes {outputporttype: OutputPortType, workflowjob: WorkflowJob (may be null, in which case currently selected WorkflowJob will be used), targetinputports: [InputPort] optional}.
                                                                                                // targetinputports are InputPorts that will automatically have a Connection created
    REQUEST__WORKFLOWBUILDER_DELETE_INPUTPORT: 'REQUEST__WORKFLOWBUILDER_DELETE_INPUTPORT',     // Called when InputPort needs to be deleted from workflow job. Takes {inputport: InputPort}.
    REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOB: 'REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOB',       // Called when WorkflowJob needs to be added to active Workfoow. Takes {job: Job}.
    REQUEST__WORKFLOWBUILDER_REMOVE_WORKFLOWJOB: 'REQUEST__WORKFLOWBUILDER_REMOVE_WORKFLOWJOB', // Called when WorkflowJob needs to be removed from Workflow. Takes {workflowjob: WorkflowJob}.
    REQUEST__WORKFLOWBUILDER_DELETE_OUTPUTPORT: 'REQUEST__WORKFLOWBUILDER_DELETE_OUTPUTPORT',   // Called when OutputPort needs to be deleted from workflow job. Takes {outputport: OutputPort}.
    REQUEST__WORKFLOWBUILDER_SAVE_WORKFLOWJOB: 'REQUEST__WORKFLOWBUILDER_SAVE_WORKFLOWJOB',     // Called when WorkflowJob needs to be saved. Takes {workflowjob: WorkflowJob}.
    REQUEST__WORKFLOWBUILDER_ADD_CONNECTION: 'REQUEST__WORKFLOWBUILDER_ADD_CONNECTION',         // Called when Connection should be created. Takes {inputportid: string, outputportid: string}.
    REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW: 'REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW',   // Called when Workflow needs to be saved.
    REQUEST__WORKFLOWBUILDER_RUN_WORKFLOW: 'REQUEST__WORKFLOWBUILDER_RUN_WORKFLOW',             // Called when Workflow needs to be run.
    REQUEST__WORKFLOWBUILDER_CONTROL_SHOW_JOBS: 'REQUEST__WORKFLOWBUILDER_CONTROL_SHOW_JOBS',   // Called when Job list view needs to be shown.
    REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW: 'REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW',
    REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB: 'REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB',
    REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOBGROUP: 'REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOBGROUP',
    REQUEST__WORKFLOWBUILDER_GET_INPUTPORT: 'REQUEST__WORKFLOWBUILDER_GET_INPUTPORT',
    REQUEST__WORKFLOWBUILDER_GET_OUTPUTPORT: 'REQUEST__WORKFLOWBUILDER_GET_OUTPUTPORT',
    REQUEST__WORKFLOWBUILDER_GET_CONNECTION: 'REQUEST__WORKFLOWBUILDER_GET_CONNECTION',
    REQUEST__WORKFLOWBUILDER_IMPORT_WORKFLOW: 'REQUEST__WORKFLOWBUILDER_IMPORT_WORKFLOW',       // Import provided Workflow into Workflow loaded in the WorkflowBuilder. Takes {workflow: Workflow}.

    EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED: 'EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED',             // Called when WorkflowJob selected in WorkflowBuilder. Takes {id: string}.
    EVENT__WORKFLOWBUILDER_WORKFLOWJOBGROUP_SELECTED: 'EVENT__WORKFLOWBUILDER_WORKFLOWJOBGROUP_SELECTED',   // Called when WorkflowJobGroup selected. Takes {id: string}.
    EVENT__WORKFLOWBUILDER_SELECTED: 'EVENT__WORKFLOWBUILDER_SELECTED',                         // Called on WorkflowBuilder opening. Takes {workflow: Workflow}. May be null if new workflow needed.
    EVENT__WORKFLOWBUILDER_DESTROY: 'EVENT__WORKFLOWBUILDER_DESTROY',                           // Called when WorkflowBuilder has been destroyed.
 
    REQUEST__WORKFLOWBUILDER_CREATEDISTRIBUTOR: 'REQUEST__WORKFLOWBUILDER_CREATEDISTRIBUTOR',   // Called when a resource distributor WorkflowJob should be created. Takes {urls: [{url: string}]}.

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowBuilder GUI
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOW: 'REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOW',                               // Called when Workflow needs to be added to workspace. Takes {workflow: Workflow}.
    REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB: 'REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB',                         // Called when WorkflowJob needs to be added to workspace. Takes {workflowJob: WorkflowJob}.
    REQUEST__WORKFLOWBUILDER_GUI_UPDATE_ITEM_WORKFLOWJOB: 'REQUEST__WORKFLOWBUILDER_GUI_UPDATE_ITEM_WORKFLOWJOB',                   // Called when WorkflowJob needs to be updated. Takes {workflowJob: WorkflowJob}.
    REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION: 'REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION',                           // Called when Connection needs to be added to Workflow. Takes {connection: Connection, inputport: InputPort, outputport: OutputPort}.
    REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT: 'REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT',                             // Called when InputPort needs to be added to WorkflowJob. Takes {workflowjob: WorkflowJob, inputport: InputPort}.
    REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT: 'REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT',                           // Called when OutputPort needs to be added to WorkflowJob Takes {workflowjob: WorkflowJob, outputport: OutputPort}.
    REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_INPUTPORT: 'REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_INPUTPORT',                       // Called when InputPort needs to be deleted from WorkflowJob. Takes {workflowjob: WorkflowJob, inputport: InputPort}.
    REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_OUTPUTPORT: 'REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_OUTPUTPORT',                     // Called when OutputPort needs to be deleted from WorkflowJob. Takes {workflowjob: WorkflowJob, outputport: OutputPort}.
    REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOB: 'REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOB',                   // Called when WorkflowJob item needs to be deleted. Takes {workflowjob: WorkflowJob}.
    REQUEST__WORKFLOWBUILDER_GUI_ZOOM_IN: 'REQUEST__WORKFLOWBUILDER_GUI_ZOOM_IN',                                                   // Called when request workspace zoom in.
    REQUEST__WORKFLOWBUILDER_GUI_ZOOM_OUT: 'REQUEST__WORKFLOWBUILDER_GUI_ZOOM_OUT',                                                 // Called when request workspace zoom out.
    REQUEST__WORKFLOWBUILDER_GUI_ZOOM_RESET: 'REQUEST__WORKFLOWBUILDER_GUI_ZOOM_RESET',                                             // Called when request workspace zoom reset.
    REQUEST__WORKFLOWBUILDER_GUI_GET_SELECTED_WORKFLOWJOB_IDS: 'REQUEST__WORKFLOWBUILDER_GUI_GET_SELECTED_WORKFLOWJOB_IDS',         // Called when request list of all selected WorkflowJob IDs.
    REQUEST__WORKFLOWBUILDER_GUI_HIDE_WORKFLOWJOB: 'REQUEST__WORKFLOWBUILDER_GUI_HIDE_WORKFLOWJOB',                                 // Called when the GUI should hide a provided WorkflowJob and its associated Connections. Takes {workflowjob: WorkflowJob}.
    REQUEST__WORKFLOWBUILDER_GUI_SHOW_WORKFLOWJOB: 'REQUEST__WORKFLOWBUILDER_GUI_SHOW_WORKFLOWJOB',                                 // Called when the GUI should show a provided WorkflowJob and its associated Connections. Takes {workflowjob: WorkflowJob}.
    REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOBGROUP: 'REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOBGROUP',               // Called when WorkflowJobGroup item needs to be added to workspace. Takes {workflowjobgroup: WorkflowJobGroup, position: {x: real, y: real}}.
    REQUEST__WORKFLOWBUILDER_GUI_PORT_ITEMS_WITH_WORKFLOWJOBGROUP: 'REQUEST__WORKFLOWBUILDER_GUI_PORT_ITEMS_WITH_WORKFLOWJOBGROUP', // Called when the GUI should associated port items with a WorkflowJobGroup. Takes {workflowjobgroup: WorkflowJobGroup, inputports: [InputPort], outputports: [OutputPort]}.
    REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOBGROUP: 'REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOBGROUP',         // Called when WorkflowJobGroup needs to be deleted. Takes {workflowjobgroup: WorkflowJobGroup}.
    REQUEST__WORKFLOWBUILDER_GUI_CLEAR: 'REQUEST__WORKFLOWBUILDER_GUI_CLEAR',                                                       // Called when the GUI should clear the canvas and all items.
    REQUEST__WORKFLOWBUILDER_GUI_ADD_RESOURCEDISTRIBUTOR: 'REQUEST__WORKFLOWBUILDER_GUI_ADD_RESOURCEDISTRIBUTOR',                   // Called when the GUI should start creation of a Resource Distributor from the selected InputPorts.
    REQUEST__WORKFLOWBUILDER_GUI_HIDE_CONTEXTMENU: 'REQUEST__WORKFLOWBUILDER_GUI_HIDE_CONTEXTMENU',                                 // Called when the GUI should hide the context menu.
    REQUEST__WORKFLOWBUILDER_GUI_SHOW_CONTEXTMENU: 'REQUEST__WORKFLOWBUILDER_GUI_SHOW_CONTEXTMENU',                                 // Called when the GUI should show the context menu. Takes {mouseevent: PaperJS MouseEvent where associated click happened, items: [Object]}.
                                                                                                                                    // Objects in items should be:
                                                                                                                                    // {
                                                                                                                                    //      label: [string] // The text that should appear
                                                                                                                                    //      radiorequest: Events.?  // The Request to make. NOT A RADIO EVENT, rather a REQUEST.
                                                                                                                                    //      options: Object holding any options for Event
                                                                                                                                    // }

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowJob
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__WORKFLOWJOB_CREATE: 'REQUEST__WORKFLOWJOB_CREATE', // Called when WorkflowJob needs to be created. Takes {job: Job, workflow: Workflow, addports: boolean, targetintputports: [InputPort] (optional)}.
                                                                // If targetintputports is provided and only one OutputPort was auto created, will connect that OutputPort to the provided InputPorts. Only works if only one OutputPort was created.
    REQUEST__WORKFLOWJOB_DELETE: 'REQUEST__WORKFLOWJOB_DELETE', // Called when WorkflowJob needs to be deleted. Takes {workflowjob: WorkflowJob}.
    REQUEST__WORKFLOWJOB_SAVE: 'REQUEST__WORKFLOWJOB_SAVE',     // Called when WorkflowJob needs to be saved. Takes {workflowjob: WorkflowJob, workflow: Workflow}.

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowJobGroup
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__WORKFLOWJOBGROUP_CREATE: 'REQUEST__WORKFLOWJOBGROUP_CREATE',                 
    REQUEST__WORKFLOWJOBGROUP_DELETE: 'REQUEST__WORKFLOWJOBGROUP_DELETE',
    REQUEST__WORKFLOWJOBGROUP_SAVE: 'REQUEST__WORKFLOWJOBGROUP_SAVE',
    REQUEST__WORKFLOWJOBGROUP_IMPORT: 'REQUEST__WORKFLOWJOBGROUP_IMPORT',   // Called when WorkflowJobGroups are to be imported for given Workflow. Takes {workflow: Workflow}.
    REQUEST__WORKFLOWJOBGROUP: 'REQUEST__WORKFLOWJOBGROUP',                 // ...

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowRun
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__WORKFLOWRUN_SELECTED: 'EVENT__WORKFLOWRUN_SELECTED',         // Called on WorkflowRun selection. Takes {workflowrun: WorkflowRun}.
    EVENT__WORKFLOWRUNS_SELECTED: 'EVENT__WORKFLOWRUNS_SELECTED',       // Called on workflow runs selection. No pass.
    REQUEST__WORKFLOWRUNS_SYNC: 'REQUEST__WORKFLOWRUNS_SYNC',           // Updates the WorkflowRuns collection without resetting.

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowRunCreator
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__WORKFLOWRUNCREATOR_CREATE_WORKFLOWRUN: 'REQUEST__WORKFLOWRUNCREATOR_CREATE_WORKFLOWRUN', // Called when workflow run requested. Passes object containing various data for WorkflowRun (name, description, etc).
    REQUEST__WORKFLOWRUNCREATOR_ADD_RESOURCEASSIGNMENT: 'REQUEST__WORKFLOWRUNCREATOR_ADD_RESOURCEASSIGNMENT', // Called when resource assignment add requested. Passes {inputport: InputPort, resource: Resource}.
    REQUEST__WORKFLOWRUNCREATOR_REMOVE_RESOURCEASSIGNMENT: 'REQUEST__WORKFLOWRUNCREATOR_REMOVE_RESOURCEASSIGNMENT', // Called when resource assignment remove requested. Passes {inputport: InputPort, resource: Resource}.
    EVENT__WORKFLOWRUNCREATOR_SELECTED: 'EVENT__WORKFLOWRUNCREATOR_SELECTED', // Called on workflowrun creator opening. Passes {workflow: Workflow}.
    EVENT__WORKFLOWRUNCREATOR_INPUTPORT_SELECTED: 'EVENT__WORKFLOWRUNCREATOR_INPUTPORT_SELECTED', // Called when an InputPort has been selected. Passes {inputport: InputPort}.
    REQUEST__WORKFLOWRUNCREATOR_IS_RESOURCEASSIGNMENT: 'REQUEST__WORKFLOWRUNCREATOR_IS_RESOURCEASSIGNMENT' // Returns true iff RA exists for provided inputport and resource.
};

export default Events;