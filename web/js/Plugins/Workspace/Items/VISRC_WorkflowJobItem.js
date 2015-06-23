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

        // Set paper paremeters.
        // TODO no magic numbers
        var canvasWidth = paper.view.viewSize.width;
        var canvasHeight = paper.view.viewSize.height;
        var width = canvasWidth * 0.2;
        var height = canvasHeight * 0.1;
        var size = new paper.Size(width, height).floor();
        var point = new paper.Point(10, 10);
        this._paperItem = new paper.Path.Rectangle(point, size);
        this._paperItem.strokeColor = 'black';
        this._paperItem.strokeWidth = 2;
        this._paperItem.strokeJoin = 'round';
        this._paperItem.fillColor = '#ff0000';

        this._paperItem.onMouseDown = aEvent => this._handleMouseDown(aEvent);
        this._paperItem.onMouseUp = aEvent => this._handleMouseUp(aEvent);
        this._paperItem.onMouseMove = aEvent => this._handleMouseMove(aEvent);
        this._paperItem.onClick = aEvent => this._handleMouseClick(aEvent);

        this._paperGroupInputPorts = new paper.Group();
        this._paperItem.addChild(this._paperGroupInputPorts);

        this._paperGroupOutputPorts = new paper.Group();
        this._paperItem.addChild(this._paperGroupOutputPorts);

        this.update();
    }

    /**
     * Update.
     */
    update()
    {
        this._updateInputPorts();
        this._updateOutputPorts();
        paper.view.draw();
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
     * Handles mouse move.
     * TODO - should probably be redone...mouse can escape
     */
    _handleMouseMove(aEvent)
    {
        if (this._selected)
        {
            this._paperItem.position.x += aEvent.delta.x;
            this._paperItem.position.y += aEvent.delta.y;
            this._paperGroupInputPorts.position.x += aEvent.delta.x;
            this._paperGroupInputPorts.position.y += aEvent.delta.y;
            this._paperGroupOutputPorts.position.x += aEvent.delta.x;
            this._paperGroupOutputPorts.position.y += aEvent.delta.y;
        }
    }

    /**
     * Updates the input ports.
     */
    _updateInputPorts()
    {
        // Empty.
        // TODO - not efficient...rethink
        this._paperGroupInputPorts.removeChildren();
        this._inputPortMap = {};

        // Check for input ports.
        var ports = this._associatedModel.get("input_ports");
        if (ports == null)
        {
            return;
        }

        // Check if we've drawn for each.
        for (var i = 0; i < ports.length; i++)
        {
            var inputPort = ports.at(i);
            if (!(inputPort.cid in this._inputPortMap))
            {
                // Create and then add to map.
                var port = this._createPortItem(this._paperGroupInputPorts, inputPort);
                this._inputPortMap[inputPort.cid] = port;
            }
        }

        // Update positions.
        this._positionPortItems(this._paperGroupInputPorts, this._paperItem.bounds.top);
    }

    /**
     * Updates the output ports.
     */
    _updateOutputPorts()
    {
        // Empty.
        // TODO - not efficient...rethink
        this._paperGroupOutputPorts.removeChildren();
        this._outputPortMap = {};

        // Check for input ports.
        var ports = this._associatedModel.get("output_ports");
        if (ports == null)
        {
            return;
        }

        // Check if we've drawn for each.
        for (var i = 0; i < ports.length; i++)
        {
            var outputPort = ports.at(i);
            if (!(outputPort.cid in this._outputPortMap))
            {
                // Create and then add to map.
                var port = this._createPortItem(this._paperGroupOutputPorts, outputPort);
                this._outputPortMap[outputPort.cid] = port;
            }
        }

        // Update positions.
        this._positionPortItems(this._paperGroupOutputPorts, this._paperItem.bounds.bottom);
    }

    /**
     * Creates port item and adds it to associated group.
     */
    _createPortItem(aGroup, aModel)
    {
        var width = this._paperItem.bounds.width * 0.1;
        var height = this._paperItem.bounds.height * 0.3;
        var size = new paper.Size(width, height).floor();
        var point = new paper.Point(0, 0);
        var port = new paper.Path.Rectangle(point, size);
        port.strokeColor = 'black';
        port.strokeWidth = 2;
        port.strokeJoin = 'round';
        port.fillColor = '#ff0000';
        port._associatedModel = aModel;
        aGroup.addChild(port);
        return port;
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
        var farLeft = this._paperItem.position.x - (portsWidth / 2);

        for (var i = 0; i < aGroup.children.length; i++)
        {
            var port = aGroup.children[i];
            var positionX = (farLeft + (offsetX * (i + 1))) - (aGroup.children[i].bounds.width / 2);
            var positionY = aPositionY;
            var newPosition = new paper.Point(positionX, positionY);
            port.position = newPosition;
        }
    }
}

export default VISRC_WorkflowJobItem;