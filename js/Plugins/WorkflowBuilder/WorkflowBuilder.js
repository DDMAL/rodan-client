import Radio from 'backbone.radio';
import paper from 'paper';

import Configuration from '../../Configuration';
import ConnectionItem from './Items/ConnectionItem';
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
        this._multipleSelectionKey = null;
        this._line = null;
        this._selectingMultiple = false;
        this._selectedOutputPortItem = null;
        
        this._zoomMin = Configuration.WORKFLOWBUILDER.ZOOM_MIM;
        this._zoomMax = Configuration.WORKFLOWBUILDER.ZOOM_MAX;
        this._zoomRate = Configuration.WORKFLOWBUILDER.ZOOM_RATE;

        paper.install(window);
        paper.setup(aCanvasElementId);
        paper.handleMouseEvent = aData => this._handleEvent(aData);
        
        this._itemController = new ItemController();

        this._initializeGlobalTool();
        this._initializeRadio();
        this._setMultipleSelectionKey();

        // State info.
        this._STATES = {
            IDLE: 0,
            GRABBED_WORKFLOWJOBITEMS: 1,
            MOVING_WORKFLOWJOBITEMS: 2,
            CREATING_CONNECTION: 3
        };
        this._firstEntry = false;
        this._setState(this._STATES.IDLE);
        paper.view.onFrame = (event) => this._handleState(event);
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
     * Handle state. This is frame driven.
     */
    _handleState(event)
    {
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
            if (event.target)
            {
                switch (event.target.constructor.name)
                {
                    case 'WorkflowJobItem':
                    {
                        if (!this._selectingMultiple)
                        {
                            if (!this._itemController.isSelected(event.target))
                            {
                                this._itemController.clearSelected();
                                this._itemController.selectItem(event.target);
                            }
                            this._state = this._STATES.GRABBED_WORKFLOWJOBITEMS;  
                        }
                        else
                        {
                            if (!this._itemController.isSelected(event.target))
                            {
                                this._itemController.selectItem(event.target);
                            }
                            else
                            {
                                this._itemController.unselectItem(event.target);
                            }
                        }
                        break;
                    }

                    case 'WorkflowJobGroupItem':
                    {
                        if (!this._itemController.selectingMultiple)
                        {
                            if (!this._itemController.isSelected(event.target))
                            {
                                this._itemController.clearSelected();
                                this._itemController.selectItem(event.target);
                            }
                            this._state = this._STATES.GRABBED_WORKFLOWJOBITEMS;  
                        }
                        else
                        {
                            if (!this._itemController.isSelected(event.target))
                            {
                                this._itemController.selectItem(event.target);
                            }
                            else
                            {
                                this._itemController.unselectItem(event.target);
                            }
                        }
                        break;
                    }

                    case 'InputPortItem':
                    {
                        if (!this._selectingMultiple)
                        {
                            if (!this._itemController.isSelected(event.target))
                            {
                                this._itemController.clearSelected();
                                this._itemController.selectItem(event.target);
                            } 
                        }
                        else
                        {
                            if (!this._itemController.isSelected(event.target))
                            {
                                this._itemController.selectItem(event.target);
                            }
                            else
                            {
                                this._itemController.unselectItem(event.target);
                            }
                        }
                        break;
                    }

                    case 'OutputPortItem':
                    {
                        this._selectedOutputPortItem = event.target;
                        this._state = this._STATES.CREATING_CONNECTION; 
                    }

                    default:
                    {
                        if (!this._selectingMultiple)
                        {
                            this._itemController.clearSelected();
                        }
                        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, {});
                        break;
                    }
                }
            }
            else
            {
                if (!this._selectingMultiple)
                {
                    this._itemController.clearSelected();
                }
                this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, {});
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
            this._itemController.clearSelected();
            this._itemController.selectItem(event.target);
            this._state = this._STATES.IDLE;
        }
    }

    /**
     * Handle moving workflowjobitem state.
     */
    _handleStateMovingWorkflowJobItems(event)
    {
        var keys = this._itemController.getSelectedItemKeys();
        if (event.type === 'mousemove')
        {
            for (var i = 0; i < keys.length; i++)
            {
                var key = keys[i];
                var item = this._itemController.getSelectedItem(key);
                item.move(event.delta);
            }
        }
        else if (event.type === 'mouseup')
        {
            // We've let go, so go idle and save the positions.
            this._state = this._STATES.IDLE;
            for (var i = 0; i < keys.length; i++)
            {
                var key = keys[i];
                var item = this._itemController.getSelectedItem(key);
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
                this._line = this._itemController.createLineItem(startPoint);
            }

            // Update end point to one pixel ABOVE the mouse pointer. This ensures that the next click event does NOT register
            // the line as the target.
            var adjustedPoint = new Point(event.point.x, event.point.y - 1);
            this._line.setEndPoint(adjustedPoint);
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