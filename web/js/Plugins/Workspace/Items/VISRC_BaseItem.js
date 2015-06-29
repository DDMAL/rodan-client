import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';

/**
 * Base Item in Workspace
 */
class VISRC_BaseItem extends paper.Path
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(aParameters)
    {
        super(aParameters.segments);
        
        // TODO - MAGIC NUMBERS
        this.strokeColor = 'black';
        this.strokeJoin = 'round';
        this.strokeWidth = 2;

        this.onMouseDown = aEvent => paper.handleMouseEvent({item: this, event: aEvent});
        this.onMouseUp = aEvent => paper.handleMouseEvent({item: this, event: aEvent});
        this.onMouseMove = aEvent => paper.handleMouseEvent({item: this, event: aEvent});
        this.onClick = aEvent => paper.handleMouseEvent({item: this, event: aEvent});

        this._initializeRadio();
        this._associatedModel = aParameters.model;
    }

///////////////////////////////////////////////////////////////////////////////////////
// ABSTRACT METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Abstract method. Update.
     */
    update()
    {
        // TODO - better way to do abstract methods
        console.log("This must be defined in sub-class.");
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
    }
}

export default VISRC_BaseItem;