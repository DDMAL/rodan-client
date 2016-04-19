import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';
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
     * @param {object} options Marionette.View options object
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
            Radio.channel('rodan').request(Events.REQUEST__WORKFLOWBUILDER_UNASSIGN_RESOURCE, {inputport: this._inputPort, resource: this.model, workflow: this._workflow}); 
        }
        else
        {
            Radio.channel('rodan').request(Events.REQUEST__WORKFLOWBUILDER_ASSIGN_RESOURCE, {inputport: this._inputPort, resource: this.model, workflow: this._workflow}); 
        }
    }
}
ViewResourceListItemModal.prototype.template = '#template-modal_resource_list_item';
ViewResourceListItemModal.prototype.tagName = 'tr';
ViewResourceListItemModal.prototype.events = {
    'dblclick': '_handleDoubleClick'
};