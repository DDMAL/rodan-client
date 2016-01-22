import $ from 'jquery';
import Radio from 'backbone.radio';
import paper from 'paper';

import Configuration from '../../../Configuration';
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
        this._initializeRadio();
        this._associatedModel = options.model;

        // This is the coordinate set model settings. Should be overridden if want to save.
        this.coordinateSetInfo = null;
        this._coordinateSetModel = null;
        
        // Set appearance parameters.
        this.strokeColor = Configuration.WORKFLOWBUILDER.STROKE_COLOR;
        this.strokeJoin = 'round';
        this.strokeWidth = Configuration.WORKFLOWBUILDER.STROKE_WIDTH;
        this.fillColor = Configuration.WORKFLOWBUILDER.FILL_COLOR;

        // Hover settings.
        this._HOVERTIME = Configuration.WORKFLOWBUILDER.HOVER_TIME;
        this._timerEvent = null;
        this._popup = new paper.PointText(new paper.Point(0, 0));

        // Mouse handlers.
        this.onMouseDown = event => this._handleMouseEvent(event);
        this.onMouseUp = event => this._handleMouseEvent(event);
        this.onClick = event => this._handleMouseEvent(event);
        this.onMouseEnter = event => this._handleMouseEvent(event);
        this.onMouseLeave = event => this._handleMouseEvent(event);

        // Text settings.
        this._useText = (options.hasOwnProperty('text') && options.text === true);
        this._text = new paper.PointText(new paper.Point(0, 0));
        this._text.justification = 'center';
        this._text.fillColor = Configuration.WORKFLOWBUILDER.STROKE_COLOR;
        this._text.fontSize = Configuration.WORKFLOWBUILDER.FONT_SIZE;
        this._text.content = '';
        this._text.position = this.bounds.center;
        this.addChild(this._text);
        this._text.onMouseDown = event => this._handleMouseEvent(event);
        this._text.onMouseUp = event => this._handleMouseEvent(event);
        this._text.onClick = event => this._handleMouseEvent(event);
        this._text.onMouseEnter = event => this._handleMouseEvent(event);
        this._text.onMouseLeave = event => this._handleMouseEvent(event);
        if (this._associatedModel)
        {
            this._text.content = this._associatedModel.get('name');
        }
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
        if (this.hasOwnProperty('_associatedModel') && this._associatedModel !== null)
        {
            if (this._associatedModel.hasOwnProperty('paperItem'))
            {
                this._associatedModel.paperItem = null; 
            }
            this._associatedModel = null; 
        }
        this._text.remove();
        this.remove();
    }

    /**
     * Updates the position to the server.
     */
    updatePositionToServer()
    {
        if (this.coordinateSetInfo !== null)
        {
            var x = this.position.x / paper.view.zoom / paper.view.size.width;
            var y = this.position.y / paper.view.zoom / paper.view.size.height;
            var coordinates = {x: x, y: y};
            if (this._coordinateSetModel === null)
            {
                var name = this.coordinateSetInfo['class'];
                var options = {};
                options[this.coordinateSetInfo['url']] = this._associatedModel.get('url');
                options['data'] = {};
                options['user_agent'] = Configuration.USER_AGENT;
                this._coordinateSetModel = new name(options);
            }
            this._coordinateSetModel.set({'data': coordinates});
            this._coordinateSetModel.save();
        }
    }

    /**
     * Gets coordinates from server.
     */
    loadCoordinates()
    {
        var query = {};
        query[this.coordinateSetInfo['url']] = this._associatedModel.id;
        query['user_agent'] = Configuration.USER_AGENT;
        var callback = (coordinates) => this._handleCoordinateLoadSuccess(coordinates);
        this.rodanChannel.request(this.coordinateSetInfo['collectionLoadEvent'], {query: query, success: callback, error: callback});
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
     * Handle coordinate load success.
     */
    _handleCoordinateLoadSuccess(coordinateSets)
    {
        if (coordinateSets.length > 0)
        {
            this._coordinateSetModel = coordinateSets.at(0);
            var coordinates = this._coordinateSetModel.get('data');
            this.position = new paper.Point(coordinates.x * paper.view.size.width, coordinates.y * paper.view.size.height);
        }
        else
        {
            this.updatePositionToServer();
        }
        this.update();
    }

    /**
     * Shows popup.
     */
    _showPopup(event)
    {
        if ($('div#canvas-tooltip'))
        {
            var tooltip = $('div#canvas-tooltip');
            tooltip.css('visibility', 'visible');
            tooltip.css('top', event.event.y);
            tooltip.css('left', event.event.x);
            tooltip.text(this._associatedModel.getDescription());
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
        if (aPass.model !== this._associatedModel)
        {
            return;
        }
        this._text.content = aPass.model.get('name');
        this.update();
    }

    /**
     * Highlights this object.
     */
    setHighlight(highlighted)
    {
        this.strokeColor = highlighted ? Configuration.WORKFLOWBUILDER.STROKE_COLOR_SELECTED : Configuration.WORKFLOWBUILDER.STROKE_COLOR;
        this.strokeWidth = highlighted ? Configuration.WORKFLOWBUILDER.STROKE_WIDTH_SELECTED :Configuration.WORKFLOWBUILDER.STROKE_WIDTH;
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
                this._timerEvent = setTimeout(() => this._showPopup(event), this._HOVERTIME);
                break;
            }

            case 'mouseleave':
            {
                this._hidePopup();
                clearTimeout(this._timerEvent);
                break;
            }

            case 'click':
            {
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