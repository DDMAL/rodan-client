import BaseItem from './BaseItem';
import Configuration from '../../../Configuration';

/**
 * OutputPort item.
 */
class OutputPortItem extends BaseItem
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
        this.fillColor = Configuration.WORKFLOWBUILDER.OUTPUTPORT_COLOR;
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
        super.destroy();
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

export default OutputPortItem;