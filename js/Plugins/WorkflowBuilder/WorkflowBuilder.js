import Radio from 'backbone.radio';

import Events from '../../Shared/Events';
import ConnectionItem from './Items/ConnectionItem';
import InputPortItem from './Items/InputPortItem';
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
        this._STATES = {
            IDLE: 0,
            GRABBED_WORKFLOWJOBITEM: 1,
            CREATING_CONNECTION: 2
        };
        this._state = this._STATES.IDLE;
        this._selectedOutputPortItem = null;

        this._zoomMin = 0.1;
        this._zoomMax = 2;
        this._zoomRate = 0.1;

        paper.install(window);
        paper.setup(aCanvasElementId);
        paper.handleMouseEvent = aData => this._handleMouseEvent(aData);

        this._initializeGlobalMouseTool();

        this._initializeRadio();

        // TODO - magic numbers
        var canvasWidth = paper.view.viewSize.width;
        var canvasHeight = paper.view.viewSize.height;
        var workflowJobItemWidth = canvasWidth * 0.2;
        var workflowJobItemHeight = canvasHeight * 0.1;
        var inputPortItemWidth = workflowJobItemHeight * 0.2;
        var inputPortItemHeight = workflowJobItemWidth * 0.1;
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
            connection: [new paper.Point(0, 0), new paper.Point(1, 0)]
        };
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize global mouse tool.
     */
    _initializeGlobalMouseTool()
    {
        this._globalMouseTool = new Tool();
        this._mouseDelta = new paper.Point(0, 0);
        this._grabbedItem = null;
        this._globalMouseTool.onMouseMove = event => this._handleMouseEvent(event);
    }

    /**
     * Handle mouse event.
     */
    _handleMouseEvent(event)
    {
        switch (this._state)
        {
            case this._STATES.IDLE:
            {
                this._handleStateIdle(event);
                break;
            }

            case this._STATES.GRABBED_WORKFLOWJOBITEM:
            {
                this._handleStateGrabbedWorkflowJobItem(event);
                break;
            }

            case this._STATES.CREATING_CONNECTION:
            {
                this._handleStateCreatingConnection(event);
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
                this._grabbedItem = event.target;
                this._state = this._STATES.GRABBED_WORKFLOWJOBITEM;  
            }
        }
        else if (event.type === 'click')
        {
            if (event.target instanceof OutputPortItem)
            {
                this._selectedOutputPortItem = event.target;
                this._state = this._STATES.CREATING_CONNECTION; 
            }
            else if (event.target instanceof WorkflowJobItem)
            {
                this.rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, {workflowjob: event.target._associatedModel});
            }
        }
    }

    /**
     * Handle grabbed workflowjobitem state.
     */
    _handleStateGrabbedWorkflowJobItem(event)
    {
        if (event.type === 'mousemove')
        {

            this._grabbedItem.move(event.delta);
        }
        else
        {
            this._state = this._STATES.IDLE;
        }
    }

    /**
     * Handle creating connection state.
     */
    _handleStateCreatingConnection(event)
    {
        if (event.type === 'click')
        {
            if (event.target instanceof InputPortItem && !event.target.hasConnectionItem())
            {
                this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_ADD_CONNECTION, {inputport: event.target._associatedModel, 
                                                                                           outputport: this._selectedOutputPortItem._associatedModel});
            }
            this._selectedOutputPortItem = null;
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
        this.rodanChannel = Radio.channel('rodan');

        // GUI commands.
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB, aReturn => this._handleCommandAddWorkflowJobItem(aReturn));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION, aReturn => this._handleCommandAddConnection(aReturn));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT, aReturn => this._handleCommandAddInputPortItem(aReturn));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT, aReturn => this._handleCommandAddOutputPortItem(aReturn));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_GUI_DELETE_ITEM_INPUTPORT, aReturn => this._handleCommandDeleteInputPortItem(aReturn));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_GUI_DELETE_ITEM_OUTPUTPORT, aReturn => this._handleCommandDeleteOutputPortItem(aReturn));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_GUI_ZOOM_IN, () => this._handleCommandZoomIn());
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_GUI_ZOOM_OUT, () => this._handleCommandZoomOut());
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_GUI_ZOOM_RESET, () => this._handleCommandZoomReset());
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
    _createWorkflowJobItem(aModel)
    {
        aModel.paperItem = new WorkflowJobItem({segments: this._segments.workflowJobItem, model: aModel, text: true});
        aModel.paperItem.update();
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