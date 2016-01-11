import paper from 'paper';
import BaseItem from './BaseItem';
import Configuration from '../../../Configuration';

/**
 * Connection item.
 */
class ConnectionItem extends BaseItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(options)
    {
        super(options);

        this.strokeWidth = Configuration.WORKFLOWBUILDER.STROKE_WIDTH;
        this._associatedInputPort = options.inputPort;
        this._associatedOutputPort = options.outputPort;

        // We'll put a small circle in the middle of our connection so it's easier to select.
        var circleCenter = new paper.Point(0, 0);
        this._circle = new paper.Shape.Circle(circleCenter, Configuration.WORKFLOWBUILDER.CONNECTION_CIRCLE_RADIUS);
        this._circle.fillColor = Configuration.WORKFLOWBUILDER.STROKE_COLOR;
        this._circle.onMouseDown = event => this._handleMouseEvent(event);
        this._circle.onMouseUp = event => this._handleMouseEvent(event);
        this._circle.onClick = event => this._handleMouseEvent(event);
        this._circle.onMouseEnter = event => this._handleMouseEvent(event);
        this._circle.onMouseLeave = event => this._handleMouseEvent(event);
        this.addChild(this._circle);

        this.update();
    }

    /**
     * Update.
     */
    update()
    {
        this.firstSegment.point.x = this._associatedOutputPort.paperItem.position.x;
        this.firstSegment.point.y = this._associatedOutputPort.paperItem.bounds.bottom;
        this.lastSegment.point.x = this._associatedInputPort.paperItem.position.x;
        this.lastSegment.point.y = this._associatedInputPort.paperItem.bounds.top;
        this._circle.position.x = this.firstSegment.point.x + ((this.lastSegment.point.x - this.firstSegment.point.x) / 2);
        this._circle.position.y = this.firstSegment.point.y + ((this.lastSegment.point.y - this.firstSegment.point.y) / 2);
    }

    /**
     * Destroy cleanup.
     */
    destroy()
    {
        this._circle.remove();
        this._associatedInputPort.paperItem.setConnectionItem(null);
        this._associatedInputPort = null;
        this._associatedOutputPort.paperItem.removeConnectionItem(this);
        this._associatedOutputPort = null;
        super.destroy();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default ConnectionItem;