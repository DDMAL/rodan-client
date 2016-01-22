import paper from 'paper';
import BaseItem from './BaseItem';
import Events from '../../../Shared/Events';
import Configuration from '../../../Configuration';
import WorkflowBuilderEvents from '../Events';
import WorkflowJobCoordinateSet from '../Models/WorkflowJobCoordinateSet';

/**
 * WorkflowJob item.
 */
class WorkflowJobItem extends BaseItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(aParameters)
    {
        super(aParameters);

        // Get getter Event.
        this.getModelEvent = Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB;

        // Set coordinate set info.
        this.coordinateSetInfo = [];
        this.coordinateSetInfo['class'] = WorkflowJobCoordinateSet;
        this.coordinateSetInfo['url'] = 'workflow_job';
        this.coordinateSetInfo['collectionLoadEvent'] = WorkflowBuilderEvents.REQUEST__WORKFLOWJOBCOORDINATESETS_LOAD;

        this._paperGroupInputPorts = new paper.Group();
        this.addChild(this._paperGroupInputPorts);
        this._paperGroupOutputPorts = new paper.Group();
        this.addChild(this._paperGroupOutputPorts);

        // Attempt coordinate load.
        this.loadCoordinates();

        this.update();
    }

    /**
     * Update.
     */
    update()
    {
        this.bounds.width = this._text.bounds.width + 10;
        this._text.position = this.bounds.center;
        this._paperGroupInputPorts.position = this.bounds.topCenter;
        this._paperGroupOutputPorts.position = this.bounds.bottomCenter;
        this._positionPortItems(this._paperGroupInputPorts, this.bounds.top);
        this._positionPortItems(this._paperGroupOutputPorts, this.bounds.bottom);
        this._updatePortItems(this._paperGroupInputPorts);
        this._updatePortItems(this._paperGroupOutputPorts);
    }

    /**
     * Adds input port item.
     */
    addInputPortItem(aInputPortItem)
    {
        this._paperGroupInputPorts.addChild(aInputPortItem);
        this.update();
    }

    /**
     * Adds output port item.
     */
    addOutputPortItem(aOutputPortItem)
    {
        this._paperGroupOutputPorts.addChild(aOutputPortItem);
        this.update();
    }

    /**
     * Deletes input port item.
     */
    deleteInputPortItem(aInputPortItem)
    {
        this._deletePortItem(this._paperGroupInputPorts, aInputPortItem);
        this.update();
    }

    /**
     * Deletes output port item.
     */
    deleteOutputPortItem(aOutputPortItem)
    {
        this._deletePortItem(this._paperGroupOutputPorts, aOutputPortItem);
        this.update();
    }

    /**
     * Destroy cleanup.
     */
    destroy()
    {
        // Delete ports.
        var inputPortItems = this._paperGroupInputPorts.removeChildren();
        var outputPortItems = this._paperGroupOutputPorts.removeChildren();
        for (var index in inputPortItems)
        {
            var port = inputPortItems[index];
            port.destroy();
        }
        for (var index in outputPortItems)
        {
            var port = outputPortItems[index];
            port.destroy();
        }

        super.destroy();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Positions ports.
     */
    _positionPortItems(aGroup, aPositionY)
    {
        if (aGroup.isEmpty())
        {
            return;
        }

        // Get position parameters.
        var offsetX = aGroup.children[0].bounds.width;
        var portsWidth = aGroup.children.length * aGroup.children[0].bounds.width;
        var farLeft = this.position.x - (portsWidth / 2);

        for (var i = 0; i < aGroup.children.length; i++)
        {
            var port = aGroup.children[i];
            var positionX = (farLeft + (offsetX * (i + 1))) - (aGroup.children[i].bounds.width / 2);
            var positionY = aPositionY;
            var newPosition = new paper.Point(positionX, positionY);
            port.position = newPosition;
        }
    }

    /**
     * Updates port items.
     */
    _updatePortItems(group)
    {
        for (var i = 0; i < group.children.length; i++)
        {
            group.children[i].setVisible(this.visible);
            group.children[i].update();
        }
    }

    /**
     * Deletes a port item.
     */
    _deletePortItem(aGroup, aPortItem)
    {
        for (var i = 0; i < aGroup.children.length; i++)
        {
            if (aPortItem === aGroup.children[i])
            {
                aGroup.removeChildren(i, i + 1);
                return;
            }
        }
        console.error('TODO - ERROR HERE!!!!!');
    }
}

export default WorkflowJobItem;