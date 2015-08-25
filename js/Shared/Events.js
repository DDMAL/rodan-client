/**
 * Backbone.Radio events use in the client.
 */
var Events = 
{
///////////////////////////////////////////////////////////////////////////////////////
// Authentication
///////////////////////////////////////////////////////////////////////////////////////
    COMMAND__AUTHENTICATION_LOGIN: 'COMMAND__AUTHENTICATION_LOGIN',
    COMMAND__AUTHENTICATION_LOGOUT: 'COMMAND__AUTHENTICATION_LOGOUT',
    COMMAND__AUTHENTICATION_CHECK: 'COMMAND__AUTHENTICATION_CHECK',
    EVENT__AUTHENTICATION_ERROR_400: 'EVENT__AUTHENTICATION_ERROR_400',
    EVENT__AUTHENTICATION_ERROR_401: 'EVENT__AUTHENTICATION_ERROR_401',
    EVENT__AUTHENTICATION_ERROR_403: 'EVENT__AUTHENTICATION_ERROR_403',
    EVENT__AUTHENTICATION_ERROR_NULL: 'EVENT__AUTHENTICATION_ERROR_NULL',
    EVENT__AUTHENTICATION_ERROR_UNKNOWN: 'EVENT__AUTHENTICATION_ERROR_UNKNOWN',
    EVENT__AUTHENTICATION_LOGINREQUIRED: 'EVENT__AUTHENTICATION_LOGINREQUIRED', // Called to inform listeners that the user has to login.
    EVENT__AUTHENTICATION_SUCCESS: 'EVENT__AUTHENTICATION_SUCCESS',             // Called on success of authentication check. Takes {user: User}.
    EVENT__DEAUTHENTICATION_SUCCESS: 'EVENT__DEAUTHENTICATION_SUCCESS',         // Called on success of deauthentication.

///////////////////////////////////////////////////////////////////////////////////////
// Project
///////////////////////////////////////////////////////////////////////////////////////
    COMMAND__PROJECT_ADD: 'COMMAND__PROJECT_ADD',               // Called when Project needs to be added. Takes {creator: User}.
    COMMAND__PROJECT_DELETE: 'COMMAND__PROJECT_DELETE',         // Called when Project needs to be deleted. Passes {project: Project}.
    COMMAND__PROJECTS_LOAD: 'COMMAND__PROJECTS_LOAD',           // Instructs loading of Projects. Takes object containing various query IDs.
    COMMAND__PROJECT_SAVE: 'COMMAND__PROJECT_SAVE',             // Called when Project needs to be saved. Takes {project: Project, fields: {object with attributes to change}}.
    COMMAND__PROJECT_SET_ACTIVE: 'COMMAND__PROJECT_SET_ACTIVE', // Sets the active Project. Takes {project: Project}.
    EVENT__PROJECTS_SELECTED: 'EVENT__PROJECTS_SELECTED',       // Called on project selection.
    EVENT__PROJECT_SELECTED: 'EVENT__PROJECT_SELECTED',         // Called on project selection. Takes {project: Project}.
    REQUEST__PROJECT_COLLECTION: 'REQUEST__PROJECT_COLLECTION', // Returns global Project collection.
    REQUEST__PROJECT_ACTIVE: 'REQUEST__PROJECT_ACTIVE',         // Returns currently active Project.

///////////////////////////////////////////////////////////////////////////////////////
// Resource
///////////////////////////////////////////////////////////////////////////////////////
    COMMAND__RESOURCE_ADD: 'COMMAND__RESOURCE_ADD',                 // Called when Resource needs to be added. Takes {project: Project, file: JavaScript File object}.
    COMMAND__RESOURCE_DELETE: 'COMMAND__RESOURCE_DELETE',           // Called when Resource needs to be deleted. Passes {resource: Resource}.
    COMMAND__RESOURCES_LOAD: 'COMMAND__RESOURCES_LOAD',             // Instructs loading of Resources. Takes object containing various query IDs.
    COMMAND__RESOURCE_SAVE: 'COMMAND__RESOURCE_SAVE',               // Called when Resource needs to be saved. Takes {resource: Resource, fields: {object with attributes to change}}.
    EVENT__RESOURCE_SELECTED: 'EVENT__RESOURCE_SELECTED',           // Called on resource selection. Takes {resource: Resource}.
    EVENT__RESOURCES_SELECTED: 'EVENT__RESOURCES_SELECTED',         // Called on resources selection. Takes (project: Project}.
    REQUEST__RESOURCE_COLLECTION: 'REQUEST__RESOURCE_COLLECTION',   // Returns global Resource collection.

///////////////////////////////////////////////////////////////////////////////////////
// ResourceType
///////////////////////////////////////////////////////////////////////////////////////
    COMMAND__RESOURCETYPES_LOAD: 'COMMAND__RESOURCETYPES_LOAD',             // Instructs loading of ResourceTypes. Takes object containing various query IDs.
    REQUEST__RESOURCETYPE_COLLECTION: 'REQUEST__RESOURCETYPE_COLLECTION',   // Returns global ResourceType collection.

///////////////////////////////////////////////////////////////////////////////////////
// System
///////////////////////////////////////////////////////////////////////////////////////
    COMMAND__DISPLAY_MESSAGE: 'COMMAND__DISPLAY_MESSAGE',   // Sends messages to the status bar. Takes {text: string}.
    COMMAND__HANDLER_ERROR: 'COMMAND__HANDLER_ERROR',       // Sends error to error handler. Takes {model: BaseModel, response: HTTP response, option: associated options}.

///////////////////////////////////////////////////////////////////////////////////////
// Workflow
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowJob
///////////////////////////////////////////////////////////////////////////////////////
    COMMAND__WORKFLOWJOB_ADD: 'COMMAND__WORKFLOWJOB_ADD',                           // Called when WorkflowJob needs to be created. Takes {job: Job}.
    COMMAND__WORKFLOWJOB_DELETE: 'COMMAND__WORKFLOWJOB_DELETE',                     // Called when WorkflowJob needs to be deleted. Takes {workflowjob: WorkflowJob}.
    COMMAND__WORKFLOWJOB_SAVE: 'COMMAND__WORKFLOWJOB_SAVE',                         // Called when WorkflowJob needs to be saved. Takes object with attributes to change.
    COMMAND__WORKFLOWJOB_SAVE_COORDINATES: 'COMMAND__WORKFLOWJOB_SAVE_COORDINATES', // Called when coordinates need to be saved for a WorkflowJob. Takes {workflowjob: WorkflowJob, x: float (position relative to canvas width), y: float (position relative to canvas height)}. 
    EVENT__WORKFLOWJOB_SELECTED: 'EVENT__WORKFLOWJOB_SELECTED',                     // Called when WorkflowJob selected for editing. Takes {workflowjob: WorkflowJob}.

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowJobCoordinateSet
///////////////////////////////////////////////////////////////////////////////////////
    COMMAND__WORKFLOWJOBCOORDINATESETS_LOAD:        'COMMAND__WORKFLOWJOBCOORDINATESETS_LOAD',      // Instructs loading of WorkflowJobCoordinateSets. Takes object containing various query IDs.
    REQUEST__WORKFLOWJOBCOORDINATESET_COLLECTION:   'REQUEST__WORKFLOWJOBCOORDINATESET_COLLECTION', // Returns global WorkflowJobCoordinateSet collection.

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowJobGroup
///////////////////////////////////////////////////////////////////////////////////////
    COMMAND__WORKFLOWJOBGROUP_ADD: 'COMMAND__WORKFLOWJOBGROUP_ADD',                 // Called when WorkflowJobGroup needs to be added. Takes {workflowjobgroup: WorkflowJobGroup}.
    COMMAND__WORKFLOWJOBGROUP_DELETE: 'COMMAND__WORKFLOWJOBGROUP_DELETE',           // Called when WorkflowJobGroup needs to be deleted. Takes {workflowjobgroup: WorkflowJobGroup}.
    COMMAND__WORKFLOWJOBGROUP_SAVE: 'COMMAND__WORKFLOWJOBGROUP_SAVE',               // Called when WorkflowJobGroup needs to be saved. Takes object with attributes to change.
    REQUEST__WORKFLOWJOBGROUP_COLLECTION: 'REQUEST__WORKFLOWJOBGROUP_COLLECTION',   // Returns WorkflowJobGroup Collection.  Takes (project: Project}.

///////////////////////////////////////////////////////////////////////////////////////
// COMMANDS
///////////////////////////////////////////////////////////////////////////////////////
    COMMAND__GET_ROUTES: 'COMMAND__GET_ROUTES',

    COMMAND__LOAD_INPUTPORTS: 'COMMAND__LOAD_INPUTPORTS',  // Instructs loading of inputports. Takes object containing various query IDs.
    COMMAND__LOAD_INPUTPORTTYPES: 'COMMAND__LOAD_INPUTPORTTYPES',  // Instructs loading of inputporttypes. Takes object containing various query IDs.
    COMMAND__LOAD_JOBS: 'COMMAND__LOAD_JOBS', // Instructs loading of jobs. Takes object containing various query IDs.
    COMMAND__LOAD_OUTPUTPORTTYPES: 'COMMAND__LOAD_OUTPUTPORTTYPES', // Instructs loading of outputporttypes. Takes object containing various query IDs.
    COMMAND__LOAD_RUNJOBS: 'COMMAND__LOAD_RUNJOBS', // Instructs loading of run jobs. Takes object containing various query IDs.
    COMMAND__LOAD_WORKFLOWRUNS: 'COMMAND__LOAD_WORKFLOWRUNS', // Instructs loading of workflow runs. Takes object containing various query IDs.
    COMMAND__LOAD_WORKFLOWS: 'COMMAND__LOAD_WORKFLOWS', // Instructs loading of workflows. Takes object containing various query IDs.
    COMMAND__LOAD_CONNECTIONS: 'COMMAND__LOAD_CONNECTIONS', // Instructs loading of connections. Takes object containing various query IDs.


    COMMAND__LAYOUTVIEW_SHOW: 'COMMAND__LAYOUTVIEW_SHOW',

    COMMAND__WORKFLOW_DELETE: 'COMMAND__WORKFLOW_DELETE', // Called when Workflow needs to be deleted. Passes {workflow: Workflow}.

    // Workflow builder commands. These are sent to the workflow builder controller. They will (most often) trigger a command to the workspace.
    COMMAND__WORKFLOWBUILDER_ADD_INPUTPORT: 'COMMAND__WORKFLOWBUILDER_ADD_INPUTPORT',   // Called when input port needs to be added to workflow job. Passes {inputportype: InputPortType}.
    COMMAND__WORKFLOWBUILDER_ADD_OUTPUTPORT: 'COMMAND__WORKFLOWBUILDER_ADD_OUTPUTPORT',   // Called when output port needs to be added to workflow job. Passes {outputporttype: OutputPortType}.
    COMMAND__WORKFLOWBUILDER_DELETE_INPUTPORT: 'COMMAND__WORKFLOWBUILDER_DELETE_INPUTPORT',   // Called when input port needs to be deleted from workflow job. Passes {inputport: InputPort}.
    COMMAND__WORKFLOWBUILDER_DELETE_OUTPUTPORT: 'COMMAND__WORKFLOWBUILDER_DELETE_OUTPUTPORT',   // Called when output port needs to be deleted from workflow job. Passes {outputport: OutputPort}.
    COMMAND__WORKFLOWBUILDER_ADD_CONNECTION: 'COMMAND__WORKFLOWBUILDER_ADD_CONNECTION',   // Called when Connection should be created. Passes {inputport: InputPort, outputport: OutputPort}.
    COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOW: 'COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOW',  // Called when Workflow needs to be saved. Passes object with attributes to change.
    COMMAND__WORKFLOWBUILDER_VALIDATE_WORKFLOW: 'COMMAND__WORKFLOWBUILDER_VALIDATE_WORKFLOW',  // Called when Workflow needs to be saved. No pass.
    COMMAND__WORKFLOWBUILDER_RUN_WORKFLOW: 'COMMAND__WORKFLOWBUILDER_RUN_WORKFLOW', // Called when Workflow needs to be run. No pass.

    // Workflow builder commands that control the view.
    COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_JOBS: 'COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_JOBS',                           // Called when WorkflowJobGroup control view needs to be shown.
    COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_WORKFLOWJOBGROUPS: 'COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_WORKFLOWJOBGROUPS', // Called when WorkflowJobGroup control view needs to be shown.

    // Workflow builder GUI commands. These events tell the workspace what needs to be done. The GUI sends these commands.
    COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOW: 'COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOW', // Called when Workflow needs to be added to workspace. Passes {workflow: Workflow}.
    COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB: 'COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB', // Called when WorkflowJob needs to be added to workspace. Passes {workflowJob: WorkflowJob}.
    COMMAND__WORKFLOWBUILDER_GUI_UPDATE_ITEM_WORKFLOWJOB: 'COMMAND__WORKFLOWBUILDER_GUI_UPDATE_ITEM_WORKFLOWJOB', // Called when WorkflowJob needs to be updated. Passes {workflowJob: WorkflowJob}.
    COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION: 'COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION', // Called when connection needs to be added to workflow. Passed {connection: Connection, inputport: InputPort, outputport: OutputPort}.
    COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT: 'COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT', // Called when input port needs to be added to workflow job. Passes {workflowjob: WorkflowJob, inputport: InputPort}.
    COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT: 'COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT', // Called when output port needs to be added to workflow job. Passes {workflowjob: WorkflowJob, outputport: OutputPort}.
    COMMAND__WORKFLOWBUILDER_GUI_DELETE_ITEM_INPUTPORT: 'COMMAND__WORKFLOWBUILDER_GUI_DELETE_ITEM_INPUTPORT', // Called when input port needs to be deleted from workflow job. Passes {workflowjob: WorkflowJob, inputport: InputPort}.
    COMMAND__WORKFLOWBUILDER_GUI_DELETE_ITEM_OUTPUTPORT: 'COMMAND__WORKFLOWBUILDER_GUI_DELETE_ITEM_OUTPUTPORT', // Called when output port needs to be deleted from workflow job. Passes {workflowjob: WorkflowJob, outputport: OutputPort}.
    COMMAND__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOB: 'COMMAND__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOB', // Called when WorkflowJob item needs to be deleted. Takes {workflowjob: WorkflowJob}.
    COMMAND__WORKFLOWBUILDER_GUI_ZOOM_IN: 'COMMAND__WORKFLOWBUILDER_GUI_ZOOM_IN', // Called when request workspace zoom in. No pass.
    COMMAND__WORKFLOWBUILDER_GUI_ZOOM_OUT: 'COMMAND__WORKFLOWBUILDER_GUI_ZOOM_OUT', // Called when request workspace zoom out. No pass.
    COMMAND__WORKFLOWBUILDER_GUI_ZOOM_RESET: 'COMMAND__WORKFLOWBUILDER_GUI_ZOOM_RESET', // Called when request workspace zoom reset. No pass.

    // WorkflowRun creator commands.
    COMMAND__WORKFLOWRUNCREATOR_CREATE_WORKFLOWRUN: 'COMMAND__WORKFLOWRUNCREATOR_CREATE_WORKFLOWRUN', // Called when workflow run requested. Passes object containing various data for WorkflowRun (name, description, etc).
    COMMAND__WORKFLOWRUNCREATOR_ADD_RESOURCEASSIGNMENT: 'COMMAND__WORKFLOWRUNCREATOR_ADD_RESOURCEASSIGNMENT', // Called when resource assignment add requested. Passes {inputport: InputPort, resource: Resource}.
    COMMAND__WORKFLOWRUNCREATOR_REMOVE_RESOURCEASSIGNMENT: 'COMMAND__WORKFLOWRUNCREATOR_REMOVE_RESOURCEASSIGNMENT', // Called when resource assignment remove requested. Passes {inputport: InputPort, resource: Resource}.

///////////////////////////////////////////////////////////////////////////////////////
// EVENTS
///////////////////////////////////////////////////////////////////////////////////////

    // Authentication events.
    EVENT__APPLICATION_READY: 'EVENT__APPLICATION_READY',   // Called when app is ready. No pass.

    // Connection events.
    EVENT__ROUTESLOADED: 'EVENT__ROUTESLOADED', // Called when routes loaded. No pass.

    // Connection events.
    EVENT__SERVER_WENT_AWAY: 'EVENT__SERVER_WENT_AWAY', // Called on server disconnect. No pass.

    // Model/collection selected events.
    EVENT__JOB_SELECTED: 'EVENT__JOB_SELECTED', // Called on job selection. No pass.
    EVENT__WORKFLOW_SELECTED: 'EVENT__WORKFLOW_SELECTED', // Called on workflow selection. Passes {workflow: Workflow}.
    EVENT__WORKFLOWS_SELECTED: 'EVENT__WORKFLOWS_SELECTED', // Called on workflows selection. No pass.
    EVENT__WORKFLOWRUN_SELECTED: 'EVENT__WORKFLOWRUN_SELECTED', // Called on workflow run selection. Passes {project: WorkflowRun}.
    EVENT__WORKFLOWRUNS_SELECTED: 'EVENT__WORKFLOWRUNS_SELECTED', // Called on workflow runs selection. No pass.

    // General model events.
    EVENT__MODEL_HASCHANGED: 'EVENT__MODEL_HASCHANGED', // Called when a model has changed (bound to 'hasChanged' in Backbone). Passes {model: BaseModel};

    // Navigation events.
    EVENT_NAVIGATION_NODE_SELECTED: 'EVENT_NAVIGATION_NODE_SELECTED', // Informs of node selection. Takes {node: ViewNavigationNode}.

    // WORKFLOWBUILDER events.
    EVENT__WORKFLOWBUILDER_SELECTED: 'EVENT__WORKFLOWBUILDER_SELECTED', // Called on workflow builder opening. Passes {workflow: Workflow}. May be null if new workflow needed.

    // WorkflowRun Creator events.
    EVENT__WORKFLOWRUNCREATOR_SELECTED: 'EVENT__WORKFLOWRUNCREATOR_SELECTED', // Called on workflowrun creator opening. Passes {workflow: Workflow}.
    EVENT__WORKFLOWRUNCREATOR_INPUTPORT_SELECTED: 'EVENT__WORKFLOWRUNCREATOR_INPUTPORT_SELECTED', // Called when an InputPort has been selected. Passes {inputport: InputPort}.

///////////////////////////////////////////////////////////////////////////////////////
// REQUESTS
///////////////////////////////////////////////////////////////////////////////////////

    // Collection request.
    REQUEST__COLLECTION_INPUTPORT: 'REQUEST__COLLECTION_INPUTPORT',
    REQUEST__COLLECTION_INPUTPORTTYPE: 'REQUEST__COLLECTION_INPUTPORTTYPE',
    REQUEST__COLLECTION_JOB: 'REQUEST__COLLECTION_JOB',
    REQUEST__COLLECTION_OUTPUTPORTTYPE: 'REQUEST__COLLECTION_OUTPUTPORTTYPE',
    REQUEST__COLLECTION_RUNJOB: 'REQUEST__COLLECTION_RUNJOB',
    REQUEST__COLLECTION_WORKFLOW: 'REQUEST__COLLECTION_WORKFLOW',
    REQUEST__COLLECTION_WORKFLOWRUN: 'REQUEST__COLLECTION_WORKFLOWRUN',
    REQUEST__COLLECTION_CONNECTION: 'REQUEST__COLLECTION_CONNECTION',

    REQUEST__SERVER_ROUTE: 'REQUEST__SERVER_ROUTE', // Returns server route. Pass associated string.
    REQUEST__SERVER_HOSTNAME: 'REQUEST__SERVER_HOSTNAME', // Returns server hostname. No pass.
    REQUEST__SERVER_VERSION_RODAN: 'REQUEST__SERVER_VERSION_RODAN', // Returns server version (Rodan). No pass.

    REQUEST__WORKFLOW_NEW: 'REQUEST__WORKFLOW_NEW', // Returns new workflow not yet saved to server.

    REQUEST__USER: 'REQUEST__USER',

    // WorkflowRun Creator requests.
    REQUEST__WORKFLOWRUNCREATOR_IS_RESOURCEASSIGNMENT: 'REQUEST__WORKFLOWRUNCREATOR_IS_RESOURCEASSIGNMENT' // Returns true iff RA exists for provided inputport and resource.
};

export default Events;