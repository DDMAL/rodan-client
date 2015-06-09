var VISRC_Events = {

///////////////////////////////////////////////////////////////////////////////////////
// COMMANDS
///////////////////////////////////////////////////////////////////////////////////////
    COMMAND__GET_ROUTES: 'COMMAND__GET_ROUTES',


    COMMAND__LOAD_PROJECTS: 'COMMAND__LOAD_PROJECTS', // Instructs loading of projects. Takes object containing various query IDs.
    COMMAND__LOAD_SCORES: 'COMMAND__LOAD_SCORES', // Instructs loading of resources. Takes object containing various query IDs.
    COMMAND__LOAD_RUNJOBS: 'COMMAND__LOAD_RUNJOBS', // Instructs loading of run jobs. Takes object containing various query IDs.
    COMMAND__LOAD_WORKFLOWRUNS: 'COMMAND__LOAD_WORKFLOWRUNS', // Instructs loading of workflow runs. Takes object containing various query IDs.
    COMMAND__LOAD_WORKFLOWS: 'COMMAND__LOAD_WORKFLOWS', // Instructs loading of workflows. Takes object containing various query IDs.


    COMMAND__AUTHENTICATION_LOGIN: 'COMMAND__AUTHENTICATION_LOGIN',
    COMMAND__LAYOUTVIEW_SHOW: 'COMMAND__LAYOUTVIEW_SHOW',

///////////////////////////////////////////////////////////////////////////////////////
// EVENTS
///////////////////////////////////////////////////////////////////////////////////////

    // Application events.
    EVENT__APPLICATION_READY: 'EVENT__APPLICATION_READY',   // Called when app is ready. No return.

    // Authentication events.
    EVENT__AUTHENTICATION_ERROR_400: 'EVENT__AUTHENTICATION_ERROR_400', // Called on error 400. No return.
    EVENT__AUTHENTICATION_ERROR_401: 'EVENT__AUTHENTICATION_ERROR_401', // Called on error 401. No return.
    EVENT__AUTHENTICATION_ERROR_403: 'EVENT__AUTHENTICATION_ERROR_403', // Called on error 403. No return.
    EVENT__AUTHENTICATION_ERROR_NULL: 'EVENT__AUTHENTICATION_ERROR_NULL', // Called on error null. No return.
    EVENT__AUTHENTICATION_ERROR_UNKNOWN: 'EVENT__AUTHENTICATION_ERROR_UNKNOWN', // Called on error unknown. No return.
    EVENT__AUTHENTICATION_SUCCESS: 'EVENT__SUCCESS_AUTHENTICATION', // Called on success of authentication check. Returns {user: VISRC_User}.

    // Connection events.
    EVENT__ROUTESLOADED: 'EVENT__ROUTESLOADED', // Called when routes loaded. No return.

    // Connection events.
    EVENT__SERVER_WENT_AWAY: 'EVENT__SERVER_WENT_AWAY', // Called on server disconnect. No return.

    // Project events.
    EVENT__PROJECTS_SELECTED: 'EVENT__PROJECTS_SELECTED', // Called on project selection. No return.
    EVENT__PROJECT_SELECTED: 'EVENT__PROJECT_SELECTED', // Called on project selection. Returns {project: VISRC_Project}.

    // Scores events.
    EVENT__SCORES_SELECTED: 'EVENT__SCORES_SELECTED', // Called on project selection. No return.

    // Workflow events.
    EVENT__WORKFLOW_SELECTED: 'EVENT__WORKFLOW_SELECTED', // Called on workflow selection. Returns {workflow: VISRC_Workflow}.
    EVENT__WORKFLOWS_SELECTED: 'EVENT__WORKFLOWS_SELECTED', // Called on workflows selection. No return.

    // WorkflowRun events,
    EVENT__WORKFLOWRUN_SELECTED: 'EVENT__WORKFLOWRUN_SELECTED', // Called on workflow run selection. Returns {project: VISRC_WorkflowRun}.

    // WorkflowBuilder events.
    EVENT__WORKFLOWBUILDER_SELECTED: 'EVENT__WORKFLOWBUILDER_SELECTED', // Called on workflow builder opening. Returns {workflow: VISRC_Workflow} if workflow associated. 'workflow' may be null.

///////////////////////////////////////////////////////////////////////////////////////
// REQUESTS
///////////////////////////////////////////////////////////////////////////////////////

    // Collection request.
    REQUEST__COLLECTION_PROJECT: 'REQUEST__COLLECTION_PROJECT',
    REQUEST__COLLECTION_RUNJOB: 'REQUEST__COLLECTION_RUNJOB',
    REQUEST__COLLECTION_SCORE: 'REQUEST__COLLECTION_SCORE',
    REQUEST__COLLECTION_WORKFLOW: 'REQUEST__COLLECTION_WORKFLOW',
    REQUEST__COLLECTION_WORKFLOWRUN: 'REQUEST__COLLECTION_WORKFLOWRUN',

    REQUEST__APPLICATION: 'REQUEST_APPLICATION',
    REQUEST__USER: 'REQUEST__USER',
    REQUEST__PROJECT_ACTIVE: 'REQUEST__PROJECT_ACTIVE'
};

export default VISRC_Events;