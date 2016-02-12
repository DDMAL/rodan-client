import paper from 'paper';
import BaseItem from './BaseItem';
import Events from '../../../Shared/Events';
import Configuration from '../../../Configuration';
import WorkflowJobCoordinateSet from '../Models/WorkflowJobCoordinateSet';

/**
 * WorkflowJob item.
 */
class WorkflowJobItem extends BaseItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC STATIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Returns context menu data for multiple items of this class.
     * Takes in URLs of multiple selections.
     *
     * The menu data is simply an array of objects. Objects should be:
     *
     * {
     *      label: [string] // The text that should appear
     *      radiorequest: Events.?  // The Request to make. NOT A RADIO EVENT, rather a REQUEST.
     *      options: Object holding any options for Event
     * }
     */
    static getContextMenuDataMultiple()
    {
        return [{label: 'Group', radiorequest: Events.REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOBGROUP}];
    }

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
        this.getModelEvent = Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB;
        this.menuItems = [{label: 'Edit', radiorequest: Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_VIEW, options: {url: this.getModelURL()}},
                          {label: 'Delete', radiorequest: Events.REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOB, options: {model: options.model}}];

        // Set coordinate set info.
        this.coordinateSetInfo = [];
        this.coordinateSetInfo['class'] = WorkflowJobCoordinateSet;
        this.coordinateSetInfo['url'] = 'workflow_job';

        this._paperGroupInputPorts = new paper.Group();
        this.addChild(this._paperGroupInputPorts);
        this._paperGroupOutputPorts = new paper.Group();
        this.addChild(this._paperGroupOutputPorts);

        // Attempt coordinate load.
        this.loadCoordinates();

        this.onDoubleClick = event => this._handleDoubleClick(event);
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
    }

    /**
     * Adds output port item.
     */
    addOutputPortItem(aOutputPortItem)
    {
        this._paperGroupOutputPorts.addChild(aOutputPortItem);
    }

    /**
     * Deletes input port item.
     */
    deleteInputPortItem(aInputPortItem)
    {
        this._deletePortItem(this._paperGroupInputPorts, aInputPortItem);
    }

    /**
     * Deletes output port item.
     */
    deleteOutputPortItem(aOutputPortItem)
    {
        this._deletePortItem(this._paperGroupOutputPorts, aOutputPortItem);
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
    _positionPortItems(group, positionY)
    {
        if (group.isEmpty())
        {
            return;
        }

        // Get port width and height.
        var portWidth = group.children[0].bounds.width;
        var portHeight = group.children[0].bounds.height;
        var groupWidth = group.children.length * portWidth;

        // Get position parameters.
        var offsetX = group.children[0].bounds.width;
        var farLeft = this.position.x - (groupWidth / 2);

        for (var i = 0; i < group.children.length; i++)
        {
            var port = group.children[i];
            var positionX = (farLeft + (offsetX * (i + 1))) - (group.children[i].bounds.width / 2);
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

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle double click.
     */
    _handleDoubleClick(mouseEvent)
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_VIEW, {url: this.getModelURL()});
    }
}

export default WorkflowJobItem;