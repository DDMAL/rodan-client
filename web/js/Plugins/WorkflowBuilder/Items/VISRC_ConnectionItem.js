import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_BaseItem from './VISRC_BaseItem';
import VISRC_Events from '../../../Shared/VISRC_Events';

/**
 * Connection item.
 */
class VISRC_ConnectionItem extends VISRC_BaseItem
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
        this.remove();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_ConnectionItem;