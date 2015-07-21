import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import BaseItem from './BaseItem';
import Events from '../../../Shared/Events';

/**
 * InputPort item.
 */
class InputPortItem extends BaseItem
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
        this.update();
    }

    /**
     * Return true iff has connection item.
     */
    hasConnectionItem()
    {
        return this._connectionItem !== null;
    }

    /**
     * Update.
     */
    update()
    {
        this.fillColor = this.hasConnectionItem() ? "#00ff00" : "#ff0000";
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
        if (this.hasConnectionItem())
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

export default InputPortItem;