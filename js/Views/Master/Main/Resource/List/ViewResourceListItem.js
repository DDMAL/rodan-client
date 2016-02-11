import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the view (and controller) for a resource item.
 */
class ViewResourceListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
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
        this._rodanChannel.trigger(Events.EVENT__RESOURCE_SELECTED, {resource: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewResourceListItem.prototype.modelEvents = {
    'change': 'render'
};
ViewResourceListItem.prototype.template = '#template-main_resource_list_item';
ViewResourceListItem.prototype.tagName = 'tr';
ViewResourceListItem.prototype.events = {
    'click': '_handleClick'
};

export default ViewResourceListItem;