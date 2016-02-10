import paper from 'paper';
import BaseItem from './BaseItem';
import Configuration from '../../../Configuration';
import Events from '../../../Shared/Events';
import WorkflowJobGroupCoordinateSet from '../Models/WorkflowJobGroupCoordinateSet';

/**
 * WorkflowJobGroup item.
 */
class WorkflowJobGroupItem extends BaseItem
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
        this.getModelEvent = Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOBGROUP;
        this.menuItems = [{label: 'Ungroup', radiorequest: Events.REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOBGROUP, options: {model: options.model}}];

        // Set coordinate set info.
        this.coordinateSetInfo = [];
        this.coordinateSetInfo['class'] = WorkflowJobGroupCoordinateSet;
        this.coordinateSetInfo['url'] = 'workflow_job_group';

        this.fillColor = Configuration.WORKFLOWBUILDER.WORKFLOWJOBGROUP_FILL_COLOR;
        
        this._paperGroupInputPorts = new paper.Group();
        this.addChild(this._paperGroupInputPorts);
        this._paperGroupOutputPorts = new paper.Group();
        this.addChild(this._paperGroupOutputPorts);

        // Attempt coordinate load.
        this.loadCoordinates();

        this.onDoubleClick = event => this._handleDoubleClick(event);

        this.update();
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
     * Destroy cleanup.
     */
    destroy()
    {
        // Reassociate ports.
        var inputPortItems = this._removeInputPortItems();
        for (var index in inputPortItems)
        {
            inputPortItems[index].reassociate();
        }
        var outputPortItems = this._removeOutputPortItems();
        for (var index in outputPortItems)
        {
            outputPortItems[index].reassociate();
        }

        if (this._paperGroupInputPorts.children.length > 0 || this._paperGroupOutputPorts.children.length > 0)
        {
            console.log('TODO - cant delete this item until all ports are deleted');
            return;
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
            group.children[i].update();
        }
    }

    /**
     * Removes and returns all InputPortItems.
     */
    _removeInputPortItems()
    {
        var children = this._paperGroupInputPorts.removeChildren();
        this.update();
        return children;
    }

    /**
     * Removes and returns all OutputPortItems.
     */
    _removeOutputPortItems()
    {
        var children = this._paperGroupOutputPorts.removeChildren();
        this.update();
        return children;
    }

    /**
     * Handle double click.
     */
    _handleDoubleClick(mouseEvent)
    {
        var view = this.rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_VIEW, {url: this.getModelURL()});
        this.rodanChannel.request(Events.REQUEST__MODAL_SHOW, {view: view, description: 'WorkflowJobGroup: ' + this.getDescription()});
    }
}

export default WorkflowJobGroupItem;