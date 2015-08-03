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
     * Constructor.
     */
    constructor(aOptions)
    {
        this._initializeRadio();

        this.modelEvents = {
            'all': 'render'
        };
        this.template = '#template-main_resource_list_item';
        this.tagName = 'tr';
        this.events = {
            'click': '_handleClick'
        };

        super(aOptions);
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

export default ViewResourceListItem;