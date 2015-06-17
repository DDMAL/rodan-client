import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';

/**
 * Base Item in Workspace
 */
class VISRC_BaseItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(aParameters)
    {
        this._initializeRadio();
        this._associatedModel = aParameters.model;
        this._selected = false;
    }

///////////////////////////////////////////////////////////////////////////////////////
// ABSTRACT METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Abstract method. Handles mouse cick.
     */
    _handleMouseClick(aEvent)
    {
        // TODO - better way to do abstract methods
        console.log("This must be defined in sub-class.");
    }

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
    
    /**
     * Handles mouse down.
     */
    _handleMouseDown(aEvent)
    {
        this._selected = true;
    }

    /**
     * Handles mouse up.
     */
    _handleMouseUp(aEvent)
    {
        this._selected = false;
    }

    /**
     * Handles mouse move.
     * TODO - should probably be redone...mouse can escape
     */
    _handleMouseMove(aEvent)
    {
        if (this._selected)
        {
            this._paperItem.position.x += aEvent.delta.x;
            this._paperItem.position.y += aEvent.delta.y;
        }
    }
}

export default VISRC_BaseItem;