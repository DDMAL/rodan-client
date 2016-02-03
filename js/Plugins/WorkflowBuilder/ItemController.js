import Radio from 'backbone.radio';
import paper from 'paper';

import BaseItem from './Items/BaseItem';
import ConnectionItem from './Items/ConnectionItem';
import Configuration from '../../Configuration';
import Events from '../../Shared/Events';
import InputPortItem from './Items/InputPortItem';
import LineItem from './Items/LineItem';
import OutputPortItem from './Items/OutputPortItem';
import WorkflowJobGroupItem from './Items/WorkflowJobGroupItem';
import WorkflowJobItem from './Items/WorkflowJobItem';

/**
 * Controls management of items.
 */
class ItemController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Basic constructor
     */
    constructor()
    {
        this._selectedItems = {};
        this._selectingMultiple = false;
        this._overItem = null;
        this._outputPortItem = null;
        
        this._initializeRadio();
        this._createSegments();
    }

    /**
     * Handles MouseEvent on item.
     */
    handleMouseEvent(mouseEvent)
    {
        var item = mouseEvent.target;
        this._overItem = mouseEvent.type === 'mouseenter' ? item : mouseEvent.type === 'mouseleave' ? null : item;
        if (mouseEvent.type === 'mousedown')
        {
            this._handleEventMouseDown(mouseEvent);
        }
        else if (mouseEvent.type === 'mouseup')
        {
        }
    }

    /**
     * Returns current item mouse is over (or null).
     */
    getMouseOverItem()
    {
        return this._overItem;
    }

    /**
     * Saves item positions.
     */
    saveSelectedItemPositions()
    {
        for (var itemIndex in this._selectedItems)
        {
            var item = this._selectedItems[itemIndex];
            item.updatePositionToServer();
        } 
    }

    /**
     * Move item positions.
     */
    moveSelectedItems(delta)
    {
        for (var itemIndex in this._selectedItems)
        {
            var item = this._selectedItems[itemIndex];
            if (item.isMoveable())
            {
                item.move(delta); 
            }
        } 
    }

    /**
     * Selects the given item.
     */
    selectItem(item)
    {
        this._selectedItems[item.id] = item;
        item.setHighlight(true);
        this._processSelection();
    }

    /**
     * Unselects the given item.
     */
    unselectItem(item)
    {
        delete this._selectedItems[item.id];
        item.setHighlight(false);
        this._processSelection();
    }

    /**
     * Clears selection.
     */
    clearSelected()
    {
        for (var itemIndex in this._selectedItems)
        {
            var item = this._selectedItems[itemIndex];
            this.unselectItem(item);
        }
        this._selectedItems = {}; // TODO memory leak? 
        this._outputPortItem = null;
        this._processSelection();
    }

    /**
     * Return true iff item is selected.
     */
    isSelected(item)
    {
        return this._selectedItems.hasOwnProperty(item.id);
    }

    /**
     * Returns number of selected items.
     */
    getSelectedCount()
    {
        return Object.keys(this._selectedItems).length;
    }

    /**
     * Returns array of keys of selected items.
     */
    getSelectedItemKeys()
    {
        return Object.keys(this._selectedItems);
    }

    /**
     * Returns selected item at key
     */
    getSelectedItem(key)
    {
        return this._selectedItems[key];
    }

    /**
     * Returns true iff we can group the selected items.
     */
    canGroupSelectedItems()
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

    /**
     * Return OutputPortItem flagged for Connection creation (null if none).
     */
    getOutputPortItemForConnection()
    {
        return this._outputPortItem;
    }

    /**
     * Returns a line item.
     */
    createLineItem(startPoint)
    {
        return new LineItem({segments: this._segments.connection, startPoint: startPoint});
    }

    /**
     * Set selecting multiple.
     */
    setSelectingMultiple(selectingMultiple)
    {
        this._selectingMultiple = selectingMultiple;
    }

    /**
     * Return true iff selecting multiple.
     */
    selectingMultiple()
    {
        return this._selectingMultiple;
    }

    /**
     * Attempts to create a connection.
     */
    createConnection(outputPortItem, inputPortItem)
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ADD_CONNECTION, {inputportid: inputPortItem.getModelID(), 
                                                                                   outputportid: outputPortItem.getModelID()});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - MouseEvent handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle event mousedown.
     */
    _handleEventMouseDown(mouseEvent)
    {
        // Handle selection first.
        var item = mouseEvent.target;
        if (!this._selectingMultiple)
        {
            if (!this.isSelected(item))
            {
                this.clearSelected();
                this.selectItem(item);
            } 
        }
        else
        {
            if (!this.isSelected(item))
            {
                this.selectItem(item);
            }
            else
            {
                this.unselectItem(item);
            }
        }

        // Next, what kind of button was it.
        switch (mouseEvent.event.button)
        {
            case 0:
            {
                this._handleEventMouseDownMain(mouseEvent);
                break;
            }

            default:
            {
                this._handleEventMouseDownSecondary(mouseEvent);
                break;
            }
        }
    }

    /**
     * Handle main button mousedown.
     */
    _handleEventMouseDownMain(mouseEvent)
    {
        // Check if we can start making a connection.
        var item = mouseEvent.target;
        if (this.getSelectedCount() === 1 && item instanceof OutputPortItem)
        {
            this._outputPortItem = item;
        } 
    }

    /**
     * Handle secondary button mousedown.
     */
    _handleEventMouseDownSecondary(mouseEvent)
    {
        var itemClass = this._getSelectionItemType();
        var contextMenuData = [];
        if (this.getSelectedCount() === 1)
        {
            contextMenuData = itemClass.getContextMenuDataSingle();
        }
        else
        {
            contextMenuData = itemClass.getContextMenuDataMultiple();
        }

        if (contextMenuData.length > 0)
        {
            this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_SHOW_CONTEXTMENU, {items: contextMenuData, mouseevent: mouseEvent});
        }
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
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB, options => this._handleRequestAddWorkflowJobItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION, options => this._handleRequestAddConnection(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT, options => this._handleRequestAddInputPortItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT, options => this._handleRequestAddOutputPortItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_INPUTPORT, options => this._handleRequestDeleteInputPortItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_OUTPUTPORT, options => this._handleRequestDeleteOutputPortItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOB, options => this._handleRequestDeleteWorkflowJobItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_GET_SELECTED_WORKFLOWJOB_IDS, () => this._handleRequestGetSelectedWorkflowJobIDs());
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_HIDE_WORKFLOWJOB, (options) => this._handleRequestHideWorkflowJob(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_SHOW_WORKFLOWJOB, (options) => this._handleRequestShowWorkflowJob(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOBGROUP, (options) => this._handleRequestAddWorkflowJobGroupItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_PORT_ITEMS_WITH_WORKFLOWJOBGROUP, (options) => this._handleRequestPortsWorkflowJobGroupItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOBGROUP, options => this._handleRequestDeleteWorkflowJobGroupItem(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_RESOURCEDISTRIBUTOR, () => this._handleRequestAddResourceDistributor());
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

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle add.
     */
    _handleRequestAddWorkflowJobItem(options)
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
    _handleRequestAddWorkflowJobGroupItem(options)
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
    _handleRequestAddInputPortItem(options)
    {
        this._createInputPortItem(options.workflowjob, options.inputport);
    }

    /**
     * Handle add output port item.
     */
    _handleRequestAddOutputPortItem(options)
    {
        this._createOutputPortItem(options.workflowjob, options.outputport);
    }

    /**
     * Handle delete input port item.
     */
    _handleRequestDeleteInputPortItem(options)
    {
        var workflowJobItem = BaseItem.getAssociatedItem(options.workflowjob.id);
        var inputPortItem = BaseItem.getAssociatedItem(options.inputport.id);
        workflowJobItem.deleteInputPortItem(inputPortItem);
        inputPortItem.destroy();
    }

    /**
     * Handle delete output port item.
     */
    _handleRequestDeleteOutputPortItem(options)
    {
        var workflowJobItem = BaseItem.getAssociatedItem(options.workflowjob.id);
        var outputPortItem = BaseItem.getAssociatedItem(options.outputport.id);
        workflowJobItem.deleteOutputPortItem(outputPortItem);
        outputPortItem.destroy();
    }

    /**
     * Handle delete WorkflowJobItem.
     */
    _handleRequestDeleteWorkflowJobItem(options)
    {
        var workflowJobItem = BaseItem.getAssociatedItem(options.workflowjob.id);
        workflowJobItem.destroy();
    }

    /**
     * Handle connection add.
     */
    _handleRequestAddConnection(options)
    {
        this._createConnectionItem(options.connection, options.inputport, options.outputport);
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
    _handleRequestDeleteWorkflowJobGroupItem(options)
    {
        var workflowJobGroupItem = BaseItem.getAssociatedItem(options.workflowjobgroup.id);
        workflowJobGroupItem.destroy();
    }

    /**
     * Handle add resource distributor for selected InputPorts.
     */
    _handleRequestAddResourceDistributor(options)
    {
        var keys = this.getSelectedItemKeys();
        var urls = [];
        for (var index in keys)
        {
            var item = this.getSelectedItem(keys[index]);
            urls.push({'url': item.getModelURL()});
        }
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_CREATEDISTRIBUTOR, {urls: urls});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Take the appropriate action depending on what has been selected.
     */
    _processSelection()
    {
        var keys = this.getSelectedItemKeys();
        if (keys.length === 1)
        {
            var item = this.getSelectedItem(keys[0]);
            if (item instanceof WorkflowJobItem)
            {
                this.rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, {id: item.getModelID()});
                return;
            }
            else if (item instanceof WorkflowJobGroupItem)
            {
                this.rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOBGROUP_SELECTED, {id: item.getModelID()});
                return;
            }
        }
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, {});
    }

    /**
     * Returns item type (class constructor) of multiple selection.
     * If mixed, returns BaseItem. Returns null if none.
     */
    _getSelectionItemType()
    {
        var keys = this.getSelectedItemKeys();
        var itemType = null;
        var urls = [];
        for (var index in keys)
        {
            var item = this.getSelectedItem(keys[index]);
            if (itemType === null)
            {
                itemType = item.constructor;
            }
            if (item.constructor !== itemType)
            {
                this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, {});
                return BaseItem;
            }
        }
        return itemType;
    }

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

export default ItemController;