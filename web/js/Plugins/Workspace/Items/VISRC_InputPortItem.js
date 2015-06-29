import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_BaseItem from './VISRC_BaseItem';
import VISRC_Events from '../../../Shared/VISRC_Events';

/**
 * InputPort item.
 */
class VISRC_InputPortItem extends VISRC_BaseItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(aParameters)
    {
        super(aParameters);
        this._connectionItem = null;
        this.update();
    }

    /**
     * Sets associated connection item.
     */
    setConnectionItem(aItem)
    {
        this._connectionItem = aItem;
    }

    /**
     * Update.
     */
    update()
    {
        this.fillColor = this._associatedModel.isSatisfied() ? "#00ff00" : "#ff0000";
        if (this._connectionItem != null)
        {
            this._connectionItem.update();
        }
    }

    /**
     * Destroy cleanup.
     */
    destroy()
    {
        if (this._connectionItem != null)
        {
            this._connectionItem.destroy();
            this._connectionItem = null;
        }
        this._associatedModel.paperItem = null;
        this._associatedModel = null;
        this.remove();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_InputPortItem;