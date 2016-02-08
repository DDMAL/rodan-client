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

    /**
     * Handles click.
     */
    _handleClick()
    {
        console.log('handle this click!');
        //this._rodanChannel.trigger(Events.EVENT__RESOURCE_SELECTED, {resource: this.model});
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
    'click': '_handleClick'
};

export default ViewResourceListItemModal;