import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import BaseItem from './BaseItem';
import Events from '../../../Shared/Events';

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

        this._paperGroupInputPorts = new paper.Group();
        this.addChild(this._paperGroupInputPorts);
        this._paperGroupOutputPorts = new paper.Group();
        this.addChild(this._paperGroupOutputPorts);

        this.update();
    }

    /**
     * Update.
     */
    update()
    {
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
    _updatePortItems(aGroup)
    {
        for (var i = 0; i < aGroup.children.length; i++)
        {
            aGroup.children[i].update();
        }
    }

    /**
     * Deletes a port item.
     */
    _deletePortItem(aGroup, aPortItem)
    {
        for (var i = 0; i < aGroup.children.length; i++)
        {
            if (aPortItem == aGroup.children[i])
            {
                aGroup.removeChildren(i, i + 1);
                return;
            }
        }
        console.error("TODO - ERROR HERE!!!!!");
    }
}

export default WorkflowJobItem;