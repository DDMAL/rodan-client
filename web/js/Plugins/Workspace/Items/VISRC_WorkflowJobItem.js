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

        // TODO - refactor all ofo this
        var canvasWidth = paper.view.viewSize.width;
        var canvasHeight = paper.view.viewSize.height;
        var width = canvasWidth * 0.1;
        var height = canvasHeight * 0.07;
        var size = new paper.Size(width, height).floor();
        var point = new paper.Point(10, 10);
        this._paperItem = new paper.Path.Rectangle(point, size);
        this._paperItem.strokeColor = 'black';
        this._paperItem.strokeWidth = 2;
        this._paperItem.strokeJoin = 'round';
        this._paperItem.fillColor = '#4444ff';

        this._paperItem.onMouseDown = aEvent => this._handleMouseDown(aEvent);
        this._paperItem.onMouseUp = aEvent => this._handleMouseUp(aEvent);
        this._paperItem.onMouseMove = aEvent => this._handleMouseMove(aEvent);
        this._paperItem.onClick = aEvent => this._handleMouseClick(aEvent);

        this._inputPortMap = {};

        this._updateInputPorts();
    }

    /**
     * Update.
     */
    update()
    {
        this._updateInputPorts();
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
     * Updates the input ports.
     */
    _updateInputPorts()
    {
        // Check for input ports.
        var inputPorts = this._associatedModel.get("input_ports");
        if (inputPorts == null)
        {
            return;
        }

        // Check if we've drawn for each.
        for (var i = 0; i < inputPorts.length; i++)
        {
            var inputPort = inputPorts.at(i);
            if (!(inputPort.cid in this._inputPortMap))
            {
                console.log("NEED TO START DRAWING HERE!!! TODO");
            }
        }
    }

    /**
     * Draws input ports.
     */
  /*  _drawInputPorts()
    {
        var canvasWidth = paper.view.viewSize.width;
        var canvasHeight = paper.view.viewSize.height;
        var width = canvasWidth * 0.01;
        var height = canvasHeight * 0.007;
        var size = new paper.Size(width, height).floor();
        var point = new paper.Point(10, 10);
        var test = new paper.Path.Rectangle(point, size);
        test.strokeColor = 'black';
        test.strokeWidth = 2;
        test.strokeJoin = 'round';
        test.fillColor = '#ff0000';
        this._paperItem.addChild(test);
    }*/
}

export default VISRC_WorkflowJobItem;