import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Events from '../Shared/Events';

/**
 * Radio manager.
 */
class RadioManager
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(options)
    {
        this.rodanChannel = Radio.channel('rodan');
        Radio.tuneIn('rodan');
        this._originalRadioLog = Radio.log;
        Radio.log = (channelName, eventName, options) => this._handleRadioRequest(channelName, eventName, options);

        this._pendingResponses = [];
        this._radioRequestResponseMap = [];

        this._radioRequestResponseMap[Events.REQUEST__PROJECT_CREATE] = {event: Events.EVENT__PROJECT_CREATED, modalTitle: 'Creating Project'};
        this._radioRequestResponseMap[Events.REQUEST__PROJECT_DELETE] = {event: Events.EVENT__PROJECT_DELETED, modalTitle: 'Deleting Project'};
        this._radioRequestResponseMap[Events.REQUEST__PROJECT_SAVE] = {event: Events.EVENT__PROJECT_SAVED, modalTitle: 'Saving Project'};

        this._radioRequestResponseMap[Events.REQUEST__WORKFLOW_CREATE] = {event: Events.EVENT__WORKFLOW_CREATED, modalTitle: 'Creating Workflow'};
        this._radioRequestResponseMap[Events.REQUEST__WORKFLOW_DELETE] = {event: Events.EVENT__WORKFLOW_DELETED, modalTitle: 'Deleting Workflow'};
        this._radioRequestResponseMap[Events.REQUEST__WORKFLOW_SAVE] = {event: Events.EVENT__WORKFLOW_SAVED, modalTitle: 'Saving Workflow'};

        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW] = {event: Events.EVENT__WORKFLOWBUILDER_LOADED_WORKFLOW, modalTitle: 'Loading Workflow'};
        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW] = {event: Events.EVENT__WORKFLOWBUILDER_VALIDATED_WORKFLOW, modalTitle: 'Validating Workflow'};

        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWJOB_CREATE] = {event: Events.EVENT__WORKFLOWJOB_CREATED, modalTitle: 'Creating Workflow Job'};
        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWJOB_DELETE] = {event: Events.EVENT__WORKFLOWJOB_DELETED, modalTitle: 'Deleting Workflow Job'};
        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWJOB_SAVE] = {event: Events.EVENT__WORKFLOWJOB_SAVED, modalTitle: 'Saving Workflow Job'};

        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWJOBGROUP_IMPORT] = {event: Events.EVENT__WORKFLOWJOBGROUP_IMPORTED, modalTitle: 'Importing Workflow'};
        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWJOBGROUP_DELETE] = {event: Events.EVENT__WORKFLOWJOBGROUP_DELETED, modalTitle: 'Deleting Workflow Job Group'};
        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWJOBGROUP_SAVE] = {event: Events.EVENT__WORKFLOWJOBGROUP_SAVED, modalTitle: 'Saving Workflow Job Group'};

        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWRUN_CREATE] = {event: Events.EVENT__WORKFLOWRUN_CREATED, modalTitle: 'Creating Workflow Run'};
        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWRUN_SAVE] = {event: Events.EVENT__WORKFLOWRUN_SAVED, modalTitle: 'Saving Workflow Run'};
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
            this.rodanChannel.request(Events.REQUEST__MODAL_SHOW_SIMPLE, {title: response.modalTitle, text: 'Please wait...'});
            this.rodanChannel.once(response.event, () => this._handleRadioEvent(response.event));
        }
    }
    /**
     * Handle Radio event.
     */
    _handleRadioEvent(eventName)
    {
        this.rodanChannel.request(Events.REQUEST__MODAL_HIDE);
        this._pendingResponses[eventName] -= 1;
        if (this._pendingResponses[eventName] > 0)
        {
            this.rodanChannel.once(eventName, () => this._handleRadioEvent(eventName));
        }
    }
}

export default RadioManager;