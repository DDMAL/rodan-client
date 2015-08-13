import BaseItem from './BaseItem';

/**
 * Connection item.
 */
class ConnectionItem extends BaseItem
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
        this._associatedInputPort = aParameters.inputPort;
        this._associatedOutputPort = aParameters.outputPort;
        this.update();
    }

    /**
     * Update.
     */
    update()
    {
        this.firstSegment.point.x = this._associatedOutputPort.paperItem.position.x;
        this.firstSegment.point.y = this._associatedOutputPort.paperItem.bounds.bottom;
        this.lastSegment.point.x = this._associatedInputPort.paperItem.position.x;
        this.lastSegment.point.y = this._associatedInputPort.paperItem.bounds.top;
    }

    /**
     * Destroy cleanup.
     */
    destroy()
    {
        this._associatedInputPort.paperItem.setConnectionItem(null);
        this._associatedInputPort = null;
        this._associatedOutputPort.paperItem.removeConnectionItem(this);
        this._associatedOutputPort = null;
        super.destroy();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default ConnectionItem;