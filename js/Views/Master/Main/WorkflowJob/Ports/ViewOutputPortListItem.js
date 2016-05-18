import BaseViewListItem from 'js/Views/Master/Main/BaseViewListItem';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';

/**
 * OutputPort list item view.
 */
export default class ViewOutputPortListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.workflow' (Workflow) and 'options.workflowjob' (WorkflowJob) must also be provided
     */
    initialize(options)
    {
        this._workflow = options.workflow;
        this._workflowJob = options.workflowjob;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle delete.
     */
    _handleButtonDelete()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__WORKFLOWBUILDER_REMOVE_OUTPUTPORT, {outputport: this.model, workflow: this._workflow, workflowjob: this._workflowJob});
    }
}
ViewOutputPortListItem.prototype.ui = {
    buttonDelete: '#button-delete'
};
ViewOutputPortListItem.prototype.events = {
    'click @ui.buttonDelete': '_handleButtonDelete'
};
ViewOutputPortListItem.prototype.template = '#template-main_outputport_list_item';
ViewOutputPortListItem.prototype.tagName = 'tr';