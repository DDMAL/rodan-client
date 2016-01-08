import Radio from 'backbone.radio';
import paper from 'paper';

import Configuration from '../../Configuration';
import Events from '../../Shared/Events';
import ConnectionItem from './Items/ConnectionItem';
import InputPortItem from './Items/InputPortItem';
import LineItem from './Items/LineItem';
import OutputPortItem from './Items/OutputPortItem';
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
        this._multipleSelectionKey = null;
        this._line = null;
        this._selectedItems = {};
        this._selectingMultiple = false;
        this._selectedOutputPortItem = null;

        this._STATES = {
            IDLE: 0,
            GRABBED_WORKFLOWJOBITEMS: 1,
            MOVING_WORKFLOWJOBITEMS: 2,
            CREATING_CONNECTION: 3
        };
        this._state = this._STATES.IDLE;

        this._zoomMin = Configuration.WORKFLOWBUILDER.ZOOM_MIM;
        this._zoomMax = Configuration.WORKFLOWBUILDER.ZOOM_MAX;
        this._zoomRate = Configuration.WORKFLOWBUILDER.ZOOM_RATE;

        paper.install(window);
        paper.setup(aCanvasElementId);
        paper.handleMouseEvent = aData => this._handleEvent(aData);
        
        this._initializeGlobalTool();
        this._initializeRadio();
        this._createSegments();
        this._setMultipleSelectionKey();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Sets key for multiple selections.
     */
    _setMultipleSelectionKey()
    {
        switch (Configuration.OS)
        {
            case "Windows":
            {
                this._multipleSelectionKey = "control";
                break;
            }

            case "MacOS":
            {
                this._multipleSelectionKey = "command";
                break;
            }

            case "Linux":
            {
                this._multipleSelectionKey = "control";
                break;
            }

            case "UNIX":
            {
                this._multipleSelectionKey = "control";
                break;
            }

            default:
            {
                this._multipleSelectionKey = "control";
                break;
            }
        }
    }

    /**
     * Create segment definitions.
     */
    _createSegments()
    {
        var canvasWidth = paper.view.viewSize.width;
        var canvasHeight = paper.view.viewSize.height;
        var workflowJobItemWidth = paper.view.viewSize.width * Configuration.WORKFLOWBUILDER.WORKFLOWJOB_WIDTH;
        var workflowJobItemHeight = paper.view.viewSize.height * Configuration.WORKFLOWBUILDER.WORKFLOWJOB_HEIGHT;
        var portItemWidth = paper.view.viewSize.width * Configuration.WORKFLOWBUILDER.PORT_WIDTH;
        var portItemHeight = paper.view.viewSize.height * Configuration.WORKFLOWBUILDER.PORT_HEIGHT;
        this._segments = {
            workflowJobItem: [
                new paper.Point(0, 0), 
                new paper.Point(workflowJobItemWidth, 0), 
                new paper.Point(workflowJobItemWidth, workflowJobItemHeight), 
                new paper.Point(0, workflowJobItemHeight), 
                new paper.Point(0, 0)
            ],
            portItem: [
                new paper.Point(0, 0), 
                new paper.Point(portItemWidth, 0), 
                new paper.Point(portItemWidth, portItemHeight), 
                new paper.Point(0, portItemHeight), 
                new paper.Point(0, 0)
            ],
            connection: [new paper.Point(0, 0), new paper.Point(1, 0)]
        };
    }

    /**
     * Initialize global tool.
     */
    _initializeGlobalTool()
    {
        this._globalTool = new Tool();
        this._mouseDelta = new paper.Point(0, 0);
        this._grabbedItem = null;
        this._globalTool.onMouseMove = event => this._handleEvent(event);
        this._globalTool.onMouseUp = event => this._handleEvent(event);
        this._globalTool.onMouseDown = event => this._handleEvent(event);
        this._globalTool.onKeyDown = event => this._handleEvent(event);
        this._globalTool.onKeyUp = event => this._handleEvent(event);
    }

    /**
     * Handle mouse event.
     */
    _handleEvent(event)
    {
        if ((event.type === 'keydown' || event.type === 'keyup') && event.key === this._multipleSelectionKey)
        {
            this._selectingMultiple = event.type === 'keydown';
        }

        switch (this._state)
        {
            case this._STATES.IDLE:
            {
                this._handleStateIdle(event);
                break;
            }

            case this._STATES.GRABBED_WORKFLOWJOBITEMS:
            {
                this._handleStateGrabbedWorkflowJobItems(event);
                break;
            }

            case this._STATES.MOVING_WORKFLOWJOBITEMS:
            {
                this._handleStateMovingWorkflowJobItems(event);
                break;
            }

            case this._STATES.CREATING_CONNECTION:
            {
                this._handleStateCreatingConnection(event);
                break;
            }

            case this._STATES.SELECTING_MULTIPLE:
            {
                this._handleStateSelectingMultiple(event);
                break;
            }

            default:
            {
                console.log('TODO - ERROR');
                break;
            }
        }
    }

    /**
     * Handle idle state.
     */
    _handleStateIdle(event)
    {
        if (event.type === 'mousedown')
        {
            if (event.target instanceof WorkflowJobItem)
            {
                if (!this._selectingMultiple)
                {
                    if (!this._isSelected(event.target))
                    {
                        this._clearSelected();
                        this._selectItem(event.target);
                    }
                    this._state = this._STATES.GRABBED_WORKFLOWJOBITEMS;  
                }
                else
                {
                    if (!this._isSelected(event.target))
                    {
                        this._selectItem(event.target);
                    }
                    else
                    {
                        this._unselectItem(event.target);
                    }
                }
            }
            else
            {
                if (!this._selectingMultiple)
                {
                    this._clearSelected();
                }
                if (event.target instanceof OutputPortItem)
                {
                    this._selectedOutputPortItem = event.target;
                    this._state = this._STATES.CREATING_CONNECTION; 
                }
                else
                {
                    this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, {});
                }
            }
        }
    }

    /**
     * Handle grabbed workflowjobitem state.
     */
    _handleStateGrabbedWorkflowJobItems(event)
    {
        if (event.type === 'mousemove')
        {
            this._state = this._STATES.MOVING_WORKFLOWJOBITEMS;
        }
        else if (event.type === 'mouseup')
        {
            this._clearSelected();
            this._selectItem(event.target);
            this._state = this._STATES.IDLE;
        }
    }

    /**
     * Handle moving workflowjobitem state.
     */
    _handleStateMovingWorkflowJobItems(event)
    {
        if (event.type === 'mousemove')
        {
            for (var itemIndex in this._selectedItems)
            {
                var item = this._selectedItems[itemIndex];
                item.move(event.delta);
            }
        }
        else if (event.type === 'mouseup')
        {
            // We've let go, so go idle and save the positions.
            this._state = this._STATES.IDLE;
            for (var itemIndex in this._selectedItems)
            {
                var item = this._selectedItems[itemIndex];
                var object = {workflowjob: item._associatedModel,
                              x: item.position.x / paper.view.zoom / paper.view.size.width,
                              y: item.position.y / paper.view.zoom / paper.view.size.height};
                this.rodanChannel.request(Events.REQUEST__WORKFLOWJOB_SAVE_COORDINATES, object);
            }
        }
    }

    /**
     * Handle creating connection state.
     */
    _handleStateCreatingConnection(event)
    {
        if (event.type === 'mouseup')
        {
            if (event.target instanceof InputPortItem && !event.target.hasConnectionItem())
            {
                this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ADD_CONNECTION, {inputport: event.target._associatedModel, 
                                                                                           outputport: this._selectedOutputPortItem._associatedModel});
            }
            this._selectedOutputPortItem = null;
            this._state = this._STATES.IDLE;

            // Destroy our temp line.
            if (this._line)
            {
                this._line.remove();
                this._line = null;
            }
        }
        else if (event.type === 'mousemove')
        {
            // If line hasn't been created, create it.
            if (this._line === null)
            {
                var startPoint = new Point(this._selectedOutputPortItem.position.x, this._selectedOutputPortItem.bounds.bottom);
                this._line = new LineItem({segments: this._segments.connection, startPoint: startPoint});
                paper.view.draw();
            }

            // Update end point to one pixel ABOVE the mouse pointer. This ensures that the next click event does NOT register
            // the line as the target.
            var adjustedPoint = new Point(event.point.x, event.point.y - 1);
            this._line.setEndPoint(adjustedPoint);
        }
    }

    /**
     * Selects the given item.
     */
    _selectItem(item)
    {
        this._selectedItems[item.id] = item;
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWJOB_SELECTED, {workflowjob: item._associatedModel});
        item.setHighlight(true);
    }

    /**
     * Unselects the given item.
     */
    _unselectItem(item)
    {
        delete this._selectedItems[item.id];
        item.setHighlight(false);
    }

    /**
     * Clears selection.
     */
    _clearSelected()
    {
        for (var itemIndex in this._selectedItems)
        {
            var item = this._selectedItems[itemIndex];
            this._unselectItem(item);
        }
        this._selectedItems = {}; // TODO memory leak? 
    }

    /**
     * Return true iff item is selected.
     */
    _isSelected(item)
    {
        return this._selectedItems.hasOwnProperty(item.id);
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

        // GUI commands.
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB, options => this._handleCommandAddWorkflowJobItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION, aReturn => this._handleCommandAddConnection(aReturn));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT, aReturn => this._handleCommandAddInputPortItem(aReturn));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT, aReturn => this._handleCommandAddOutputPortItem(aReturn));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_INPUTPORT, aReturn => this._handleCommandDeleteInputPortItem(aReturn));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_OUTPUTPORT, aReturn => this._handleCommandDeleteOutputPortItem(aReturn));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOB, options => this._handleCommandDeleteWorkflowJobItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_IN, () => this._handleCommandZoomIn());
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_OUT, () => this._handleCommandZoomOut());
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_RESET, () => this._handleCommandZoomReset());
    }

    /**
     * Handle add.
     */
    _handleCommandAddWorkflowJobItem(options)
    {
        var item = this._createWorkflowJobItem(options.workflowjob);

        // Set position if coordinates provided.
        var position = new paper.Point(paper.view.size.width / 2,
                                       paper.view.size.height / 2);
        if (options.hasOwnProperty('x'))
        {
            position.x = options.x * paper.view.size.width;
        }
        if (options.hasOwnProperty('y'))
        {
            position.y = options.y * paper.view.size.height;
        }
        item.setPosition(position);
        
        paper.view.draw();
    }

    /**
     * Handle add input port item.
     */
    _handleCommandAddInputPortItem(aReturn)
    {
        this._createInputPortItem(aReturn.workflowjob, aReturn.inputport);
        aReturn.workflowjob.paperItem.update();
        paper.view.draw();
    }

    /**
     * Handle add output port item.
     */
    _handleCommandAddOutputPortItem(aReturn)
    {
        this._createOutputPortItem(aReturn.workflowjob, aReturn.outputport);
        aReturn.workflowjob.paperItem.update();
        paper.view.draw();
    }

    /**
     * Handle delete input port item.
     */
    _handleCommandDeleteInputPortItem(aReturn)
    {
        aReturn.workflowjob.paperItem.deleteInputPortItem(aReturn.inputport.paperItem);
        aReturn.inputport.paperItem.destroy();
        paper.view.draw();
    }

    /**
     * Handle delete output port item.
     */
    _handleCommandDeleteOutputPortItem(aReturn)
    {
        aReturn.workflowjob.paperItem.deleteOutputPortItem(aReturn.outputport.paperItem);
        aReturn.outputport.paperItem.destroy();
        paper.view.draw();
    }

    /**
     * Handle delete WorkflowJobItem.
     */
    _handleCommandDeleteWorkflowJobItem(options)
    {
        options.workflowjob.paperItem.destroy();
        paper.view.draw();
    }

    /**
     * Handle connection add.
     */
    _handleCommandAddConnection(aReturn)
    {
        this._createConnectionItem(aReturn.connection, aReturn.inputport, aReturn.outputport);
        paper.view.draw();
    }

    /**
     * Handle zoom in.
     */
    _handleCommandZoomIn()
    {
        paper.view.zoom = paper.view.zoom + this._zoomRate < this._zoomMax ? paper.view.zoom + this._zoomRate : this._zoomMax;
        paper.view.draw();
    }

    /**
     * Handle zoom out.
     */
    _handleCommandZoomOut()
    {
        paper.view.zoom = paper.view.zoom - this._zoomRate > this._zoomMin ? paper.view.zoom - this._zoomRate : this._zoomMin;
        paper.view.draw();
    }

    /**
     * Handle zoom reset.
     */
    _handleCommandZoomReset()
    {
        paper.view.zoom = 1;
        paper.view.draw();
    }

    /**
     * Creates a workflow job item.
     */
    _createWorkflowJobItem(model)
    {
        model.paperItem = new WorkflowJobItem({segments: this._segments.workflowJobItem, model: model, text: true});
        model.paperItem.update();
        return model.paperItem;
    }

    /**
     * Creates an input port item for the associated workflow job.
     */
    _createInputPortItem(aWorkflowJob, aModel)
    {
        aModel.paperItem = new InputPortItem({segments: this._segments.portItem, model: aModel});
        aWorkflowJob.paperItem.addInputPortItem(aModel.paperItem);
    }

    /**
     * Creates an output port item for the associated workflow job.
     */
    _createOutputPortItem(aWorkflowJob, aModel)
    {
        aModel.paperItem = new OutputPortItem({segments: this._segments.portItem, model: aModel});
        aWorkflowJob.paperItem.addOutputPortItem(aModel.paperItem);
    }

    /**
     * Creates a connection.
     */
    _createConnectionItem(aModel, aInputPort, aOutputPort)
    {
        aModel.paperItem = new ConnectionItem({segments: this._segments.connection,
                                                     model: aModel, 
                                                     inputPort: aInputPort, 
                                                     outputPort: aOutputPort});

        // Associate the ports with the connection.
        aInputPort.paperItem.setConnectionItem(aModel.paperItem);
        aOutputPort.paperItem.addConnectionItem(aModel.paperItem);
    }
}

export default WorkflowBuilder;