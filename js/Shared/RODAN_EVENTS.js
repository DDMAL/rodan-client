
// todo
// CONTROLLERS: workflowjob messages the builder and it shouldn't

// TODO - in final docs, explain
// 
//  make model saves like workflowjob controller; only specify the "changed" fields
//  server errors (json)
//  explain options for route
//  data: {query parameters}
//  explain the "Global" collections
//  difference between events and requests
//  fields: {object with attributes to change}
// how configuration.js is used for some events
//  why we use "Collection" and not "List"
//  mark some of these as "hidden" or try to remove them 

let _instance = null;

/**
 * Backbone.Radio events use in the client. Do not instantiate this class.
 */
class RODAN_EVENTS
{
    /** @ignore */
    constructor()
    {
        if (_instance)
        {
            throw new Error('this class cannot be instantiated more than once');
        }

        /** @ignore */
        this.REQUEST__RESOURCE_SHOWLAYOUTVIEW = 'REQUEST__RESOURCE_SHOWLAYOUTVIEW';  // Show LayoutView for Resource control (outside of the primary Resources view). This tells the ControllerResource which LayoutView to reference upon events. Takes {layoutView: LayoutView}.
        /** @ignore */
        this.REQUEST__RUNJOB_SHOWLAYOUTVIEW = 'REQUEST__RUNJOB_SHOWLAYOUTVIEW';      // Show LayoutView for RunJob control (outside of the primary RunJobs view). This tells the ControllerRunJob which LayoutView to reference upon events. Takes {layoutView: LayoutView}.
        /** @ignore */
        this.EVENT__SERVER_WENTAWAY = 'EVENT__SERVER_WENTAWAY';                      // Called on server disconnect. No pass.
        /** @ignore */
        this.EVENT__SERVER_PANIC = 'EVENT__SERVER_PANIC';                            // Called when the app suspects that something went wrong.
        /** @ignore */
        this.REQUEST__SYSTEM_HANDLE_ERROR = 'REQUEST__SYSTEM_HANDLE_ERROR';          // Sends error to error handler. Takes {model: BaseModel, response: HTTP response, option: associated options}.

        ///////////////////////////////////////////////////////////////////////////////////////
        // Authentication
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when authentication error occurred with no other info. */
        this.EVENT__AUTHENTICATION_ERROR_NULL = 'EVENT__AUTHENTICATION_ERROR_NULL';
        /** Triggered on success of authentication check. Sends {user: User}. */
        this.EVENT__AUTHENTICATION_LOGIN_SUCCESS = 'EVENT__AUTHENTICATION_LOGIN_SUCCESS';
        /** Triggered after authentication attempt; user must log in. */
        this.EVENT__AUTHENTICATION_LOGINREQUIRED = 'EVENT__AUTHENTICATION_LOGINREQUIRED';
        /** Triggered on success of deauthentication. */
        this.EVENT__AUTHENTICATION_LOGOUT_SUCCESS = 'EVENT__AUTHENTICATION_LOGOUT_SUCCESS';
        /** Request check of authentication status. The client will make a request to the Rodan server. Upon response from the server, the client will fire one of the above AUTHENTICATION events. */
        this.REQUEST__AUTHENTICATION_CHECK = 'REQUEST__AUTHENTICATION_CHECK';
        /** Request login authentication. Takes {username: string, password: string}. Upon response from the server, the client will fire one of the above AUTHENTICATION events. */
        this.REQUEST__AUTHENTICATION_LOGIN = 'REQUEST__AUTHENTICATION_LOGIN';
        /** Request logout for currently logged in user. Upon response from the server, the client will fire one of the above AUTHENTICATION events. */
        this.REQUEST__AUTHENTICATION_LOGOUT = 'REQUEST__AUTHENTICATION_LOGOUT';
        /** Request currently logged in User. Returns User or null. */
        this.REQUEST__AUTHENTICATION_USER = 'REQUEST__AUTHENTICATION_USER';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Configuration
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when configuration file has been loaded. */
        this.EVENT__CONFIGURATION_LOADED = 'EVENT__CONFIGURATION_LOADED';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Context Menu
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Request context menu be hidden. */
        this.REQUEST__CONTEXTMENU_HIDE = 'REQUEST__CONTEXTMENU_HIDE';
        /** Request context menu be shown. Takes {items: [{label: string, channel: string (Radio channel; default: 'rodan'), request: string (Radio request name), options: object (optional; options sent to Radio request)}], top: float (coordinate), left: float (coordinate)}. */
        this.REQUEST__CONTEXTMENU_SHOW = 'REQUEST__CONTEXTMENU_SHOW';

        ///////////////////////////////////////////////////////////////////////////////////////
        // General
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Request "About" information be shown. */
        this.REQUEST__SHOW_ABOUT = 'REQUEST__SHOW_ABOUT';
        /** Request "Help" page be shown. */
        this.REQUEST__SHOW_HELP = 'REQUEST__SHOW_HELP';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Global Collections
        //
        // The 'LOAD' commands are not meant for general use. They are called on startup.
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Request all InputPortTypes. Returns GlobalInputPortTypeCollection. */
        this.REQUEST__GLOBAL_INPUTPORTTYPE_COLLECTION = 'REQUEST__GLOBAL_INPUTPORTTYPE_COLLECTION';
        /** Request load of InputPortTypes from server. Takes {data: {query parameters}}. */
        this.REQUEST__GLOBAL_INPUTPORTTYPES_LOAD = 'REQUEST__GLOBAL_INPUTPORTTYPES_LOAD';
        /** Request all Jobs. Returns GlobalJobCollection. */
        this.REQUEST__GLOBAL_JOB_COLLECTION = 'REQUEST__GLOBAL_JOB_COLLECTION';
        /** Request load of Jobs from server. Takes {data: {query parameters}}. */
        this.REQUEST__GLOBAL_JOBS_LOAD = 'REQUEST__GLOBAL_JOBS_LOAD';
        /** Request all OutputPortTypes. Returns GlobalOutputPortTypeCollection. */
        this.REQUEST__GLOBAL_OUTPUTPORTTYPE_COLLECTION = 'REQUEST__GLOBAL_OUTPUTPORTTYPE_COLLECTION';
        /** Request load of OutputPortTypes from server. Takes {data: {query parameters}}. */
        this.REQUEST__GLOBAL_OUTPUTPORTTYPES_LOAD = 'REQUEST__GLOBAL_OUTPUTPORTTYPES_LOAD';
        /** Request all Projects. Returns GlobalProjectCollection. */
        this.REQUEST__GLOBAL_PROJECT_COLLECTION = 'REQUEST__GLOBAL_PROJECT_COLLECTION';
        /** Request load of Projects from server. Takes {data: {query parameters}}. */
        this.REQUEST__GLOBAL_PROJECTS_LOAD = 'REQUEST__GLOBAL_PROJECTS_LOAD';
        /** Request all ResourceTypes. Returns GlobalResourceTypeCollection. */
        this.REQUEST__GLOBAL_RESOURCETYPE_COLLECTION = 'REQUEST__GLOBAL_RESOURCETYPE_COLLECTION';
        /** Request load of ResourceTypes from server. Takes {data: {query parameters}}. */
        this.REQUEST__GLOBAL_RESOURCETYPES_LOAD = 'REQUEST__GLOBAL_RESOURCETYPES_LOAD';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Main Region
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Request main region be filled with provided Marionette View. Takes {view: Marionette.View}. */
        this.REQUEST__MAINREGION_SHOW_VIEW = 'REQUEST__MAINREGION_SHOW_VIEW';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Modal
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Request modal window to hide/close. */
        this.REQUEST__MODAL_HIDE = 'REQUEST__MODAL_HIDE';
        /** Request modal window to show/open with provided Marionette View. If another modal is currently open the request will not show. Takes {view: Marionette.View, title: string}. */
        this.REQUEST__MODAL_SHOW = 'REQUEST__MODAL_SHOW';
        /** Request modal window to show/open without view. If another modal is currently open the request will not show. Takes {title: string, text: string}. */
        this.REQUEST__MODAL_SHOW_SIMPLE = 'REQUEST__MODAL_SHOW_SIMPLE';

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
        /** Triggered when an instance of BaseModel has been added to a Backbone.Collection. Sends {model: BaseModel, collection: BaseCollection, options: Javascript object}). */
        this.EVENT__COLLECTION_ADD = 'EVENT__COLLECTION_ADD';
        /** Triggered when an instance of BaseModel has changed (bound to 'change' event in Backbone). Sends {model: BaseModel, options: Javascript object}. */
        this.EVENT__MODEL_CHANGE = 'EVENT__MODEL_CHANGE';
        /** Triggered when an instance of BaseModel has been synced (bound to 'sync' event in Backbone). Sends {model: BaseModel, response: XMLHTTPRequest, options: Javascript object}. */
        this.EVENT__MODEL_SYNC = 'EVENT__MODEL_SYNC';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Project
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when Project has been created. Sends {project: Project}. */
        this.EVENT__PROJECT_CREATED = 'EVENT__PROJECT_CREATED';
        /** Triggered when Project has been deleted. Sends {project: Project}. */
        this.EVENT__PROJECT_DELETED = 'EVENT__PROJECT_DELETED';
        /** Triggered when Project has been saved. Sends {project: Project}. */
        this.EVENT__PROJECT_SAVED = 'EVENT__PROJECT_SAVED';
        /** Triggered when the user selects an individual Project. Sends {project: Project}. */
        this.EVENT__PROJECT_SELECTED = 'EVENT__PROJECT_SELECTED';
        /** Triggered when the user selects to see all available Projects. */
        this.EVENT__PROJECT_SELECTED_COLLECTION = 'EVENT__PROJECT_SELECTED_COLLECTION';
        /** Request a Project be created. Takes {creator: User}. */
        this.REQUEST__PROJECT_CREATE = 'REQUEST__PROJECT_CREATE';
        /** Request a Project be deleted. Takes {project: Project}. */
        this.REQUEST__PROJECT_DELETE = 'REQUEST__PROJECT_DELETE';
        /** Request currently active/open Project. Returns Project (or null). */
        this.REQUEST__PROJECT_GET_ACTIVE = 'REQUEST__PROJECT_GET_ACTIVE';
        /** Request a Project be saved/updated. Takes {project: Project, fields: {object with attributes to change}}. */
        this.REQUEST__PROJECT_SAVE = 'REQUEST__PROJECT_SAVE';
        /** Request a Project be set as active Project. Takes {project: Project}. */
        this.REQUEST__PROJECT_SET_ACTIVE = 'REQUEST__PROJECT_SET_ACTIVE';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Resource
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when Resource created. Sends {resource: Resource}. */
        this.EVENT__RESOURCE_CREATED = 'EVENT__RESOURCE_CREATED';
        /** Triggered when Resource deleted. Sends {resource: Resource}. */
        this.EVENT__RESOURCE_DELETED = 'EVENT__RESOURCE_DELETED';
        /** Triggered when Resource saved. Sends {resource: Resource}. */
        this.EVENT__RESOURCE_SAVED = 'EVENT__RESOURCE_SAVED';
        /** Triggered when the user selects an individual Resource. Sends {resource: Resource}. */
        this.EVENT__RESOURCE_SELECTED = 'EVENT__RESOURCE_SELECTED';
        /** Triggered when the user selects to see all available Resources. Sends {project: Project (Project associated with ResourceCollection)}. */
        this.EVENT__RESOURCE_SELECTED_COLLECTION = 'EVENT__RESOURCE_SELECTED_COLLECTION';
        /** Request a Resource be created. Takes {project: Project, file: JavaScript File object}. */
        this.REQUEST__RESOURCE_CREATE = 'REQUEST__RESOURCE_CREATE';
        /** Request a Resource be deleted. Takes {resource: Resource}. */
        this.REQUEST__RESOURCE_DELETE = 'REQUEST__RESOURCE_DELETE';
        /** Request a Resource be downloaded. Takes {resource: Resource}. */
        this.REQUEST__RESOURCE_DOWNLOAD = 'REQUEST__RESOURCE_DOWNLOAD';
        /** Request a Resource be saved/updated. Takes {resource: Resource, fields: {object with attributes to change}}. */
        this.REQUEST__RESOURCE_SAVE = 'REQUEST__RESOURCE_SAVE';
        /** Request a ResourceCollection to be loaded. Takes {data: Object (query parameters)}. Returns ResourceCollection. */
        this.REQUEST__RESOURCES_LOAD = 'REQUEST__RESOURCES_LOAD';

        ///////////////////////////////////////////////////////////////////////////////////////
        // RunJob
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when interactive RunJob has been acquired by the current user. Sends {runjob: RunJob}. */
        this.EVENT__RUNJOB_ACQUIRED = 'EVENT__RUNJOB_ACQUIRED';
        /** Triggered when the user selects an individual RunJob. Sends {runjob: RunJob}. */
        this.EVENT__RUNJOB_SELECTED = 'EVENT__RUNJOB_SELECTED';
        /** Triggered when the user selects to see RunJobs for a Project. */
        this.EVENT__RUNJOB_SELECTED_COLLECTION = 'EVENT__RUNJOB_SELECTED_COLLECTION';
        /** Request the provided RunJob be locked on the server for the current user. Takes {runjob: RunJob}. */
        this.REQUEST__RUNJOB_ACQUIRE = 'REQUEST__RUNJOB_ACQUIRE';
        /** Request a RunJobCollection to be loaded. Takes {data: Object (query parameters)}. Returns RunJobCollection. */
        this.REQUEST__RUNJOBS_LOAD = 'REQUEST__RUNJOBS_LOAD';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Server
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when server date has been updated. Sends {date: Date}. */
        this.EVENT__SERVER_DATE_UPDATED = 'EVENT__SERVER_DATE_UPDATED';
        /** Triggered on Rodan-based server errors. Sends {json: JSON object of error}. */
        this.EVENT__SERVER_ERROR = 'EVENT__SERVER_ERROR';
        /** Triggered when the client has no pending HTTP requests waiting to complete. Only fires if EVENT__SERVER_WAITING had previously been fired. */
        this.EVENT__SERVER_IDLE = 'EVENT__SERVER_IDLE';
        /** Triggered when server routes have been loaded. */
        this.EVENT__SERVER_ROUTESLOADED = 'EVENT__SERVER_ROUTESLOADED';
        /** Triggered when client has been waiting a predefined amount of time for 'complete' state (i.e. not waiting on server response). */
        this.EVENT__SERVER_WAITING = 'EVENT__SERVER_WAITING';
        /** Request server configuration. Returns object. */
        this.REQUEST__SERVER_CONFIGURATION = 'REQUEST__SERVER_CONFIGURATION';
        /** Request last known server date and time. Returns Date. */
        this.REQUEST__SERVER_DATE = 'REQUEST__SERVER_DATE';
        /** Request server hostname. Returns string (hostname). */
        this.REQUEST__SERVER_GET_HOSTNAME = 'REQUEST__SERVER_GET_HOSTNAME';
        /** Request server URL for route. Takes {route: string}. Returns string (URL). */
        this.REQUEST__SERVER_GET_ROUTE = 'REQUEST__SERVER_GET_ROUTE';
        /** Request options for server route. Takes {route: string}. Returns Javascript object with all options for route. */
        this.REQUEST__SERVER_GET_ROUTE_OPTIONS = 'REQUEST__SERVER_GET_ROUTE_OPTIONS';
        /** Request version of server. Returns string. */
        this.REQUEST__SERVER_GET_VERSION = 'REQUEST__SERVER_GET_VERSION';
        /** Request the client to load all routes. EVENT__SERVER_ROUTESLOADED is triggered on success. */
        this.REQUEST__SERVER_LOAD_ROUTES = 'REQUEST__SERVER_LOAD_ROUTES';
        /** Request the client to load all options for routes. Must authenticate prior to making this request. */
        this.REQUEST__SERVER_LOAD_ROUTE_OPTIONS = 'REQUEST__SERVER_LOAD_ROUTE_OPTIONS';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Transfer Manager
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when file upload fails. Sends {request: jQuery XMLHTTPRequest, file: Javascript file object}. */
        this.EVENT__TRANSFERMANAGER_UPLOAD_FAILED = 'EVENT__TRANSFERMANAGER_UPLOAD_FAILED';
        /** Triggered when file upload succeeds. Sends {request: jQuery XMLHTTPRequest, file: Javascript file object}. */
        this.EVENT__TRANSFERMANAGER_UPLOAD_SUCCEEDED = 'EVENT__TRANSFERMANAGER_UPLOAD_SUCCEEDED';
        /** Request download of a file from a URL. Takes {url: string (URL of file location), filename: string (name to give file when saving to local machine)}. */
        this.REQUEST__TRANSFERMANAGER_DOWNLOAD = 'REQUEST__TRANSFERMANAGER_DOWNLOAD';
        /** Request counts of uploads for this session. Returns {completed: int >= 0, failed:  int >= 0, pending:  int >= 0}. */
        this.REQUEST__TRANSFERMANAGER_GET_UPLOAD_COUNT = 'REQUEST__TRANSFERMANAGER_GET_UPLOAD_COUNT';
        /** Request the TransferManager to monitor a file upload. Takes {request: jQuery XMLHTTPRequest, file: Javascript file object}. */
        this.REQUEST__TRANSFERMANAGER_MONITOR_UPLOAD = 'REQUEST__TRANSFERMANAGER_MONITOR_UPLOAD';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Updater
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Request the Updater to clear registered update callback. Takes nothing. */
        this.REQUEST__UPDATER_CLEAR = 'REQUEST__UPDATER_CLEAR';
        /** Request a set of collections to be updated. Takes {collections: [BaseCollection]}. */
        this.REQUEST__UPDATER_SET_COLLECTIONS = 'REQUEST__UPDATER_SET_COLLECTIONS';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Workflow
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when Workflow has been created. Sends {workflow: Workflow}. */
        this.EVENT__WORKFLOW_CREATED = 'EVENT__WORKFLOW_CREATED';
        /** Triggered when Workflow has been deleted. Sends {workflow: Workflow}. */
        this.EVENT__WORKFLOW_DELETED = 'EVENT__WORKFLOW_DELETED';
        /** Triggered when Workflow has been saved. Sends {workflow: Workflow}. */
        this.EVENT__WORKFLOW_SAVED = 'EVENT__WORKFLOW_SAVED';
        /** Triggered when the user selects an individual Workflow. Sends {workflow: Workflow}. */
        this.EVENT__WORKFLOW_SELECTED = 'EVENT__WORKFLOW_SELECTED';
        /** Triggered when the user selects to see all available Workflows. Sends {project: Project (Project associated with WorkflowCollection)}. */
        this.EVENT__WORKFLOW_SELECTED_COLLECTION = 'EVENT__WORKFLOW_SELECTED_COLLECTION';
        /** Request a Workflow be created. Takes {project: Project}. */
        this.REQUEST__WORKFLOW_CREATE = 'REQUEST__WORKFLOW_CREATE';
        /** Request a Workflow be deleted. Takes {workflow: Workflow}. */
        this.REQUEST__WORKFLOW_DELETE = 'REQUEST__WORKFLOW_DELETE';
        /** Request a Workflow be saved/updated. Takes {workflow: Workflow, fields: {object with attributes to change}}. */
        this.REQUEST__WORKFLOW_SAVE = 'REQUEST__WORKFLOW_SAVE';

        ///////////////////////////////////////////////////////////////////////////////////////
        // WorkflowBuilder
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when the user selects an individual Workflow to edit. Sends {workflow: Workflow}. */
        this.EVENT__WORKFLOWBUILDER_SELECTED = 'EVENT__WORKFLOWBUILDER_SELECTED';
        /** Triggered when a Workflow is loaded into the WorkflowBuilder. Sends {workflow: Workflow}. */
        this.EVENT__WORKFLOWBUILDER_LOADED_WORKFLOW = 'EVENT__WORKFLOWBUILDER_LOADED_WORKFLOW';
        /** Triggered when a Workflow has been validated. Sends {workflow: Workflow}. */
        this.EVENT__WORKFLOWBUILDER_VALIDATED_WORKFLOW = 'EVENT__WORKFLOWBUILDER_VALIDATED_WORKFLOW';
        /** Request a Connection be added to a Workflow between two ports. Takes {inputport: InputPort, outputport: OutputPort, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_ADD_CONNECTION = 'REQUEST__WORKFLOWBUILDER_ADD_CONNECTION';
        /** Request a WorkflowJob be created from a Job of category Configuration.RESOURCE_DISTRIBUTOR_CATEGORY that can satisfy the provided InputPorts. Takes {inputports: [InputPort], workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_ADD_DISTRIBUTOR = 'REQUEST__WORKFLOWBUILDER_ADD_DISTRIBUTOR';
        /** Request an InputPort be added to a WorkflowJob. Takes {inputporttype: InputPortType, workflowjob: WorkflowJob, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT = 'REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT'; 
        /** Request an OutputPort be added to a WorkflowJob. Takes {outputporttype: InputPortType, workflowjob: WorkflowJob, workflow: Workflow, targetinputports: [InputPort] (optional)}. If targetinputports is provided the WorkflowBuilder will attempt to create Connections between the created OutputPort and those InputPort. */
        this.REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT = 'REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT';
        /** Request a WorkflowJob be created from a Job. Takes {job: Job, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOB = 'REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOB';
        /** Request a WorkflowJobGroup be created for the provided WorkflowJobs. Takes {workflowjobs: [WorkflowJob], workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOBGROUP = 'REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOBGROUP';
        /** Request a Resource be assigned to an InputPort. Takes {resource: Resource, inputport: InputPort, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_ASSIGN_RESOURCE = 'REQUEST__WORKFLOWBUILDER_ASSIGN_RESOURCE';
        /** Request a WorkflowRun be created. The WorkflowBuilder will use the known Resource assignments that have been made. Takes {workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_CREATE_WORKFLOWRUN = 'EVENT__WORKFLOWBUILDER_CREATE_WORKFLOWRUN';
        /** Request the Resources that are currently assigned to an InputPort. Takes {inputport: InputPort}. Returns [Resource]. */
        this.REQUEST__WORKFLOWBUILDER_GET_RESOURCEASSIGNMENTS = 'REQUEST__WORKFLOWBUILDER_GET_RESOURCEASSIGNMENTS';
        /** Request all InputPorts that could satisfy the provided OutputPort in the given Workflow. Takes {workflow: Workflow, outputport: OutputPort}. Returns [string] (InputPort URLs). */
        this.REQUEST__WORKFLOWBUILDER_GET_SATISFYING_INPUTPORTS = 'REQUEST__WORKFLOWBUILDER_GET_SATISFYING_INPUTPORTS';
        /** Request a Workflow (origin) be added to another Workflow (target). Takes {origin: Workflow, target: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_IMPORT_WORKFLOW = 'REQUEST__WORKFLOWBUILDER_IMPORT_WORKFLOW';
        /** Request a Workflow be fetched and loaded. If no Workflow has yet been loaded in the WorkflowBuilder, or the Workflow to be loaded differs from the one currently loaded in the WorkflowBuilder, the WorkflowBuilder will be initialized with the new Workflow. Takes {workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW = 'REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW';
        /** Request a Connection be removed from a Workflow. Takes {connection: Connection, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_REMOVE_CONNECTION = 'REQUEST__WORKFLOWBUILDER_REMOVE_CONNECTION';
        /** Request an InputPort be removed from a WorkflowJob. Takes {inputport: InputPort, workflowjob: WorkflowJob, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_REMOVE_INPUTPORT = 'REQUEST__WORKFLOWBUILDER_REMOVE_INPUTPORT';
        /** Request an OutputPort be removed from a WorkflowJob. Takes {outputport: OutputPort, workflowjob: WorkflowJob, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_REMOVE_OUTPUTPORT = 'REQUEST__WORKFLOWBUILDER_REMOVE_OUTPUTPORT';
        /** Request a WorkflowJob be removed from a Workflow. Takes {workflowjob: WorkflowJob, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_REMOVE_WORKFLOWJOB = 'REQUEST__WORKFLOWBUILDER_REMOVE_WORKFLOWJOB';
        /** Request a WorkflowJobGroup and all its associated WorkflowJobs be removed from a Workflow. Takes {workflowjobgroup: WorkflowJobGroup, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_REMOVE_WORKFLOWJOBGROUP = 'REQUEST__WORKFLOWBUILDER_REMOVE_WORKFLOWJOBGROUP';
        /** Request that future WorkflowJob creation automatically adds minimal ports. Takes {addports: boolean}. */
        this.REQUEST__WORKFLOWBUILDER_SET_ADDPORTS = 'REQUEST__WORKFLOWBUILDER_SET_ADDPORTS';
        /** Request a Job collection view be displayed for adding Jobs to the currently loaded Workflow. Takes {workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_JOBCOLLECTION_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_JOBCOLLECTION_VIEW';
        /** Request a resource assignment view be displayed for an InputPort. Takes {inputport: InputPort, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_RESOURCEASSIGNMENT_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_RESOURCEASSIGNMENT_VIEW';
        /** Request a Workflow data view be displayed for a Workflow. Takes {workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOW_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOW_VIEW';
        /** Request a Workflow collection view be displayed for importing Workflows. Takes {workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWCOLLECTION_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWCOLLECTION_VIEW';
        /** Request a port view for adding/deleting ports for a WorkflowJob be displayed. Takes {workflowjob: WorkflowJob, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_PORTS_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_PORTS_VIEW';
        /** Request a WorkflowJob settings view be displayed for a WorkflowJob. Takes {workflowjob: WorkflowJob, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_SETTINGS_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_SETTINGS_VIEW';
        /** Request a WorkflowJob data view be displayed for a WorkflowJob. Takes {workflowjob: WorkflowJob, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_VIEW';
        /** Request a WorkflowJobGroup data view be displayed for a WorkflowJobGroup. Takes {workflowjobgroup: WorkflowJobGroup, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOBGROUP_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOBGROUP_VIEW';
        /** Request a Resource be unassigned to an InputPort. Takes {resource: Resource, inputport: InputPort, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_UNASSIGN_RESOURCE = 'REQUEST__WORKFLOWBUILDER_UNASSIGN_RESOURCE';
        /** Request a WorkflowJobGroup be removed from a Workflow, but keep all associated WorkflowJobs, ports, and Connections. Takes {workflowjobgroup: WorkflowJobGroup, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_UNGROUP_WORKFLOWJOBGROUP = 'REQUEST__WORKFLOWBUILDER_UNGROUP_WORKFLOWJOBGROUP';
        /** Request a Workflow be validated. Takes {workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW = 'REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW';

        ///////////////////////////////////////////////////////////////////////////////////////
        // WorkflowJob
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when WorkflowJob created. Sends {workflowjob: WorkflowJob}. */
        this.EVENT__WORKFLOWJOB_CREATED = 'EVENT__WORKFLOWJOB_CREATED';
        /** Triggered when WorkflowJob deleted. Sends {workflowjob: WorkflowJob}. */
        this.EVENT__WORKFLOWJOB_DELETED = 'EVENT__WORKFLOWJOB_DELETED';
        /** Triggered when WorkflowJob saved. Sends {workflowjob: WorkflowJob}. */
        this.EVENT__WORKFLOWJOB_SAVED = 'EVENT__WORKFLOWJOB_SAVED';
        /** Request a WorkflowJob be created of a Job type and added to a Workflow. Takes {job: Job, workflow: Workflow, addports: boolean, targetinputports: [InputPort] (optional)}. The minimum required InputPorts will be created iff addports is true. If targetinputports array of InputPorts is provided, Connections will be made to those InputPorts (from this WorkflowJob's OutputPort) iff the WorkflowJob created has one and only one OutputPort. */
        this.REQUEST__WORKFLOWJOB_CREATE = 'REQUEST__WORKFLOWJOB_CREATE'; // 
        /** Request a WorkflowJob be deleted. Takes {workflowjob: WorkflowJob}. */
        this.REQUEST__WORKFLOWJOB_DELETE = 'REQUEST__WORKFLOWJOB_DELETE';
        /** Request a WorkflowJob be saved/updated. Takes {workflowjob: WorkflowJob, workflow: Workflow (optional)}. If a Workflow is passed the WorkflowJobController will request a validation for that Workflow after the save has completed. */
        this.REQUEST__WORKFLOWJOB_SAVE = 'REQUEST__WORKFLOWJOB_SAVE';

        ///////////////////////////////////////////////////////////////////////////////////////
        // WorkflowJobGroup
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when WorkflowJobGroup imported. Sends {workflowjobgroup: WorkflowJobGroup}. */
        this.EVENT__WORKFLOWJOBGROUP_IMPORTED = 'EVENT__WORKFLOWJOBGROUP_IMPORTED';
        /** Triggered when WorkflowJobGroup has been deleted. Sends {workflowjobgroup: WorkflowJobGroup}. */
        this.EVENT__WORKFLOWJOBGROUP_DELETED = 'EVENT__WORKFLOWJOBGROUP_DELETED';
        /** Triggered when WorkflowJobGroup saved. Sends {workflowjobgroup: WorkflowJobGroup}. */
        this.EVENT__WORKFLOWJOBGROUP_SAVED = 'EVENT__WORKFLOWJOBGROUP_SAVED';
        /** Request a WorkflowJobGroup be deleted. Takes {workflowjobgroup: WorkflowJobGroup}. */
        this.REQUEST__WORKFLOWJOBGROUP_DELETE = 'REQUEST__WORKFLOWJOBGROUP_DELETE';
        /** Request arrays of InputPort URLs and OutputPort URLs for the given WorkflowJobGroup. Takes {url: string (WorkflowJobGroup URL), workflow: Workflow}. Returns {inputports: [InputPort], outputports: [OutputPort]}. */
        this.REQUEST__WORKFLOWJOBGROUP_GET_PORTS = 'REQUEST__WORKFLOWJOBGROUP_GET_PORTS';
        /** Request a Workflow (origin) be imported into another Workflow (target) as a WorkflowJobGroup. Takes {target: Workflow, origin: Workflow}. */
        this.REQUEST__WORKFLOWJOBGROUP_IMPORT = 'REQUEST__WORKFLOWJOBGROUP_IMPORT';
        /** Request WorkflowJobGroups be loaded for a given Workflow. Takes {workflow: Workflow}. */
        this.REQUEST__WORKFLOWJOBGROUP_LOAD_COLLECTION = 'REQUEST__WORKFLOWJOBGROUP_LOAD_COLLECTION';
        /** Request a WorkflowJobGroup be saved/updated. Takes {workflowjobgroup: WorkflowJobGroup}. */
        this.REQUEST__WORKFLOWJOBGROUP_SAVE = 'REQUEST__WORKFLOWJOBGROUP_SAVE';

        ///////////////////////////////////////////////////////////////////////////////////////
        // WorkflowRun
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when WorkflowRun created. Sends {workflowrun: WorkflowRun}. */
        this.EVENT__WORKFLOWRUN_CREATED = 'EVENT__WORKFLOWRUN_CREATED';
        /** Triggered when WorkflowRun deleted. Sends {workflowrun: WorkflowRun}. */
        this.EVENT__WORKFLOWRUN_DELETED = 'EVENT__WORKFLOWRUN_DELETED';
        /** Triggered when WorkflowRun saved. Sends {workflowrun: WorkflowRun}. */
        this.EVENT__WORKFLOWRUN_SAVED = 'EVENT__WORKFLOWRUN_SAVED';
        /** Triggered when the user selects an individual WorkflowRun. Sends {workflow: WorkflowRun}. */
        this.EVENT__WORKFLOWRUN_SELECTED = 'EVENT__WORKFLOWRUN_SELECTED';
        /** Triggered when the user selects to see all available WorkflowRuns. Sends {project: Project (Project associated with WorkflowRunCollection)}. */
        this.EVENT__WORKFLOWRUN_SELECTED_COLLECTION = 'EVENT__WORKFLOWRUN_SELECTED_COLLECTION';
        /** Request a WorkflowRun be created. Takes {workflow: Workflow, assignments: [string (Resource URLs or individual ResourceList URL)] (index by InputPort URLs)}. */
        this.REQUEST__WORKFLOWRUN_CREATE = 'REQUEST__WORKFLOWRUN_CREATE';
        /** Request a WorkflowRun be deleted. Takes {workflowrun: WorkflowRun}. */
        this.REQUEST__WORKFLOWRUN_DELETE = 'REQUEST__WORKFLOWRUN_DELETE';
        /** Request a WorkflowRun be saved/updated. Takes {model: WorkflowRun}. */
        this.REQUEST__WORKFLOWRUN_SAVE = 'REQUEST__WORKFLOWRUN_SAVE';
    }
}
/** @ignore */
export default new RODAN_EVENTS();
