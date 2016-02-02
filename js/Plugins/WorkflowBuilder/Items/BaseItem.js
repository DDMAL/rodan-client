import $ from 'jquery';
import Radio from 'backbone.radio';
import paper from 'paper';

import Configuration from '../../../Configuration';
import Events from '../../../Shared/Events';

let itemMap = null;

/**
 * Base Item in WorkflowBuilder
 */
class BaseItem extends paper.Path
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC STATIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Returns associated item given an ID.
     */
    static getAssociatedItem(id)
    {
        if (!itemMap)
        {
            itemMap = {};
        }
        return itemMap[id];
    }

    /**
     * Associates given item with ID.
     */
    static associateItemWithID(item, id)
    {
        if (!itemMap)
        {
            itemMap = {};
        }
        itemMap[id] = item;
    }

    /**
     * Removes item from map witht he provided ID.
     */
    static removeItemFromMap(id)
    {
        if (!itemMap)
        {
            itemMap = {};
        }
        if (itemMap[id])
        {
            delete itemMap[id];
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(options)
    {
        super(options.segments);
        this._initializeRadio(options);
        this._initializeAppearance(options);
        this._initializeModelBinding(options);
        this._initializeText(options);
        this._initializeInputEventHandlers(options);
    }

    /**
     * Return true iff this item can be moved by itself.
     */
    isMoveable()
    {
        return true;
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

    /**
     * Set visibility.
     */
    setVisible(visible)
    {
        this.visible = visible;
        this._text.visible = this._useText && this.visible;
        this.update();
    }

    /**
     * Destroy.
     */
    destroy()
    {
        BaseItem.removeItemFromMap(this._modelId);
        this._text.remove();
        this.remove();
    }

    /**
     * Updates the position to the server.
     */
    updatePositionToServer()
    {
        // If an ID exists, we know it exists on the server, so we can patch it.
        // Else if we haven't tried saving it before, do it. This should create
        // a new model on the server.
        if (this._coordinateSetModel.id || !this._coordinateSetSaveAttempted)
        {
            this._coordinateSetSaveAttempted = true;
            var x = this.position.x / paper.view.zoom / paper.view.size.width;
            var y = this.position.y / paper.view.zoom / paper.view.size.height;
            var coordinates = {x: x, y: y};
            this._coordinateSetModel.set({'data': coordinates});
            this._coordinateSetModel.save(); 
        }
    }

    /**
     * Gets coordinates from server.
     */
    loadCoordinates()
    {
        // Create query.
        var query = {};
        var model = this._getModel();
        query[this.coordinateSetInfo['url']] = model.id;
        query['user_agent'] = Configuration.USER_AGENT;

        // Create callback.
        var callback = (coordinates) => this._handleCoordinateLoadSuccess(coordinates);

        // Create model and fetch.
        var name = this.coordinateSetInfo['class'];
        var options = {};
        options[this.coordinateSetInfo['url']] = model.get('url');
        options['user_agent'] = Configuration.USER_AGENT;
        this._coordinateSetModel = new name(options);
        this._coordinateSetModel.fetch({data: query, success: callback, error: callback});
    }

    /**
     * Returns associated model ID.
     */
    getModelID()
    {
        return this._modelId;
    }

    /**
     * Highlights this object.
     */
    setHighlight(highlighted)
    {
        this.strokeColor = highlighted ? Configuration.WORKFLOWBUILDER.STROKE_COLOR_SELECTED : Configuration.WORKFLOWBUILDER.STROKE_COLOR;
        this.strokeWidth = highlighted ? Configuration.WORKFLOWBUILDER.STROKE_WIDTH_SELECTED :Configuration.WORKFLOWBUILDER.STROKE_WIDTH;
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
     * Initialize hover.
     */
    _initializeHover(options)
    {
        this._timerEvent = null;
        this._popup = new paper.PointText(new paper.Point(0, 0));
    }

    /**
     * Initialize appearance.
     */
    _initializeAppearance(options)
    {
        this.strokeColor = Configuration.WORKFLOWBUILDER.STROKE_COLOR;
        this.strokeJoin = 'round';
        this.strokeWidth = Configuration.WORKFLOWBUILDER.STROKE_WIDTH;
        this.fillColor = Configuration.WORKFLOWBUILDER.FILL_COLOR;
    }

    /**
     * Initialize model binding.
     */
    _initializeModelBinding(options)
    {
        this._modelId = options.model ? options.model.id : null;
        BaseItem.associateItemWithID(this, this._modelId);

        // Getter event for the model. Need to set this.
        this.getModelEvent = null;

        // This is the coordinate set model settings. Should be overridden if want to save.
        this.coordinateSetInfo = null;
        this._coordinateSetModel = null;
        this._coordinateSetSaveAttempted = false;
    }

    /**
     * Initialize event handlers.
     */
    _initializeInputEventHandlers(options)
    {
        this.onMouseDown = event => this._handleMouseEvent(event);
        this.onMouseUp = event => this._handleMouseEvent(event);
        this.onClick = event => this._handleMouseEvent(event);
        this.onMouseEnter = event => this._handleMouseEvent(event);
        this.onMouseLeave = event => this._handleMouseEvent(event);
        this._text.onMouseDown = event => this._handleMouseEvent(event);
        this._text.onMouseUp = event => this._handleMouseEvent(event);
        this._text.onClick = event => this._handleMouseEvent(event);
        this._text.onMouseEnter = event => this._handleMouseEvent(event);
        this._text.onMouseLeave = event => this._handleMouseEvent(event);
    }

    /**
     * Initialize text.
     */
    _initializeText(options)
    {
        this._useText = (options.hasOwnProperty('text') && options.text === true);
        this._text = new paper.PointText(new paper.Point(0, 0));
        this._text.justification = 'center';
        this._text.fillColor = Configuration.WORKFLOWBUILDER.STROKE_COLOR;
        this._text.fontSize = Configuration.WORKFLOWBUILDER.FONT_SIZE;
        this._text.content = '';
        this._text.position = this.bounds.center;
        this.addChild(this._text);
        if (options.model)
        {
            this._text.content = options.model.get('name');
        }
    }

    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.on(Events.EVENT__MODEL_HASCHANGED, aPass => this._handleEventModelUpdated(aPass));
    }

    /**
     * Gets the associated model.
     */
    _getModel()
    {
        if (this.getModelEvent !== null)
        {
            return this.rodanChannel.request(this.getModelEvent, {'id': this._modelId});
        }
        return null;
    }

    /**
     * Handle coordinate load success.
     */
    _handleCoordinateLoadSuccess(coordinateSet)
    {
        var coordinates = coordinateSet.get('data');
        if (coordinates)
        {
            this._coordinateSetModel = coordinateSet;
            this.position = new paper.Point(coordinates.x * paper.view.size.width, coordinates.y * paper.view.size.height);
            this.update();
        }
    }

    /**
     * Shows popup.
     */
    _showPopup(event)
    {
        if ($('div#canvas-tooltip'))
        {
            var model = this._getModel();
            if (model)
            {
                var tooltip = $('div#canvas-tooltip');
                tooltip.css('visibility', 'visible');
                tooltip.css('top', event.event.y);
                tooltip.css('left', event.event.x);
                tooltip.text(model.getDescription());
            }
        }
    }

    /**
     * Hide popup.
     */
    _hidePopup()
    {
        if ($('div#canvas-tooltip'))
        {
            $('div#canvas-tooltip').css('visibility', 'hidden');
        }
    }

    /**
     * Handle model update event.
     */
    _handleEventModelUpdated(aPass)
    {
        var model = this._getModel();
        if (aPass.model !== model)
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
        // We do this because paperjs doesn't bubble up events.
        // This line guarantees that events caught by the TEXT actually get to the parent base item.
        event.target = this;

        switch (event.type)
        {
            case 'mouseenter':
            {
                this._timerEvent = setTimeout(() => this._showPopup(event), Configuration.WORKFLOWBUILDER.HOVER_TIME);
                paper.handleMouseEvent(event);
                break;
            }

            case 'mouseleave':
            {
                this._hidePopup();
                clearTimeout(this._timerEvent);
                paper.handleMouseEvent(event);
                break;
            }

            default:
            {
                paper.handleMouseEvent(event);
                break;
            }
        }
    }
}

export default BaseItem;