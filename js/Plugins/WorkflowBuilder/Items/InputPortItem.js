import BaseItem from './BaseItem';
import Configuration from '../../../Configuration';

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
        this.fillColor = this.hasConnectionItem() ? Configuration.WORKFLOWBUILDER.INPUTPORT_COLOR_SATISFIED : 
                                                    Configuration.WORKFLOWBUILDER.INPUTPORT_COLOR_UNSATISFIED;
        if (this._connectionItem !== null)
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