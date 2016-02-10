import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * Resource item View for Collection in modal
 */
class ViewResourceListItemModal extends Marionette.ItemView
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

    /**
     * Handles double click.
     */
    _handleDoubleClick()
    {
        if (this._assigned)
        {
            this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_UNASSIGN_RESOURCE, {inputport: this._inputPort, resource: this.model}); 
        }
        else
        {
            this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ASSIGN_RESOURCE, {inputport: this._inputPort, resource: this.model}); 
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewResourceListItemModal.prototype.modelEvents = {
    'all': 'render'
};
ViewResourceListItemModal.prototype.template = '#template-modal_resource_list_item';
ViewResourceListItemModal.prototype.tagName = 'tr';
ViewResourceListItemModal.prototype.events = {
    'dblclick': '_handleDoubleClick'
};

export default ViewResourceListItemModal;