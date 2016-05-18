import BaseViewListItem from 'js/Views/Master/Main/BaseViewListItem';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';

/**
 * InputPortType list item view.
 */
export default class ViewInputPortTypeListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.workflowjob' (WorkflowJob) and 'options.workflow' (Workflow) must also be provided
     */
    initialize(options)
    {
        this._workflowJob = options.workflowjob;
        this._workflow = options.workflow;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles input port add.
     */
    _handleButtonNewInputPort()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT, {inputporttype: this.model, workflowjob: this._workflowJob, workflow: this._workflow});
    }
}
ViewInputPortTypeListItem.prototype.tagName = 'tr';
ViewInputPortTypeListItem.prototype.template = '#template-main_inputporttype_list_item';
ViewInputPortTypeListItem.prototype.events = {
    'click @ui.buttonNewInputPort': '_handleButtonNewInputPort'
};
ViewInputPortTypeListItem.prototype.ui = {
    buttonNewInputPort: '#button-new_inputport'
};