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
// Connection
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__LOAD_CONNECTIONS: 'REQUEST__LOAD_CONNECTIONS',             // Instructs loading of connections. Takes object containing various query IDs.
    REQUEST__COLLECTION_CONNECTION: 'REQUEST__COLLECTION_CONNECTION',

///////////////////////////////////////////////////////////////////////////////////////
// InputPort
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__COLLECTION_INPUTPORT: 'REQUEST__COLLECTION_INPUTPORT',
    REQUEST__LOAD_INPUTPORTS: 'REQUEST__LOAD_INPUTPORTS',           // Instructs loading of inputports. Takes object containing various query IDs.

///////////////////////////////////////////////////////////////////////////////////////
// InputPortType
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__COLLECTION_INPUTPORTTYPE: 'REQUEST__COLLECTION_INPUTPORTTYPE',
    REQUEST__LOAD_INPUTPORTTYPES: 'REQUEST__LOAD_INPUTPORTTYPES',           // Instructs loading of inputporttypes. Takes object containing various query IDs.

///////////////////////////////////////////////////////////////////////////////////////
// Job
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__JOB_SELECTED: 'EVENT__JOB_SELECTED', // Called on Job selection.
    REQUEST__LOAD_JOBS: 'REQUEST__LOAD_JOBS',   // Instructs loading of jobs. Takes object containing various query IDs.
    REQUEST__COLLECTION_JOB: 'REQUEST__COLLECTION_JOB',

///////////////////////////////////////////////////////////////////////////////////////
// Model
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__MODEL_HASCHANGED: 'EVENT__MODEL_HASCHANGED', // Called when a model has changed (bound to 'hasChanged' in Backbone). Takes {model: BaseModel};

///////////////////////////////////////////////////////////////////////////////////////
// Navigation/UI
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__NAVIGATION_NODE_SELECTED: 'EVENT__NAVIGATION_NODE_SELECTED', // Informs of node selection. Takes {node: ViewNavigationNode}.
    REQUEST__NAVIGATION_LAYOUTVIEW_SHOW: 'REQUEST__NAVIGATION_LAYOUTVIEW_SHOW',

///////////////////////////////////////////////////////////////////////////////////////
// OutputPort
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__COLLECTION_OUTPUTPORT: 'REQUEST__COLLECTION_OUTPUTPORT',
    REQUEST__LOAD_OUTPUTPORTS: 'REQUEST__LOAD_OUTPUTPORTS',             // Instructs loading of outputporttypes. Takes object containing various query IDs.

///////////////////////////////////////////////////////////////////////////////////////
// OutputPortType
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__LOAD_OUTPUTPORTTYPES: 'REQUEST__LOAD_OUTPUTPORTTYPES',             // Instructs loading of outputporttypes. Takes object containing various query IDs.
    REQUEST__COLLECTION_OUTPUTPORTTYPE: 'REQUEST__COLLECTION_OUTPUTPORTTYPE',

///////////////////////////////////////////////////////////////////////////////////////
// Project
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__PROJECT_ADD: 'REQUEST__PROJECT_ADD',               // Called when Project needs to be added. Takes {creator: User}.
    REQUEST__PROJECT_DELETE: 'REQUEST__PROJECT_DELETE',         // Called when Project needs to be deleted. Passes {project: Project}.
    REQUEST__PROJECT_SAVE: 'REQUEST__PROJECT_SAVE',             // Called when Project needs to be saved. Takes {project: Project, fields: {object with attributes to change}}.
    REQUEST__PROJECT_SET_ACTIVE: 'REQUEST__PROJECT_SET_ACTIVE', // Sets the active Project. Takes {project: Project}.
    REQUEST__PROJECT_COLLECTION: 'REQUEST__PROJECT_COLLECTION', // Returns current ProjectCollection from ProjectController. May be null;
    REQUEST__PROJECT_ACTIVE: 'REQUEST__PROJECT_ACTIVE',         // Returns currently active Project.
    REQUEST__PROJECTS_SYNC: 'REQUEST__PROJECTS_SYNC',           // Updates the Projects collection without resetting.
    EVENT__PROJECTS_SELECTED: 'EVENT__PROJECTS_SELECTED',       // Called on project selection.
    EVENT__PROJECT_SELECTED: 'EVENT__PROJECT_SELECTED',         // Called on project selection. Takes {project: Project}.

///////////////////////////////////////////////////////////////////////////////////////
// Resource
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__RESOURCE_ADD: 'REQUEST__RESOURCE_ADD',                         // Called when Resource needs to be added. Takes {project: Project, file: JavaScript File object}.
    REQUEST__RESOURCE_DELETE: 'REQUEST__RESOURCE_DELETE',                   // Called when Resource needs to be deleted. Passes {resource: Resource}.
    REQUEST__RESOURCES_LOAD: 'REQUEST__RESOURCES_LOAD',                     // Instructs loading of Resources. Takes object containing various query IDs.
    REQUEST__RESOURCE_SAVE: 'REQUEST__RESOURCE_SAVE',                       // Called when Resource needs to be saved. Takes {resource: Resource, fields: {object with attributes to change}}.
    REQUEST__RESOURCE_COLLECTION: 'REQUEST__RESOURCE_COLLECTION',           // Returns global Resource collection.
    REQUEST__RESOURCE_SHOWLAYOUTVIEW: 'REQUEST__RESOURCE_SHOWLAYOUTVIEW',   // Called when a LayoutView wishes to be used for showing Resources (outside of the primary Resources view). This tells the ResourceController which LayoutView to reference upon events. Takes {layoutView: LayoutView}.
    REQUEST__RESOURCES_SYNC: 'REQUEST__RESOURCES_SYNC',                     // Updates the Resources collection without resetting.
    EVENT__RESOURCE_SELECTED: 'EVENT__RESOURCE_SELECTED',                   // Called on resource selection. Takes {resource: Resource}.
    EVENT__RESOURCES_SELECTED: 'EVENT__RESOURCES_SELECTED',                 // Called on resources selection. Takes (project: Project}.

///////////////////////////////////////////////////////////////////////////////////////
// ResourceType
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__RESOURCETYPES_LOAD: 'REQUEST__RESOURCETYPES_LOAD',             // Instructs loading of ResourceTypes. Takes object containing various query IDs.
    REQUEST__RESOURCETYPE_COLLECTION: 'REQUEST__RESOURCETYPE_COLLECTION',   // Returns global ResourceType collection.

///////////////////////////////////////////////////////////////////////////////////////
// RunJob
///////////////////////////////////////////////////////////////////////////////////////
    EVENT__RUNJOB_SELECTED: 'EVENT__RUNJOB_SELECTED',                   // Called on RunJob selection. Takes {runjob: RunJob}.
    EVENT__RUNJOBS_SELECTED: 'EVENT__RUNJOBS_SELECTED',                 // Called on RunJob selection. Takes (project: Project}.
    REQUEST__RUNJOB_COLLECTION: 'REQUEST__RUNJOB_COLLECTION',           // Returns global RunJob collection.
    REQUEST__RUNJOB_SHOWLAYOUTVIEW: 'REQUEST__RUNJOB_SHOWLAYOUTVIEW',   // Called when a LayoutView wishes to be used for showing RunJobs (outside of the primary RunJobs view). This tells the RunJobController which LayoutView to reference upon events. Takes {layoutView: LayoutView}.
    REQUEST__LOAD_RUNJOBS: 'REQUEST__LOAD_RUNJOBS', // Instructs loading of run jobs. Takes object containing various query IDs.

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
    REQUEST__COLLECTION_WORKFLOW: 'REQUEST__COLLECTION_WORKFLOW',
    EVENT__WORKFLOWS_SELECTED: 'EVENT__WORKFLOWS_SELECTED',                 // Called on Workflows selection.
    REQUEST__LOAD_WORKFLOWS: 'REQUEST__LOAD_WORKFLOWS',                     // Instructs loading of workflows. Takes object containing various query IDs.
    REQUEST_WORKFLOW_IMPORT: 'REQUEST_WORKFLOW_IMPORT',                     // Imports Workflow into another. Takes {target: Workflow, origin: Workflow}. 'origin' is imported into 'target'.

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowBuilder
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT: 'REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT',           // Called when InputPort needs to be added to WorkflowJob. Takes {inputportype: InputPortType, workflowjob: WorkflowJob (may be null, in which case currently selected WorkflowJob will be used)}.
    REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT: 'REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT',         // Called when OutputPort needs to be added to WorkflowJob. Takes {outputporttype: OutputPortType, workflowjob: WorkflowJob (may be null, in which case currently selected WorkflowJob will be used)}.
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

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowJob
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__WORKFLOWJOB_CREATE: 'REQUEST__WORKFLOWJOB_CREATE', // Called when WorkflowJob needs to be created. Takes {job: Job, workflow: Workflow}.
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
    REQUEST__LOAD_WORKFLOWRUNS: 'REQUEST__LOAD_WORKFLOWRUNS',           // Instructs loading of workflow runs. Takes object containing various query IDs.
    EVENT__WORKFLOWRUN_SELECTED: 'EVENT__WORKFLOWRUN_SELECTED',         // Called on workflow run selection. Passes {project: WorkflowRun}.
    EVENT__WORKFLOWRUNS_SELECTED: 'EVENT__WORKFLOWRUNS_SELECTED',       // Called on workflow runs selection. No pass.
    REQUEST__COLLECTION_WORKFLOWRUN: 'REQUEST__COLLECTION_WORKFLOWRUN', 
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