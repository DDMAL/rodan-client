import Radio from 'backbone.radio';
import paper from 'paper';

import BaseItem from './Items/BaseItem';
import Configuration from '../../Configuration';
import Events from '../../Shared/Events';
import ConnectionItem from './Items/ConnectionItem';
import InputPortItem from './Items/InputPortItem';
import LineItem from './Items/LineItem';
import OutputPortItem from './Items/OutputPortItem';
import WorkflowJobGroupItem from './Items/WorkflowJobGroupItem';
import WorkflowJobItem from './Items/WorkflowJobItem';

import WorkflowJobCoordinateSetCollection from './Collections/WorkflowJobCoordinateSetCollection';
import WorkflowJobGroupCoordinateSetCollection from './Collections/WorkflowJobGroupCoordinateSetCollection';

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
        this.workflowJobCoordinateSetCollection = new WorkflowJobCoordinateSetCollection();
        this.workflowJobGroupCoordinateSetCollection = new WorkflowJobGroupCoordinateSetCollection();
        
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
// PRIVATE METHODS - Initializers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');

        // GUI commands.
        this.rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_DESTROYED, () => this._handleEventWorkflowBuilderDestroy(), this);
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
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_GET_SELECTED_WORKFLOWJOB_IDS, () => this._handleRequestGetSelectedWorkflowJobIDs());
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_HIDE_WORKFLOWJOB, (options) => this._handleRequestHideWorkflowJob(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_SHOW_WORKFLOWJOB, (options) => this._handleRequestShowWorkflowJob(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOBGROUP, (options) => this._handleCommandAddWorkflowJobGroupItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_PORT_ITEMS_WITH_WORKFLOWJOBGROUP, (options) => this._handleRequestPortsWorkflowJobGroupItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOBGROUP, options => this._handleCommandDeleteWorkflowJobGroupItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_CLEAR, () => this._handleRequestClear());
    }

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

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Events and state machine
///////////////////////////////////////////////////////////////////////////////////////
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
        paper.view.draw();
    }

    /**
     * Handle idle state.
     */
    _handleStateIdle(event)
    {
        if (event.type === 'mousedown')
        {
            if (event.target instanceof WorkflowJobItem
                || event.target instanceof WorkflowJobGroupItem)
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
                if (item instanceof WorkflowJobItem || item instanceof WorkflowJobGroupItem)
                {
                    item.updatePositionToServer();
                }
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
                this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ADD_CONNECTION, {inputportid: event.target.getModelID(), 
                                                                                           outputportid: this._selectedOutputPortItem.getModelID()});
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
        item.setHighlight(true);
        if (item instanceof WorkflowJobItem)
        {
            this.rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, {id: item.getModelID()});
        }
        else if (item instanceof WorkflowJobGroupItem)
        {
            this.rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOBGROUP_SELECTED, {id: item.getModelID()});
        }
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

    /**
     * Returns number of selected items.
     */
    _getSelectedCount()
    {
        return Object.keys(this._selectedItems).length;
    }

    /**
     * Returns true iff we can group the selected items.
     */
    _canGroupSelectedItems()
    {
        if (Object.keys(this._selectedItems).length > 1)
        {
            for (var itemIndex in this._selectedItems)
            {
                var item = this._selectedItems[itemIndex];
                if (!(item instanceof WorkflowJobItem))
                {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles WorkflowBuilder destroy event.
     * This will clear the paperjs project.
     */
    _handleEventWorkflowBuilderDestroy()
    {
        paper.project.clear();
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
    }

    /**
     * Handle add WorkflowJobGroupItem.
     */
    _handleCommandAddWorkflowJobGroupItem(options)
    {
        var item = this._createWorkflowJobGroupItem(options.workflowjobgroup);

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
    }

    /**
     * Handle add input port item.
     */
    _handleCommandAddInputPortItem(options)
    {
        this._createInputPortItem(options.workflowjob, options.inputport);
    }

    /**
     * Handle add output port item.
     */
    _handleCommandAddOutputPortItem(options)
    {
        this._createOutputPortItem(options.workflowjob, options.outputport);
    }

    /**
     * Handle delete input port item.
     */
    _handleCommandDeleteInputPortItem(options)
    {
        var workflowJobItem = BaseItem.getAssociatedItem(options.workflowjob.id);
        var inputPortItem = BaseItem.getAssociatedItem(options.inputport.id);
        workflowJobItem.deleteInputPortItem(inputPortItem);
        inputPortItem.paperItem.destroy();
    }

    /**
     * Handle delete output port item.
     */
    _handleCommandDeleteOutputPortItem(options)
    {
        var workflowJobItem = BaseItem.getAssociatedItem(options.workflowjob.id);
        var outputPortItem = BaseItem.getAssociatedItem(options.outputport.id);
        workflowJobItem.deleteOutputPortItem(outputPortItem);
        outputPortItem.destroy();
    }

    /**
     * Handle delete WorkflowJobItem.
     */
    _handleCommandDeleteWorkflowJobItem(options)
    {
        var workflowJobItem = BaseItem.getAssociatedItem(options.workflowjob.id);
        workflowJobItem.destroy();
    }

    /**
     * Handle connection add.
     */
    _handleCommandAddConnection(options)
    {
        this._createConnectionItem(options.connection, options.inputport, options.outputport);
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
     * Handle request for all selected WorkflowJob IDs.
     */
    _handleRequestGetSelectedWorkflowJobIDs()
    {
        var workflowJobs = [];
        for (var itemIndex in this._selectedItems)
        {
            workflowJobs.push(this._selectedItems[itemIndex].getModelID());
        }
        return workflowJobs;
    }

    /**
     * Handle request to hide WorkflowJob.
     */
    _handleRequestHideWorkflowJob(options)
    {
        var workflowJobItem = BaseItem.getAssociatedItem(options.workflowjob.id);
        workflowJobItem.setVisible(false);
    }

    /**
     * Handle request to show WorkflowJob.
     */
    _handleRequestShowWorkflowJob(options)
    {
        var workflowJobItem = BaseItem.getAssociatedItem(options.workflowjob.id);
        workflowJobItem.setVisible(true);
    }

    /**
     * Associates the given port items with the given WorkflowJobGroup.
     */
    _handleRequestPortsWorkflowJobGroupItem(options)
    {
        var workflowJobGroupItem = BaseItem.getAssociatedItem(options.workflowjobgroup.id);
        for (var index in options.inputports)
        {
            var inputPortItem = BaseItem.getAssociatedItem(options.inputports[index].id);
            inputPortItem.disassociate();
            workflowJobGroupItem.addInputPortItem(inputPortItem);
        }

        for (var index in options.outputports)
        {
            var outputPortItem = BaseItem.getAssociatedItem(options.outputports[index].id);
            outputPortItem.disassociate();
            workflowJobGroupItem.addOutputPortItem(outputPortItem);
        }
    }

    /**
     * Handle request delete WorkflowJobGroupItem.
     */
    _handleCommandDeleteWorkflowJobGroupItem(options)
    {
        var workflowJobGroupItem = BaseItem.getAssociatedItem(options.workflowjobgroup.id);
        workflowJobGroupItem.destroy();
        paper.view.draw();
    }

    /**
     * Handle request clear.
     */
    _handleRequestClear()
    {
        paper.project.clear();
        paper.view.draw();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Creates a workflow job item.
     */
    _createWorkflowJobItem(model)
    {
        var item = new WorkflowJobItem({segments: this._segments.workflowJobItem, model: model, text: true});
        return item;
    }
    /**
     * Creates a WorkflowJobGroupItem.
     */
    _createWorkflowJobGroupItem(model)
    {
        var item = new WorkflowJobGroupItem({segments: this._segments.workflowJobItem, model: model, text: true});
        return item;
    }

    /**
     * Creates an input port item for the associated workflow job.
     */
    _createInputPortItem(workflowJob, model)
    {
        var workflowJobItem = BaseItem.getAssociatedItem(workflowJob.id);
        var item = new InputPortItem({segments: this._segments.portItem, model: model, workflowjobitem: workflowJobItem});
        workflowJobItem.addInputPortItem(item);
    }

    /**
     * Creates an output port item for the associated workflow job.
     */
    _createOutputPortItem(workflowJob, model)
    {
        var workflowJobItem = BaseItem.getAssociatedItem(workflowJob.id);
        var item = new OutputPortItem({segments: this._segments.portItem, model: model, workflowjobitem: workflowJobItem});
        workflowJobItem.addOutputPortItem(item);
    }

    /**
     * Creates a connection.
     */
    _createConnectionItem(model, inputPort, outputPort)
    {
        var inputPortItem = BaseItem.getAssociatedItem(inputPort.id);
        var outputPortItem = BaseItem.getAssociatedItem(outputPort.id);
        var item = new ConnectionItem({segments: this._segments.connection, model: model, inputportitem: inputPortItem, outputportitem: outputPortItem});
        inputPortItem.setConnectionItem(item);
        outputPortItem.addConnectionItem(item);
    }
}

export default WorkflowBuilder;