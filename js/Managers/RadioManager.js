import Radio from 'backbone.radio';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';

/**
 * Radio manager.
 */
export default class RadioManager
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor()
    {
        Radio.tuneIn('rodan');
        this._originalRadioLog = Radio.log;
        Radio.log = (channelName, eventName, options) => this._handleRadioRequest(channelName, eventName, options);

        this._pendingResponses = [];
        this._radioRequestResponseMap = [];

        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__PROJECT_CREATE] = {event: RODAN_EVENTS.EVENT__PROJECT_CREATED, modalTitle: 'Creating Project'};
        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__PROJECT_DELETE] = {event: RODAN_EVENTS.EVENT__PROJECT_DELETED, modalTitle: 'Deleting Project'};
        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__PROJECT_SAVE] = {event: RODAN_EVENTS.EVENT__PROJECT_SAVED, modalTitle: 'Saving Project'};

        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__RESOURCE_CREATE] = {event: RODAN_EVENTS.EVENT__RESOURCE_CREATED, modalTitle: 'Creating Resource'};
        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__RESOURCE_DELETE] = {event: RODAN_EVENTS.EVENT__RESOURCE_DELETED, modalTitle: 'Deleting Resource'};
        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__RESOURCE_SAVE] = {event: RODAN_EVENTS.EVENT__RESOURCE_SAVED, modalTitle: 'Saving Resource'};

        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOW_CREATE] = {event: RODAN_EVENTS.EVENT__WORKFLOW_CREATED, modalTitle: 'Creating Workflow'};
        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOW_DELETE] = {event: RODAN_EVENTS.EVENT__WORKFLOW_DELETED, modalTitle: 'Deleting Workflow'};
        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOW_IMPORT] = {event: RODAN_EVENTS.EVENT__WORKFLOW_CREATED, modalTitle: 'Importing Workflow'};
        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOW_SAVE] = {event: RODAN_EVENTS.EVENT__WORKFLOW_SAVED, modalTitle: 'Saving Workflow'};

        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW] = {event: RODAN_EVENTS.EVENT__WORKFLOWBUILDER_LOADED_WORKFLOW, modalTitle: 'Loading Workflow'};
    //    this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW] = {event: RODAN_EVENTS.EVENT__WORKFLOWBUILDER_VALIDATED_WORKFLOW, modalTitle: 'Validating Workflow'};

    //    this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOWJOB_CREATE] = {event: RODAN_EVENTS.EVENT__WORKFLOWJOB_CREATED, modalTitle: 'Creating Workflow Job'};
        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOWJOB_DELETE] = {event: RODAN_EVENTS.EVENT__WORKFLOWJOB_DELETED, modalTitle: 'Deleting Workflow Job'};
        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOWJOB_SAVE] = {event: RODAN_EVENTS.EVENT__WORKFLOWJOB_SAVED, modalTitle: 'Saving Workflow Job'};

        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOWJOBGROUP_IMPORT] = {event: RODAN_EVENTS.EVENT__WORKFLOWJOBGROUP_IMPORTED, modalTitle: 'Importing Workflow'};
        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOWJOBGROUP_DELETE] = {event: RODAN_EVENTS.EVENT__WORKFLOWJOBGROUP_DELETED, modalTitle: 'Deleting Workflow Job Group'};
        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOWJOBGROUP_SAVE] = {event: RODAN_EVENTS.EVENT__WORKFLOWJOBGROUP_SAVED, modalTitle: 'Saving Workflow Job Group'};

        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOWRUN_CREATE] = {event: RODAN_EVENTS.EVENT__WORKFLOWRUN_CREATED, modalTitle: 'Creating Workflow Run'};
        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOWRUN_DELETE] = {event: RODAN_EVENTS.EVENT__WORKFLOWRUN_DELETED, modalTitle: 'Deleting Workflow Run'};
        this._radioRequestResponseMap[RODAN_EVENTS.REQUEST__WORKFLOWRUN_SAVE] = {event: RODAN_EVENTS.EVENT__WORKFLOWRUN_SAVED, modalTitle: 'Saving Workflow Run'};
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle Radio request.
     */
    _handleRadioRequest(channelName, eventName, options)
    {
        var response = this._radioRequestResponseMap[eventName];
        if (response)
        {
            if (!this._pendingResponses[response.event])
            {
                this._pendingResponses[response.event] = 0;
            }
            this._pendingResponses[response.event] += 1;
            Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW_SIMPLE, {title: response.modalTitle, text: 'Please wait...'});
            Radio.channel('rodan').once(response.event, () => this._handleRadioEvent(response.event));
        }
    }
    /**
     * Handle Radio event.
     */
    _handleRadioEvent(eventName)
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_HIDE);
        this._pendingResponses[eventName] -= 1;
        if (this._pendingResponses[eventName] > 0)
        {
            Radio.channel('rodan').once(eventName, () => this._handleRadioEvent(eventName));
        }
    }
}