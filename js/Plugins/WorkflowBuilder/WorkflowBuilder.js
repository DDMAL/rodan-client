import Radio from 'backbone.radio';
import paper from 'paper';

import Configuration from '../../Configuration';
import ConnectionItem from './Items/ConnectionItem';
import Environment from '../../Shared/Environment';
import Events from '../../Shared/Events';
import InputPortItem from './Items/InputPortItem';
import ItemController from './ItemController';
import OutputPortItem from './Items/OutputPortItem';
import { drawGrid} from './Utilities/PaperUtilities';
import WorkflowJobGroupItem from './Items/WorkflowJobGroupItem';
import WorkflowJobItem from './Items/WorkflowJobItem';

/**
 * Main WorkflowBuilder class.
 *
 * Grid code by: Nicholas Kyriakides(@nicholaswmin, nik.kyriakides@gmail.com)
 * ---
 * Draws a grid on the current viewport
 * - If grid already exists, it removes and redraws it
 *
 * @param  {Number} cellSize - Size of each cell in pixels
 *
 * Author:
 * - Nicholas Kyriakides(@nicholaswmin, nik.kyriakides@gmail.com)
 *
 * License:
 * - MIT
 * ---
 */
class WorkflowBuilder
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize the workspace.
     * The element associated with the canvas ID MUST be available at this time.
     */
    initialize(canvasElementId)
    {        
        this._multipleSelectionKey = Environment.getMultipleSelectionKey();
        this._line = null;
        
        this._zoomRate = Configuration.WORKFLOWBUILDER.ZOOM_RATE;


        this._initializeStateMachine();
        this._initializePaper(canvasElementId);
        this._initializeRadio();
        this._initializeInterface();
        this._initializeGlobalTool();

        this._itemController = new ItemController();
        paper.handleMouseEvent = event => this._itemController.handleMouseEvent(event);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Initializers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_DESTROYED, () => this._handleEventWorkflowBuilderDestroy(), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_IN, () => this._handleRequestZoomIn());
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_OUT, () => this._handleRequestZoomOut());
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_RESET, () => this._handleRequestZoomReset());
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_CLEAR, () => this._handleRequestClear());
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_HIDE_CONTEXTMENU, () => this._handleRequestHideContextMenu());
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_SHOW_CONTEXTMENU, (options) => this._handleRequestShowContextMenu(options));
    }

    /**
     * Initialize state machine.
     */
    _initializeStateMachine()
    {
        this._STATES = {
            IDLE: 0,
            MOUSE_DOWN: 1,
            MOUSE_UP: 2,
            DRAWING_LINE: 3
        };
        this._firstEntry = false;
        this._setState(this._STATES.IDLE);
    }

    /**
     * Initialize global tool.
     */
    _initializeGlobalTool()
    {
        paper.tool = new Tool();
        paper.tool.onMouseMove = event => this._handleEvent(event);
        paper.tool.onMouseUp = event => this._handleEvent(event);
        paper.tool.onMouseDown = event => this._handleEvent(event);
        paper.tool.onKeyDown = event => this._handleEventKeyDown(event);
        paper.tool.onKeyUp = event => this._handleEventKeyUp(event);
    }

    /**
     * Initialize global interface for GUI.
     */
    _initializeInterface()
    {
        var canvas = paper.view.element;
        canvas.oncontextmenu = function() {return false;};
    }

    /**
     * Initialize paper.
     */
    _initializePaper(canvasElementId)
    {
        paper.install(window);
        paper.setup(canvasElementId);
        paper.view.onFrame = (event) => this._handleFrame(event);
        this.drawGrid = drawGrid;
        this.drawGrid(Configuration.WORKFLOWBUILDER.GRID_DIMENSION, paper);
        this._handleRequestZoomReset();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Events and state machine
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle state. This is frame driven.
     */
    _handleFrame(event)
    {
       // this._handleState();
        paper.view.draw();
    }

    /**
     * Sets state.
     */
    _setState(state)
    {
        this._state = state;
        this._firstEntry = true;
    }

    /**
     * Handle ToolEvent.
     */
    _handleEvent(toolEvent)
    {
        switch (this._state)
        {
            case this._STATES.IDLE:
            {
                this._handleStateIdle(toolEvent);
                break;
            }

            case this._STATES.MOUSE_DOWN:
            {
                this._handleStateMouseDown(toolEvent);
                break;
            }

            case this._STATES.MOUSE_UP:
            {
                this._handleStateMouseUp(toolEvent);
                break;
            }

            case this._STATES.DRAWING_LINE:
            {
                this._handleStateDrawingLine(toolEvent);
                break;
            }

            default:
            {
                console.log('unknown state');
                break;
            }
        }
    }

    /**
     * Handle state idle.
     */
    _handleStateIdle(event)
    {
        if (this._firstEntry)
        {
            this._firstEntry = false;
        }

        if (event.type === 'mousedown')
        {
            this._setState(this._STATES.MOUSE_DOWN);
        } 
    }

    /**
     * Handle state mouse down.
     */
    _handleStateMouseDown(event)
    {
        if (this._firstEntry)
        {
            this._firstEntry = false;
            if (!this._itemController.getMouseOverItem())
            {
                this._handleRequestHideContextMenu();
                this._itemController.clearSelected();
            }
        }

        if (event.type === 'mousemove')
        {
            if (this._itemController.getOutputPortItemForConnection() !== null)
            {
                this._setState(this._STATES.DRAWING_LINE);
            }
            else
            {
                this._itemController.moveSelectedItems(event.delta);
            }
        }
        else if (event.type === 'mouseup')
        {
            this._setState(this._STATES.MOUSE_UP);
            this._itemController.saveSelectedItemPositions();
        }
    }

    /**
     * Handle state mouse up.
     */
    _handleStateMouseUp(event)
    {
        if (this._firstEntry)
        {
            this._firstEntry = false;
            this._itemController.saveSelectedItemPositions();
        }
        this._setState(this._STATES.IDLE);
    }

    /**
     * Handle state drawing line.
     */
    _handleStateDrawingLine(event)
    {
        if (this._firstEntry)
        {
            this._firstEntry = false;
            if (this._line === null)
            {
                var item = this._itemController.getOutputPortItemForConnection();
                var startPoint = new Point(item.position.x, item.bounds.bottom);
                this._line = this._itemController.createLineItem(startPoint);
            }
        }

        if (event.type === 'mousemove')
        {
            // Update end point to one pixel ABOVE the mouse pointer. This ensures that the next click event does NOT register
            // the line as the target.
            var adjustedPoint = new Point(event.point.x, event.point.y - 1);
            this._line.setEndPoint(adjustedPoint);
        }
        else if (event.type === 'mouseup')
        {
            var overItem = this._itemController.getMouseOverItem();
            if (overItem instanceof InputPortItem && !overItem.hasConnectionItem())
            {
                var outputPortItem = this._itemController.getOutputPortItemForConnection();
                this._itemController.createConnection(outputPortItem, overItem);
            }

            // Reset.
            this._state = this._STATES.IDLE;
            if (this._line)
            {
                this._line.remove();
                this._line = null;
            }
            this._itemController.clearSelected();
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Input event handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle event key down.
     */
    _handleEventKeyDown(event)
    {
        if (event.key === this._multipleSelectionKey)
        {
            this._itemController.setSelectingMultiple(true);
        }
    }

    /**
     * Handle event key up.
     */
    _handleEventKeyUp(event)
    {
        if (event.key === this._multipleSelectionKey)
        {
            this._itemController.setSelectingMultiple(false);
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle zoom in.
     */
    _handleRequestZoomIn()
    {
        var zoom = paper.view.zoom + Configuration.WORKFLOWBUILDER.ZOOM_RATE;
        paper.view.zoom = zoom < Configuration.WORKFLOWBUILDER.ZOOM_MAX ? zoom : Configuration.WORKFLOWBUILDER.ZOOM_MAX;
    }

    /**
     * Handle zoom out.
     */
    _handleRequestZoomOut()
    {
        var zoom = paper.view.zoom - Configuration.WORKFLOWBUILDER.ZOOM_RATE;
        paper.view.zoom = zoom > Configuration.WORKFLOWBUILDER.ZOOM_MIN ? zoom : Configuration.WORKFLOWBUILDER.ZOOM_MIN;    
    }

    /**
     * Handle zoom reset.
     */
    _handleRequestZoomReset()
    {
        paper.view.zoom = Configuration.WORKFLOWBUILDER.ZOOM_INITIAL;
    }

    /**
     * Handle request clear.
     */
    _handleRequestClear()
    {
        paper.project.clear();
    }
    /**
     * Hides the context menu.
     */
    _handleRequestHideContextMenu()
    {
        $("#menu-context").hide();
    }

    /**
     * Handle show context menu.
     */
    _handleRequestShowContextMenu(options)
    {
        $('#menu-context').empty();
        for (var index in options.items)
        {
            var listItemData = options.items[index];
            var callOptions = listItemData.options ? listItemData.options : {};
            var label = listItemData.label;
            var radiorequest = listItemData.radiorequest;

            var functionCall = (event) => {
                var data = $(event.currentTarget).data('radio');
                this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_HIDE_CONTEXTMENU);
                this.rodanChannel.request(data.request, data.options);
            };

            var anchor = $('<a>' + label + '</a>');
            anchor.data('radio', {request: radiorequest, options: callOptions});
            anchor.click(functionCall);
            $('#menu-context').append($('<li></li>').append(anchor));
        }
        $('#menu-context').css('top', options.mouseevent.event.y);
        $('#menu-context').css('left', options.mouseevent.event.x);
        $('#menu-context').show();
    }
}

export default WorkflowBuilder;