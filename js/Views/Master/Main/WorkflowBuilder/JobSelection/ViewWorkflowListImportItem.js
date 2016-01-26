import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * Workflow list item for importing into another Workflow.
 */
class ViewWorkflowListImportItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this._initializeRadio();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
    }

    _handleButtonImportWorkflow()
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_IMPORT_WORKFLOW, {'workflow': this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflowListImportItem.prototype.modelEvents = {
    'all': 'render'
};
ViewWorkflowListImportItem.prototype.template = '#template-main_workflowbuilder_workflow_list_item_import';
ViewWorkflowListImportItem.prototype.tagName = 'tr';
ViewWorkflowListImportItem.prototype.ui = {
    buttonImportWorkflow: '#button-main_workflowbuilder_workflow_import'
};
ViewWorkflowListImportItem.prototype.events = {
    'click @ui.buttonImportWorkflow': '_handleButtonImportWorkflow'
};

export default ViewWorkflowListImportItem;