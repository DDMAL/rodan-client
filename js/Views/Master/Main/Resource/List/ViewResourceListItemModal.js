import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';

/**
 * Resource item View for Collection in modal
 */
class ViewResourceListItemModal extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
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
            this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_UNASSIGN_RESOURCE, {inputport: this._inputPort, resource: this.model, workflow: this._workflow}); 
        }
        else
        {
            this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ASSIGN_RESOURCE, {inputport: this._inputPort, resource: this.model, workflow: this._workflow}); 
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewResourceListItemModal.prototype.template = '#template-modal_resource_list_item';
ViewResourceListItemModal.prototype.tagName = 'tr';
ViewResourceListItemModal.prototype.events = {
    'dblclick': '_handleDoubleClick'
};

export default ViewResourceListItemModal;