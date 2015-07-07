import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../Shared/VISRC_Events';
import VISRC_ConnectionItem from './Items/VISRC_ConnectionItem';
import VISRC_InputPortItem from './Items/VISRC_InputPortItem';
import VISRC_OutputPortItem from './Items/VISRC_OutputPortItem';
import VISRC_WorkflowJobItem from './Items/VISRC_WorkflowJobItem';
import VISRC_ResourceItem from './Items/VISRC_ResourceItem';
import VISRC_ResourceAssignmentItem from './Items/VISRC_ResourceAssignmentItem';

/**
 * Main WorkflowBuilder class.
 */
class VISRC_WorkflowBuilder
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
        this._STATES = {
            IDLE: 0,
            GRABBED_WORKFLOWJOBITEM: 1,
            CREATING_CONNECTION: 2,
            GRABBED_RESOURCEITEM: 3,
            CREATING_RESOURCEASSIGNMENT: 4
        };
        this._state = this._STATES.IDLE;
        this._selectedOutputPortItem = null;
        this._selectedResourceItem = null;

        this._zoomMin = 0.1;
        this._zoomMax = 2;
        this._zoomRate = 0.1;

        paper.setup(aCanvasElementId);
        paper.handleMouseEvent = aData => this._handleMouseEvent(aData);

        this._initializeRadio();

        // TODO - magic numbers
        var canvasWidth = paper.view.viewSize.width;
        var canvasHeight = paper.view.viewSize.height;
        var workflowJobItemWidth = canvasWidth * 0.2;
        var workflowJobItemHeight = canvasHeight * 0.1;
        var inputPortItemWidth = workflowJobItemHeight * 0.2;
        var inputPortItemHeight = workflowJobItemWidth * 0.1;
        var resourceItemDimension = workflowJobItemWidth * 0.5;
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
                new paper.Point(inputPortItemWidth, 0), 
                new paper.Point(inputPortItemWidth, inputPortItemHeight), 
                new paper.Point(0, inputPortItemHeight), 
                new paper.Point(0, 0)
            ],
            connection: [new paper.Point(0, 0), new paper.Point(1, 0)],
            resourceItem: [
                new paper.Point(resourceItemDimension * 0.5, 0),
                new paper.Point(resourceItemDimension, resourceItemDimension * 0.5),
                new paper.Point(resourceItemDimension * 0.5, resourceItemDimension),
                new paper.Point(0, resourceItemDimension * 0.5),
                new paper.Point(resourceItemDimension * 0.5, 0)
            ]
        };
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle mouse event.
     */
    _handleMouseEvent(aData)
    {
        // todo debug
        console.log(aData.event.type);
        console.log(this._state);
        switch (this._state)
        {
            case this._STATES.IDLE:
            {
                this._handleStateIdle(aData);
                break;
            }

            case this._STATES.GRABBED_WORKFLOWJOBITEM:
            {
                this._handleStateGrabbedWorkflowJobItem(aData);
                break;
            }

            case this._STATES.GRABBED_RESOURCEITEM:
            {
                this._handleStateGrabbedResourceItem(aData);
                break;
            }

            case this._STATES.CREATING_CONNECTION:
            {
                this._handleStateCreatingConnection(aData);
                break;
            }

            case this._STATES.CREATING_RESOURCEASSIGNMENT:
            {
                this._handleStateCreatingResourceAssignment(aData);
                break;
            }

            default:
            {
                console.log("TODO - ERROR");
                break;
            }
        }
    }

    /**
     * Handle idle state.
     */
    _handleStateIdle(aData)
    {
        if (aData.event.type == "mousedown")
        {
            if (aData.item instanceof VISRC_WorkflowJobItem)
            {
                this._state = this._STATES.GRABBED_WORKFLOWJOBITEM;  
            }
            else if (aData.item instanceof VISRC_ResourceItem)
            {
                this._state = this._STATES.GRABBED_RESOURCEITEM;  
            }
        }
        else if (aData.event.type == "click")
        {
            if (aData.item instanceof VISRC_OutputPortItem)
            {
                this._selectedOutputPortItem = aData.item;
                this._state = this._STATES.CREATING_CONNECTION; 
            }
            else if (aData.item instanceof VISRC_ResourceItem)
            {
                this._selectedResourceItem = aData.item;
                this._state = this._STATES.CREATING_RESOURCEASSIGNMENT; 
            }
            else if (aData.item instanceof VISRC_WorkflowJobItem)
            {
                this.rodanChannel.trigger(VISRC_Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, {workflowjob: aData.item._associatedModel});
            }
        }
    }

    /**
     * Handle grabbed workflowjobitem state.
     */
    _handleStateGrabbedWorkflowJobItem(aData)
    {
        if (aData.item instanceof VISRC_WorkflowJobItem)
        {
            if (aData.event.type == "mousemove")
            {
                aData.item.move(aData.event.delta);
            }
            else
            {
                this._state = this._STATES.IDLE;
            }
        }
    }

    /**
     * Handle grabbed resourceitem state.
     */
    _handleStateGrabbedResourceItem(aData)
    {
        if (aData.item instanceof VISRC_ResourceItem)
        {
            if (aData.event.type == "mousemove")
            {
                aData.item.move(aData.event.delta);
            }
            else
            {
                this._state = this._STATES.IDLE;
            }
        }
    }

    /**
     * Handle creating connection state.
     */
    _handleStateCreatingConnection(aData)
    {
        if (aData.event.type == "click")
        {
            if (aData.item instanceof VISRC_InputPortItem && !aData.item.hasConnectionItem())
            {
                this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_CONNECTION, {inputport: aData.item._associatedModel, 
                                                                                                 outputport: this._selectedOutputPortItem._associatedModel});
            }
            this._selectedOutputPortItem = null;
            this._state = this._STATES.IDLE;
        }
    }

    /**
     * Handle creating resource assignment state.
     */
    _handleStateCreatingResourceAssignment(aData)
    {
        if (aData.event.type == "click")
        {
            if (aData.item instanceof VISRC_InputPortItem && !aData.item.hasConnectionItem())
            {
                this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_RESOURCEASSIGNMENT, {inputport: aData.item._associatedModel, 
                                                                                                         resource: this._selectedResourceItem._associatedModel});
            }
            this._selectedResourceItem = null;
            this._state = this._STATES.IDLE;
        }
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
        this.rodanChannel.comply(VISRC_Events.COMMAND__WorkflowBuilder_ADD_ITEM_WORKFLOWJOB, aReturn => this._handleCommandAddWorkflowJobItem(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WorkflowBuilder_ADD_ITEM_CONNECTION, aReturn => this._handleCommandAddConnection(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WorkflowBuilder_ADD_ITEM_RESOURCEASSIGNMENT, aReturn => this._handleCommandAddResourceAssignment(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WorkflowBuilder_ADD_ITEM_INPUTPORT, aReturn => this._handleCommandAddInputPortItem(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WorkflowBuilder_ADD_ITEM_OUTPUTPORT, aReturn => this._handleCommandAddOutputPortItem(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WorkflowBuilder_DELETE_ITEM_INPUTPORT, aReturn => this._handleCommandDeleteInputPortItem(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WorkflowBuilder_DELETE_ITEM_OUTPUTPORT, aReturn => this._handleCommandDeleteOutputPortItem(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WorkflowBuilder_ADD_ITEM_RESOURCE, aReturn => this._handleCommandAddResourceItem(aReturn));

        this.rodanChannel.comply(VISRC_Events.COMMAND__WorkflowBuilder_ZOOM_IN, () => this._handleCommandZoomIn());
        this.rodanChannel.comply(VISRC_Events.COMMAND__WorkflowBuilder_ZOOM_OUT, () => this._handleCommandZoomOut());
        this.rodanChannel.comply(VISRC_Events.COMMAND__WorkflowBuilder_ZOOM_RESET, () => this._handleCommandZoomReset());
    }

    /**
     * Handle add.
     */
    _handleCommandAddWorkflowJobItem(aReturn)
    {
        this._createWorkflowJobItem(aReturn.workflowjob);
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
     * Handle connection add.
     */
    _handleCommandAddConnection(aReturn)
    {
        this._createConnectionItem(aReturn.connection, aReturn.inputport, aReturn.outputport);
        paper.view.draw();
    }

    /**
     * Handle resource add.
     */
    _handleCommandAddResourceItem(aReturn)
    {
        this._createResourceItem(aReturn.resource);
        paper.view.draw();
    }

    /**
     * Handle resource assignment add.
     */
    _handleCommandAddResourceAssignment(aReturn)
    {
        this._createResourceAssignmentItem(aReturn.resourceassignment, aReturn.resource, aReturn.inputport);
        paper.view.draw();
    }

    /**
     * Handle zoom in.
     */
    _handleCommandZoomIn(aReturn)
    {
        paper.view.zoom = paper.view.zoom + this._zoomRate < this._zoomMax ? paper.view.zoom + this._zoomRate : this._zoomMax;
        paper.view.draw();
    }

    /**
     * Handle zoom out.
     */
    _handleCommandZoomOut(aReturn)
    {
        paper.view.zoom = paper.view.zoom - this._zoomRate > this._zoomMin ? paper.view.zoom - this._zoomRate : this._zoomMin;
        paper.view.draw();
    }

    /**
     * Handle zoom reset.
     */
    _handleCommandZoomReset(aReturn)
    {
        paper.view.zoom = 1;
        paper.view.draw();
    }

    /**
     * Creates a workflow job item.
     */
    _createWorkflowJobItem(aModel)
    {
        aModel.paperItem = new VISRC_WorkflowJobItem({segments: this._segments.workflowJobItem, model: aModel});
    }

    /**
     * Creates an input port item for the associated workflow job.
     */
    _createInputPortItem(aWorkflowJob, aModel)
    {
        aModel.paperItem = new VISRC_InputPortItem({segments: this._segments.portItem, model: aModel});
        aWorkflowJob.paperItem.addInputPortItem(aModel.paperItem);
    }

    /**
     * Creates an output port item for the associated workflow job.
     */
    _createOutputPortItem(aWorkflowJob, aModel)
    {
        aModel.paperItem = new VISRC_OutputPortItem({segments: this._segments.portItem, model: aModel});
        aWorkflowJob.paperItem.addOutputPortItem(aModel.paperItem);
    }

    /**
     * Creates a connection.
     */
    _createConnectionItem(aModel, aInputPort, aOutputPort)
    {
        aModel.paperItem = new VISRC_ConnectionItem({segments: this._segments.connection,
                                                     model: aModel, 
                                                     inputPort: aInputPort, 
                                                     outputPort: aOutputPort});

        // Associate the ports with the connection.
        aInputPort.paperItem.setConnectionItem(aModel.paperItem);
        aOutputPort.paperItem.addConnectionItem(aModel.paperItem);
    }

    /**
     * Creates a resource item.
     */
    _createResourceItem(aModel)
    {
        aModel.paperItem = new VISRC_ResourceItem({segments: this._segments.resourceItem,
                                                     model: aModel});
    }

    /**
     * Creates a resource assignment.
     */
    _createResourceAssignmentItem(aModel, aResource, aInputPort)
    {
        aModel.paperItem = new VISRC_ResourceAssignmentItem({segments: this._segments.connection,
                                                             resource: aResource, 
                                                             inputPort: aInputPort});

        // Associate the ports with the connection.
        aResource.paperItem.addConnectionItem(aModel.paperItem);
        aInputPort.paperItem.setConnectionItem(aModel.paperItem);
    }
}

export default VISRC_WorkflowBuilder;