import Radio from 'backbone.radio';
import paper from 'paper';

import Configuration from '../../Configuration';
import ConnectionItem from './Items/ConnectionItem';
import Environment from '../../Shared/Environment';
import Events from '../../Shared/Events';
import InputPortItem from './Items/InputPortItem';
import ItemController from './ItemController';
import OutputPortItem from './Items/OutputPortItem';
import WorkflowJobGroupItem from './Items/WorkflowJobGroupItem';
import WorkflowJobItem from './Items/WorkflowJobItem';

/**
 * Main WorkflowBuilder class.
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
    initialize(aCanvasElementId)
    {        
        this._multipleSelectionKey = Environment.getMultipleSelectionKey();
        this._line = null;
        
        this._zoomMin = Configuration.WORKFLOWBUILDER.ZOOM_MIM;
        this._zoomMax = Configuration.WORKFLOWBUILDER.ZOOM_MAX;
        this._zoomRate = Configuration.WORKFLOWBUILDER.ZOOM_RATE;

        paper.install(window);
        paper.setup(aCanvasElementId);

        this._itemController = new ItemController();
        paper.handleMouseEvent = event => this._itemController.handleMouseEvent(event);
        
        this._initializeGlobalTool();
        this._initializeRadio();

        // State info.
        this._STATES = {
            IDLE: 0,
            MOUSE_DOWN: 1,
            MOUSE_UP: 2,
            DRAWING_LINE: 3
        };
        this._firstEntry = false;
        this._setState(this._STATES.IDLE);
        paper.view.onFrame = (event) => this._handleFrame(event);
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
        paper.view.zoom = paper.view.zoom + this._zoomRate < this._zoomMax ? paper.view.zoom + this._zoomRate : this._zoomMax;
    }

    /**
     * Handle zoom out.
     */
    _handleRequestZoomOut()
    {
        paper.view.zoom = paper.view.zoom - this._zoomRate > this._zoomMin ? paper.view.zoom - this._zoomRate : this._zoomMin;
    }

    /**
     * Handle zoom reset.
     */
    _handleRequestZoomReset()
    {
        paper.view.zoom = 1;
    }

    /**
     * Handle request clear.
     */
    _handleRequestClear()
    {
        paper.project.clear();
    }
}

export default WorkflowBuilder;