import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_BaseItem from './VISRC_BaseItem';
import VISRC_Events from '../../../Shared/VISRC_Events';

/**
 * OutputPort item.
 */
class VISRC_OutputPortItem extends VISRC_BaseItem
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
        this.fillColor = "#00ff00";
        this._connectionItems = [];
        this.update();
    }

    /**
     * Adds associated connection item.
     */
    addConnectionItem(aItem)
    {
        this._connectionItems.push(aItem);
    }

    /**
     * Removes connection item.
     */
    removeConnectionItem(aItem)
    {
        for (var i = 0; i < this._connectionItems.length; i++)
        {
            if (this._connectionItems[i] === aItem)
            {
                this._connectionItems.splice(i, 1);
            }
        }
    }

    /**
     * Update.
     */
    update()
    {
        for (var i = 0; i < this._connectionItems.length; i++)
        {
            this._connectionItems[i].update();
        }
    }

    /**
     * Destroy cleanup.
     */
    destroy()
    {
        this._destroyConnections();
        this._associatedModel.paperItem = null;
        this._associatedModel = null;
        this.remove();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Destroys connections.
     */
    _destroyConnections()
    {
        while (this._connectionItems.length > 0)
        {
            this._connectionItems[0].destroy();
        } 
        this._connectionItems = [];
    }
}

export default VISRC_OutputPortItem;