import BaseViewListItem from 'js/Views/Master/Main/BaseViewListItem';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';

/**
 * Resource item View for Collection in modal.
 */
export default class ViewResourceListItemModal extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.inputport' (InputPort), 'options.assigned' (boolean; is this item assigned for a WorkflowRun), and 'options.workflow' (Workflow) must also be provided
     */
    initialize(options)
    {
        this._inputPort = options.inputport;
        this._assigned = options.assigned;
        this._workflow = options.workflow;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles double click.
     */
    _handleDoubleClick()
    {
        if (this._assigned)
        {
            Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__WORKFLOWBUILDER_UNASSIGN_RESOURCE, {inputport: this._inputPort, resource: this.model, workflow: this._workflow}); 
        }
        else
        {
            Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__WORKFLOWBUILDER_ASSIGN_RESOURCE, {inputport: this._inputPort, resource: this.model, workflow: this._workflow}); 
        }
    }
}
ViewResourceListItemModal.prototype.template = '#template-modal_resource_list_item';
ViewResourceListItemModal.prototype.tagName = 'tr';
ViewResourceListItemModal.prototype.events = {
    'dblclick': '_handleDoubleClick'
};