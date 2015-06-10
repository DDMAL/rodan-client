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
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_WorkflowJobItem;