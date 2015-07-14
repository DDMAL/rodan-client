import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';

/**
 * Base Item in WorkflowBuilder
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

        this._showText = (aParameters.hasOwnProperty("text") && aParameters.text === true);
        
        // TODO - MAGIC NUMBERS
        this.strokeColor = 'black';
        this.strokeJoin = 'round';
        this.strokeWidth = 2;
        this.fillColor = '#5555ff';

        this.onMouseDown = aEvent => paper.handleMouseEvent({item: this, event: aEvent});
        this.onMouseUp = aEvent => paper.handleMouseEvent({item: this, event: aEvent});
        this.onMouseMove = aEvent => paper.handleMouseEvent({item: this, event: aEvent});
        this.onClick = aEvent => paper.handleMouseEvent({item: this, event: aEvent});

        this._initializeRadio();
        this._associatedModel = aParameters.model;

        this._text = null;
        if (this._showText)
        {
            this._text = new paper.PointText(new paper.Point(0, 0));
            this._text.justification = 'center';
            this._text.fillColor = '#000000';
            this._text.content = '';
            this._text.position = this.bounds.center;
            this.addChild(this._text);
        }
    }

    /**
     * Moves the item.
     */
    move(aDelta)
    {
        this.position.x += aDelta.x;
        this.position.y += aDelta.y;
        if (this._text != null)
        {
            this._text.position = this.bounds.center;
        }
        this.update();
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
        console.error("This must be defined in sub-class.");
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
        this.rodanChannel.on(VISRC_Events.EVENT__MODEL_HASCHANGED, aPass => this._handleEventModelUpdated(aPass));
    }

    /**
     * Handle model update event.
     */
    _handleEventModelUpdated(aPass)
    {
        if (aPass.model !== this._associatedModel)
        {
            return;
        }
        this._text.content = aPass.model.get("name");
    }
}

export default VISRC_BaseItem;