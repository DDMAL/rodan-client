import Radio from 'backbone.radio';
import paper from 'paper';

import Events from '../../../Shared/Events';

/**
 * Base Item in WorkflowBuilder
 */
class BaseItem extends paper.Path
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(options)
    {
        super(options.segments);
        
        // TODO - MAGIC NUMBERS
        this.strokeColor = 'black';
        this.strokeJoin = 'round';
        this.strokeWidth = 2;
        this.fillColor = '#5555ff';

        // magic numbers
        this._HOVERTIME = 1000;

        this._timerEvent = null;

        this.onMouseDown = event => this._handleMouseEvent(event);
        this.onMouseUp = event => this._handleMouseEvent(event);
        this.onClick = event => this._handleMouseEvent(event);
        this.onMouseEnter = event => this._handleMouseEvent(event);
        this.onMouseLeave = event => this._handleMouseEvent(event);

        this._initializeRadio();
        this._associatedModel = options.model;

        this._text = new paper.PointText(new paper.Point(0, 0));
        this._text.justification = 'center';
        this._text.fillColor = '#000000';
        this._text.fontSize = 20;
        this._text.content = '';
        this._text.position = this.bounds.center;
        this.addChild(this._text);
        this._text.visible = (options.hasOwnProperty('text') && options.text === true);
        this._text.content = this._associatedModel.get('name');

        this._popup = new paper.PointText(new paper.Point(0, 0));
    }

    /**
     * Moves the item.
     */
    move(delta)
    {
        this.position.x += delta.x;
        this.position.y += delta.y;
        if (this._text !== null)
        {
            this._text.position = this.bounds.center;
        }
        this.update();
    }

    /**
     * Set position.
     */
    setPosition(point)
    {
        this.position = point;
        if (this._text !== null)
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
        console.error('This must be defined in sub-class.');
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.on(Events.EVENT__MODEL_HASCHANGED, aPass => this._handleEventModelUpdated(aPass));
    }

    /**
     * Shows popup.
     */
    _showPopup()
    {
        console.log('todo - popup');
    }

    /**
     * Hide popup.
     */
    _hidePopup()
    {
        console.log('todo - hide');
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
        this._text.content = aPass.model.get('name');
        this.update();
    }

    /**
     * Handle mouse event.
     */
    _handleMouseEvent(event)
    {
        switch (event.type)
        {
            case 'mouseenter':
            {
                this._timerEvent = setTimeout(this._showPopup, this._HOVERTIME);
                break;
            }

            case 'mouseleave':
            {
                this._hidePopup();
                clearTimeout(this._timerEvent);
                break;
            }

            default:
            {
                this._hidePopup();
                clearTimeout(this._timerEvent);
                paper.handleMouseEvent(event);
            }
        }
    }
}

export default BaseItem;