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
        Radio.log = (channelName, eventName, options) => this._handleRadioEvent(channelName, eventName, options);

        this._radioRequestResponseMap = [];

        this._radioRequestResponseMap[Events.REQUEST__PROJECT_CREATE] = {event: Events.EVENT__PROJECT_CREATED, modalTitle: 'Creating Project'};
        this._radioRequestResponseMap[Events.REQUEST__PROJECT_DELETE] = {event: Events.EVENT__PROJECT_DELETED, modalTitle: 'Deleting Project'};
        this._radioRequestResponseMap[Events.REQUEST__PROJECT_SAVE] = {event: Events.EVENT__PROJECT_SAVED, modalTitle: 'Saving Project'};

        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW] = {event: Events.EVENT__WORKFLOWBUILDER_LOADED_WORKFLOW, modalTitle: 'Loading Workflow'};
        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW] = {event: Events.EVENT__WORKFLOWBUILDER_VALIDATED_WORKFLOW, modalTitle: 'Validating Workflow'};

        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWJOBGROUP_IMPORT] = {event: Events.EVENT__WORKFLOWJOBGROUP_IMPORTED, modalTitle: 'Importing Workflow'};

        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWRUN_CREATE] = {event: Events.EVENT__WORKFLOWRUN_CREATED, modalTitle: 'Creating Workflow Run'};
        this._radioRequestResponseMap[Events.REQUEST__WORKFLOWRUN_SAVE] = {event: Events.EVENT__WORKFLOWRUN_SAVED, modalTitle: 'Saving Workflow Run'};
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle Radio event.
     */
    _handleRadioEvent(channelName, eventName, options)
    {
        var response = this._radioRequestResponseMap[eventName];
        if (response)
        {
            this.rodanChannel.request(Events.REQUEST__MODAL_SHOW_SIMPLE, {title: response.modalTitle, text: 'Please wait...'});
            this.rodanChannel.once(response.event, () => this.rodanChannel.request(Events.REQUEST__MODAL_HIDE));
        }
    }
}

export default RadioManager;