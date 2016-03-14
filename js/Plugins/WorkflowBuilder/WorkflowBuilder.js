import Radio from 'backbone.radio';
import paper from 'paper';
import { drawGrid } from './Utilities/PaperUtilities';
import BaseItem from './Items/BaseItem';
import Configuration from '../../Configuration';
import ConnectionItem from './Items/ConnectionItem';
import Environment from '../../Shared/Environment';
import Events from '../../Shared/Events';
import GUI_EVENTS from './Shared/Events';
import InputPortItem from './Items/InputPortItem';
import ItemController from './Controllers/ItemController';
import LayoutViewWorkflowBuilder from './Views/LayoutViewWorkflowBuilder';
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
     * Constructor.
     */
    constructor(options)
    {
        this._workflow = null;
    }

    /**
     * Initialize the workspace.
     * The element associated with the canvas ID MUST be available at this time.
     */
    initialize(workflow)
    { 
        this._oldMouseEvent = window.MouseEvent; // FIX: paper.js stupidly redefines 
        this._workflow = workflow;
        this._initializeView();
        this._initializeStateMachine();
        this._initializePaper('canvas-workspace');
        this._initializeRadio();
        this._initializeInterface();
        this._initializeGlobalTool();
        this._initializeGui();
    }

    /**
     * Return workflow.
     */
    getWorkflow()
    {
        return this._workflow;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Initializers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize view.
     */
    _initializeView()
    {
        var view = new LayoutViewWorkflowBuilder({model: this.getWorkflow()});
        Radio.channel('rodan').request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: view});
        this._menuItems = [{label: 'Edit Name/Description', radiorequest: Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOW_VIEW, options: {workflow: this.getWorkflow()}},
                           {label: 'Add Job', radiorequest: Events.REQUEST__WORKFLOWBUILDER_SHOW_JOBCOLLECTION_VIEW, options: {workflow: this.getWorkflow()}},
                           {label: 'Import Workflow', radiorequest: Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWCOLLECTION_VIEW, options: {workflow: this.getWorkflow()}},
                           {label: 'Run', radiorequest: Events.REQUEST__WORKFLOWBUILDER_CREATE_WORKFLOWRUN, options: {workflow: this.getWorkflow()}}]; 
    }

    /**
     * Initialize GUI.
     */
    _initializeGui()
    {
        BaseItem.clearMap();
        this._multipleSelectionKey = Environment.getMultipleSelectionKey();
        this._line = null;
        this._zoomRate = Configuration.WORKFLOWBUILDER.ZOOM_RATE;
        this._itemController = new ItemController();
        paper.handleMouseEvent = event => this._itemController.handleMouseEvent(event);
    }

    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.on(Events.EVENT__MODEL_SYNC, options => this._handleEventModelSync(options));

        this.guiChannel = Radio.channel('rodan-client_gui');
        this.guiChannel.on(GUI_EVENTS.EVENT__WORKFLOWBUILDER_GUI_DESTROY, () => this._handleGuiDestroy());
        this.guiChannel.reply(GUI_EVENTS.REQUEST__WORKFLOWBUILDER_GUI_GET_WORKFLOW, () => this.getWorkflow());
        this.guiChannel.reply(GUI_EVENTS.REQUEST__WORKFLOWBUILDER_GUI_HIDE_CONTEXTMENU, () => this._handleRequestHideContextMenu());
        this.guiChannel.reply(GUI_EVENTS.REQUEST__WORKFLOWBUILDER_GUI_SHOW_CONTEXTMENU, (options) => this._handleRequestShowContextMenu(options));
        this.guiChannel.reply(GUI_EVENTS.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_IN, () => this._handleRequestZoomIn());
        this.guiChannel.reply(GUI_EVENTS.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_OUT, () => this._handleRequestZoomOut());
        this.guiChannel.reply(GUI_EVENTS.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_RESET, () => this._handleRequestZoomReset());
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
        this.drawGrid(Configuration.WORKFLOWBUILDER.GRID, paper);
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
        BaseItem.updateItems();
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
                
                // If right-click, open context menu.
                if (event.event.button === 2)
                {
                    this.guiChannel.request(GUI_EVENTS.REQUEST__WORKFLOWBUILDER_GUI_SHOW_CONTEXTMENU,
                                              {items: this._menuItems, top: event.event.y, left: event.event.x});
                }
            }
        }

        if (event.type === 'mousemove')
        {
            if (this._itemController.getOutputPortItemForConnection() !== null)
            {
                this._setState(this._STATES.DRAWING_LINE);
            }
            else if (this._itemController.getSelectedCount() > 0)
            {
                this._itemController.moveSelectedItems(event.delta);
            }
            else
            {
                // TODO translate canvas
               // BUG HERE WHEN I TRY TO TRANSLATE CANVAS
                //this._itemController.moveSelectedItems(event.delta);
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
            if (overItem instanceof InputPortItem && !overItem.isSatisfied())
            {
                var outputPortItem = this._itemController.getOutputPortItemForConnection();
                this._itemController.createConnection(outputPortItem, overItem, this.getWorkflow());
            }

            // Reset.
            this._state = this._STATES.IDLE;
            if (this._line)
            {
                this._line.remove();
                this._line.destroy();
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
     * Handle GUI destroy.
     */
    _handleGuiDestroy()
    {
        BaseItem.clearMap();
        window.MouseEvent = this._oldMouseEvent;
    }

    /**
     * Handle event model sync.
     *
     * This guarantees that the WorkflowBuilder always has the latest version of the Workflow.
     */
    _handleEventModelSync(options)
    {
        if (options.model && options.model.constructor.name === 'Workflow')
        {
            this._workflow = options.model;
        }
    }

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
            var channel = listItemData.channel ? listItemData.channel : 'rodan';
            var radiorequest = listItemData.radiorequest;

            var functionCall = (event) => {
                var data = $(event.currentTarget).data('radio');
                this.guiChannel.request(GUI_EVENTS.REQUEST__WORKFLOWBUILDER_GUI_HIDE_CONTEXTMENU);
                Radio.channel(channel).request(data.request, data.options);
            };

            var anchor = $('<a>' + label + '</a>');
            anchor.data('radio', {request: radiorequest, options: callOptions});
            anchor.click(functionCall);
            $('#menu-context').append($('<li></li>').append(anchor));
        }
        $('#menu-context').css('top', options.top);
        $('#menu-context').css('left', options.left);
        $('#menu-context').show();
    }
}

export default WorkflowBuilder;