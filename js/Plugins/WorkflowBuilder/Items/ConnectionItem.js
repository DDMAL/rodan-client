import paper from 'paper';
import BaseItem from './BaseItem';
import Configuration from '../../../Configuration';
import Events from '../../../Shared/Events';

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

        // Get getter Event.
        this.getModelEvent = Events.REQUEST__WORKFLOWBUILDER_GET_CONNECTION;
        this.menuItems = [{label: 'Delete', radiorequest: Events.REQUEST__WORKFLOWBUILDER_DELETE_CONNECTION, options: {model: options.model}}];

        this.strokeWidth = Configuration.WORKFLOWBUILDER.STROKE_WIDTH;
        this._associatedInputPortItem = options.inputportitem;
        this._associatedOutputPortItem = options.outputportitem;

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
    }

    /**
     * Return true iff this item can be moved by itself.
     */
    isMoveable()
    {
        return false;
    }

    /**
     * Update.
     */
    update()
    {
        this._circle.visible = this.visible;
        this.firstSegment.point.x = this._associatedOutputPortItem.position.x;
        this.firstSegment.point.y = this._associatedOutputPortItem.bounds.bottom;
        this.lastSegment.point.x = this._associatedInputPortItem.position.x;
        this.lastSegment.point.y = this._associatedInputPortItem.bounds.top;
        this._circle.position.x = this.firstSegment.point.x + ((this.lastSegment.point.x - this.firstSegment.point.x) / 2);
        this._circle.position.y = this.firstSegment.point.y + ((this.lastSegment.point.y - this.firstSegment.point.y) / 2);
    }

    /**
     * Destroy cleanup.
     */
    destroy()
    {
        this._circle.remove();
        this._associatedInputPortItem.setConnectionItem(null);
        this._associatedInputPortItem = null;
        this._associatedOutputPortItem.removeConnectionItem(this);
        this._associatedOutputPortItem = null;
        super.destroy();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default ConnectionItem;