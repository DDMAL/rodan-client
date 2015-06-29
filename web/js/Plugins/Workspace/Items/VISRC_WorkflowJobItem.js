import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_BaseItem from './VISRC_BaseItem';
import VISRC_Events from '../../../Shared/VISRC_Events';

/**
 * WorkflowJob item.
 */
class VISRC_WorkflowJobItem extends VISRC_BaseItem
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

        this.onClick = aEvent => this._handleMouseClick(aEvent); // let it handle its own clicks

        this.update();
    }

    /**
     * Update.
     */
    update()
    {
        // TODO - magic number
        this.fillColor = '#5555ff';
        this._updatePortItems(this._paperGroupInputPorts);
        this._updatePortItems(this._paperGroupOutputPorts);
    }

    /**
     * Adds input port item.
     */
    addInputPortItem(aInputPortItem)
    {
        this._paperGroupInputPorts.addChild(aInputPortItem);
        this._positionPortItems(this._paperGroupInputPorts, this.bounds.top);
    }

    /**
     * Adds output port item.
     */
    addOutputPortItem(aOutputPortItem)
    {
        this._paperGroupOutputPorts.addChild(aOutputPortItem);
        this._positionPortItems(this._paperGroupOutputPorts, this.bounds.bottom);
    }

    /**
     * Deletes input port item.
     */
    deleteInputPortItem(aInputPortItem)
    {
        this._deletePortItem(this._paperGroupInputPorts, aInputPortItem);
        this._positionPortItems(this._paperGroupInputPorts, this.bounds.top);
    }

    /**
     * Deletes output port item.
     */
    deleteOutputPortItem(aOutputPortItem)
    {
        this._deletePortItem(this._paperGroupOutputPorts, aOutputPortItem);
        this._positionPortItems(this._paperGroupOutputPorts, this.bounds.bottom);
    }

    /**
     * Moves the item.
     */
    move(aDelta)
    {
        this.position.x += aDelta.x;
        this.position.y += aDelta.y;
        this._paperGroupInputPorts.position.x += aDelta.x;
        this._paperGroupInputPorts.position.y += aDelta.y;
        this._paperGroupOutputPorts.position.x += aDelta.x;
        this._paperGroupOutputPorts.position.y += aDelta.y;

        // We have to update the input ports.
        this._updatePortItems(this._paperGroupInputPorts);
        this._updatePortItems(this._paperGroupOutputPorts);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles mouse cick.
     */
    _handleMouseClick(aEvent)
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, {workflowjob: this._associatedModel});
    }

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
        console.log("TODO - ERROR HERE!!!!!");
    }
}

export default VISRC_WorkflowJobItem;