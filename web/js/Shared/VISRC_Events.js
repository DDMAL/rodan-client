var VISRC_Events = {

///////////////////////////////////////////////////////////////////////////////////////
// COMMANDS
///////////////////////////////////////////////////////////////////////////////////////
    COMMAND__GET_ROUTES: 'COMMAND__GET_ROUTES',

    COMMAND__LOAD_INPUTPORTTYPES: 'COMMAND__LOAD_INPUTPORTTYPES',  // Instructs loading of inputporttypes. Takes object containing various query IDs.
    COMMAND__LOAD_JOBS: 'COMMAND__LOAD_JOBS', // Instructs loading of jobs. Takes object containing various query IDs.
    COMMAND__LOAD_OUTPUTPORTTYPES: 'COMMAND__LOAD_OUTPUTPORTTYPES', // Instructs loading of outputporttypes. Takes object containing various query IDs.
    COMMAND__LOAD_PROJECTS: 'COMMAND__LOAD_PROJECTS', // Instructs loading of projects. Takes object containing various query IDs.
    COMMAND__LOAD_RESOURCES: 'COMMAND__LOAD_RESOURCES', // Instructs loading of resources. Takes object containing various query IDs.
    COMMAND__LOAD_RESOURCETYPES: 'COMMAND__LOAD_RESOURCETYPES', // Instructs loading of resource types. Takes object containing various query IDs.
    COMMAND__LOAD_RUNJOBS: 'COMMAND__LOAD_RUNJOBS', // Instructs loading of run jobs. Takes object containing various query IDs.
    COMMAND__LOAD_WORKFLOWRUNS: 'COMMAND__LOAD_WORKFLOWRUNS', // Instructs loading of workflow runs. Takes object containing various query IDs.
    COMMAND__LOAD_WORKFLOWS: 'COMMAND__LOAD_WORKFLOWS', // Instructs loading of workflows. Takes object containing various query IDs.

    COMMAND__NEW_PROJECT: 'COMMAND__NEW_PROJECT', // Requests new project. Takes nothing.

    COMMAND__AUTHENTICATION_LOGIN: 'COMMAND__AUTHENTICATION_LOGIN',
    COMMAND__LAYOUTVIEW_SHOW: 'COMMAND__LAYOUTVIEW_SHOW',

    // Workflow builder commands. These are sent to the workflow builder controller. They will (most often) trigger a command to the workspace.
    COMMAND__WORKFLOWBUILDER_ADD_WORKFLOW: 'COMMAND__WORKFLOWBUILDER_ADD_WORKFLOW',  // Called when Workflow needs to be created. No pass.
    COMMAND__WORKFLOWBUILDER_ADD_WORKFLOWJOB: 'COMMAND__WORKFLOWBUILDER_ADD_WORKFLOWJOB',   // Called when Workflow needs to be created. Passes {job: VISRC_Job}.
    COMMAND__WORKFLOWBUILDER_ADD_INPUTPORT: 'COMMAND__WORKFLOWBUILDER_ADD_INPUTPORT',   // Called when input port needs to be added to workflow job. Passes {inputportype: VISRC_InputPortType}.
    COMMAND__WORKFLOWBUILDER_ADD_OUTPUTPORT: 'COMMAND__WORKFLOWBUILDER_ADD_OUTPUTPORT',   // Called when output port needs to be added to workflow job. Passes {outputporttype: VISRC_OutputPortType}.
    COMMAND__WORKFLOWBUILDER_DELETE_INPUTPORT: 'COMMAND__WORKFLOWBUILDER_DELETE_INPUTPORT',   // Called when input port needs to be deleted from workflow job. Passes {inputport: VISRC_InputPort}.
    COMMAND__WORKFLOWBUILDER_DELETE_OUTPUTPORT: 'COMMAND__WORKFLOWBUILDER_DELETE_OUTPUTPORT',   // Called when output port needs to be deleted from workflow job. Passes {outputport: VISRC_OutputPort}.
    COMMAND__WORKFLOWBUILDER_ADD_CONNECTION: 'COMMAND__WORKFLOWBUILDER_ADD_CONNECTION',   // Called when Connection should be created. Passes {inputport: VISRC_InputPort, outputport: VISRC_OutputPort}.
    COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOW: 'COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOW',  // Called when Workflow needs to be saved. Passes object with attributes to change.
    COMMAND__WORKFLOWBUILDER_VALIDATE_WORKFLOW: 'COMMAND__WORKFLOWBUILDER_VALIDATE_WORKFLOW',  // Called when Workflow needs to be saved. No pass.
    COMMAND__WORKFLOWBUILDER_RUN_WORKFLOW: 'COMMAND__WORKFLOWBUILDER_RUN_WORKFLOW', // Called when Workflow needs to be run. No pass.
    COMMAND__WORKFLOWBUILDER_ADD_RESOURCEASSIGNMENT: 'COMMAND__WORKFLOWBUILDER_ADD_RESOURCEASSIGNMENT', // Called when resource assignment should be created. Passes {resource: VISRC_Resource, inputport: VISRC_InputPort}.

    // Workflow builder commands that control the view.
    COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_JOBS: 'COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_JOBS',   // Called when job control view needs to be shown. No pass.
    COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_RESOURCES: 'COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_RESOURCEASSIGNMENT',   // Called when resource assignment control view needs to be shown. No pass.
    COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_RESOURCE: 'COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_RESOURCE', // Called on resource selection. Passes {resource: VISRC_Resource}.

    // Workspace commands. These events tell the workspace what needs to be done. The WorkflowBuilder sends these commands.
    COMMAND__WORKSPACE_ADD_ITEM_WORKFLOW: 'COMMAND__WORKSPACE_ADD_ITEM_WORKFLOW', // Called when Workflow needs to be added to workspace. Passes {workflow: VISRC_Workflow}.
    COMMAND__WORKSPACE_ADD_ITEM_WORKFLOWJOB: 'COMMAND__WORKSPACE_ADD_ITEM_WORKFLOWJOB', // Called when WorkflowJob needs to be added to workspace. Passes {workflowJob: VISRC_WorkflowJob}.
    COMMAND__WORKSPACE_UPDATE_ITEM_WORKFLOWJOB: 'COMMAND__WORKSPACE_UPDATE_ITEM_WORKFLOWJOB', // Called when WorkflowJob needs to be updated. Passes {workflowJob: VISRC_WorkflowJob}.
    COMMAND__WORKSPACE_ADD_ITEM_CONNECTION: 'COMMAND__WORKSPACE_ADD_ITEM_CONNECTION', // Called when connection needs to be added to workflow. Passed {connection: VISRC_Connection, inputport: VISRC_InputPort, outputport: VISRC_OutputPort}.
    COMMAND__WORKSPACE_ADD_ITEM_INPUTPORT: 'COMMAND__WORKSPACE_ADD_ITEM_INPUTPORT', // Called when input port needs to be added to workflow job. Passes {workflowjob: VISRC_WorkflowJob, inputport: VISRC_InputPort}.
    COMMAND__WORKSPACE_ADD_ITEM_OUTPUTPORT: 'COMMAND__WORKSPACE_ADD_ITEM_OUTPUTPORT', // Called when output port needs to be added to workflow job. Passes {workflowjob: VISRC_WorkflowJob, outputport: VISRC_OutputPort}.
    COMMAND__WORKSPACE_DELETE_ITEM_INPUTPORT: 'COMMAND__WORKSPACE_DELETE_ITEM_INPUTPORT', // Called when input port needs to be deleted from workflow job. Passes {workflowjob: VISRC_WorkflowJob, inputport: VISRC_InputPort}.
    COMMAND__WORKSPACE_DELETE_ITEM_OUTPUTPORT: 'COMMAND__WORKSPACE_DELETE_ITEM_OUTPUTPORT', // Called when output port needs to be deleted from workflow job. Passes {workflowjob: VISRC_WorkflowJob, outputport: VISRC_OutputPort}.
    COMMAND__WORKSPACE_ADD_ITEM_RESOURCE: 'COMMAND__WORKSPACE_ADD_ITEM_RESOURCE', // Called when resource needs to be added to canvas (prior to running workflow). Passes {resource: VISRC__Resource}.
    COMMAND__WORKSPACE_ADD_ITEM_RESOURCEASSIGNMENT: 'COMMAND__WORKSPACE_ADD_ITEM_RESOURCEASSIGNMENT', // Called when resource needs to be added to canvas (prior to running workflow). Passes {resourceassignment: VISRC_ResourceAssignment, resource: VISRC_Resource, inputport: VISRC_InputPort}.
    COMMAND__WORKSPACE_ZOOM_IN: 'COMMAND__WORKSPACE_ZOOM_IN', // Called when request workspace zoom in. No pass.
    COMMAND__WORKSPACE_ZOOM_OUT: 'COMMAND__WORKSPACE_ZOOM_OUT', // Called when request workspace zoom out. No pass.
    COMMAND__WORKSPACE_ZOOM_RESET: 'COMMAND__WORKSPACE_ZOOM_RESET', // Called when request workspace zoom reset. No pass.


///////////////////////////////////////////////////////////////////////////////////////
// EVENTS
///////////////////////////////////////////////////////////////////////////////////////

    // Application events.
    EVENT__APPLICATION_READY: 'EVENT__APPLICATION_READY',   // Called when app is ready. No pass.

    // Authentication events.
    EVENT__AUTHENTICATION_ERROR_400: 'EVENT__AUTHENTICATION_ERROR_400', // Called on error 400. No pass.
    EVENT__AUTHENTICATION_ERROR_401: 'EVENT__AUTHENTICATION_ERROR_401', // Called on error 401. No pass.
    EVENT__AUTHENTICATION_ERROR_403: 'EVENT__AUTHENTICATION_ERROR_403', // Called on error 403. No pass.
    EVENT__AUTHENTICATION_ERROR_NULL: 'EVENT__AUTHENTICATION_ERROR_NULL', // Called on error null. No pass.
    EVENT__AUTHENTICATION_ERROR_UNKNOWN: 'EVENT__AUTHENTICATION_ERROR_UNKNOWN', // Called on error unknown. No pass.
    EVENT__AUTHENTICATION_SUCCESS: 'EVENT__SUCCESS_AUTHENTICATION', // Called on success of authentication check. Passes {user: VISRC_User}.

    // Connection events.
    EVENT__ROUTESLOADED: 'EVENT__ROUTESLOADED', // Called when routes loaded. No pass.

    // Connection events.
    EVENT__SERVER_WENT_AWAY: 'EVENT__SERVER_WENT_AWAY', // Called on server disconnect. No pass.

    // Model/collection selected events.
    EVENT__JOB_SELECTED: 'EVENT__JOB_SELECTED', // Called on job selection. No pass.
    EVENT__PROJECTS_SELECTED: 'EVENT__PROJECTS_SELECTED', // Called on project selection. No pass.
    EVENT__PROJECT_SELECTED: 'EVENT__PROJECT_SELECTED', // Called on project selection. Passes {project: VISRC_Project}.
    EVENT__RESOURCE_SELECTED: 'EVENT__RESOURCES_SELECTED', // Called on resource selection. Passes {resource: VISRC_Resource}.
    EVENT__RESOURCES_SELECTED: 'EVENT__RESOURCES_SELECTED', // Called on resources selection. No pass.
    EVENT__WORKFLOW_SELECTED: 'EVENT__WORKFLOW_SELECTED', // Called on workflow selection. Passes {workflow: VISRC_Workflow}.
    EVENT__WORKFLOWS_SELECTED: 'EVENT__WORKFLOWS_SELECTED', // Called on workflows selection. No pass.
    EVENT__WORKFLOWRUN_SELECTED: 'EVENT__WORKFLOWRUN_SELECTED', // Called on workflow run selection. Passes {project: VISRC_WorkflowRun}.

    // WorkflowBuilder events.
    EVENT__WORKFLOWBUILDER_SELECTED: 'EVENT__WORKFLOWBUILDER_SELECTED', // Called on workflow builder opening. Passes {workflow: VISRC_Workflow}. May be null if new workflow needed.
    EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED: 'EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED', // Called when WorkflowJob selected for editing. Passes {workflowjob: VISRC_WorkflowJob}.


///////////////////////////////////////////////////////////////////////////////////////
// REQUESTS
///////////////////////////////////////////////////////////////////////////////////////

    // Collection request.
    REQUEST__COLLECTION_INPUTPORTTYPE: 'REQUEST__COLLECTION_INPUTPORTTYPE',
    REQUEST__COLLECTION_JOB: 'REQUEST__COLLECTION_JOB',
    REQUEST__COLLECTION_OUTPUTPORTTYPE: 'REQUEST__COLLECTION_OUTPUTPORTTYPE',
    REQUEST__COLLECTION_PROJECT: 'REQUEST__COLLECTION_PROJECT',
    REQUEST__COLLECTION_RUNJOB: 'REQUEST__COLLECTION_RUNJOB',
    REQUEST__COLLECTION_RESOURCE: 'REQUEST__COLLECTION_RESOURCE',
    REQUEST__COLLECTION_RESOURCETYPE: 'REQUEST__COLLECTION_RESOURCETYPE',
    REQUEST__COLLECTION_WORKFLOW: 'REQUEST__COLLECTION_WORKFLOW',
    REQUEST__COLLECTION_WORKFLOWRUN: 'REQUEST__COLLECTION_WORKFLOWRUN',

    REQUEST__SERVER_ROUTE: 'REQUEST__SERVER_ROUTE', // Returns server route. Pass associated string.
    REQUEST__SERVER_HOSTNAME: 'REQUEST__SERVER_HOSTNAME', // Returns server hostname. No pass.
    REQUEST__SERVER_VERSION_RODAN: 'REQUEST__SERVER_VERSION_RODAN', // Returns server version (Rodan). No pass.

    REQUEST__WORKFLOW_NEW: 'REQUEST__WORKFLOW_NEW', // Returns new workflow not yet saved to server.
    REQUEST__WORKFLOWJOB_NEW: 'REQUEST__WORKFLOWJOB_NEW', // Returns new WorkflowJob not yet saved to server.

    REQUEST__APPLICATION: 'REQUEST_APPLICATION',
    REQUEST__USER: 'REQUEST__USER',
    REQUEST__PROJECT_ACTIVE: 'REQUEST__PROJECT_ACTIVE'
};

export default VISRC_Events;