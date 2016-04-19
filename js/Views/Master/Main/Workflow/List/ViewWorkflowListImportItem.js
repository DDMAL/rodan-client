import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';
import Radio from 'backbone.radio';

/**
 * Workflow list item for importing into another Workflow.
 */
export default class ViewWorkflowListImportItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.workflow' (Workflow) must also be provided
     */
    initialize(options)
    {
        this._workflow = options.workflow;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    _handleButtonImportWorkflow()
    {
        Radio.channel('rodan').request(Events.REQUEST__MODAL_HIDE);
        Radio.channel('rodan').request(Events.REQUEST__WORKFLOWBUILDER_IMPORT_WORKFLOW, {origin: this.model, target: this._workflow});
    }
}
ViewWorkflowListImportItem.prototype.template = '#template-main_workflowbuilder_workflow_list_item_import';
ViewWorkflowListImportItem.prototype.tagName = 'tr';
ViewWorkflowListImportItem.prototype.ui = {
    buttonImportWorkflow: '#button-main_workflowbuilder_workflow_import'
};
ViewWorkflowListImportItem.prototype.events = {
    'click @ui.buttonImportWorkflow': '_handleButtonImportWorkflow'
};