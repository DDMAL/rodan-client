import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';

/**
 * Workflow list item for importing into another Workflow.
 */
class ViewWorkflowListImportItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
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
        this.rodanChannel.request(Events.REQUEST__MODAL_HIDE);
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_IMPORT_WORKFLOW, {origin: this.model, target: this._workflow});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflowListImportItem.prototype.template = '#template-main_workflowbuilder_workflow_list_item_import';
ViewWorkflowListImportItem.prototype.tagName = 'tr';
ViewWorkflowListImportItem.prototype.ui = {
    buttonImportWorkflow: '#button-main_workflowbuilder_workflow_import'
};
ViewWorkflowListImportItem.prototype.events = {
    'click @ui.buttonImportWorkflow': '_handleButtonImportWorkflow'
};

export default ViewWorkflowListImportItem;