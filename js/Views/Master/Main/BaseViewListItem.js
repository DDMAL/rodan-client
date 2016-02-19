import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * Base List Item view.
 */
class BaseViewListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(options)
    {
        super(options);
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
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Set description
     */
    onRender()
    {
        var description = 'no description available';
        if (this.model.has('description') && this.model.get('description') !== '')
        {
            description = this.model.get('description');
        }
        this.$el.attr('title', description);
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
BaseViewListItem.prototype.modelEvents = {
    'change': 'render'
};

export default BaseViewListItem;