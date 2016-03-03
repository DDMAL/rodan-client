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

        // First, collect the WorkflowJob URLs. When we update we'll need to make sure these guys are hidden.
        this._workflowJobUrls = options.model.get('workflow_jobs');

        this.menuItems = [{label: 'Edit', radiorequest: Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOBGROUP_VIEW, options: {url: this.getModelURL()}},
                          {label: 'Ungroup', radiorequest: Events.REQUEST__WORKFLOWBUILDER_UNGROUP_WORKFLOWJOBGROUP, options: {model: options.model}},
                          {label: 'Delete', radiorequest: Events.REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOBGROUP, options: {model: options.model}}];

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

        this._gotPorts = false;
    }

    /**
     * Adds input port item.
     */
    addInputPortItem(inputPortItem)
    {
        this._paperGroupInputPorts.addChild(inputPortItem);
    }

    /**
     * Adds output port item.
     */
    addOutputPortItem(outputPortItem)
    {
        this._paperGroupOutputPorts.addChild(outputPortItem);
    }

    /**
     * Update.
     */
    update()
    {
        // Make sure WorkflowJobItems are hidden.
        this._setWorkflowJobVisibility(false);

        // We need to get the associated ports.
        if (!this._gotPorts)
        {
            this._getAssociatedPorts();
        }

        // Do updates.
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
        // Make sure WorkflowJobItems are shown.
        this._setWorkflowJobVisibility(true);

        // Reassociate ports.
        var inputPortItems = this._removeInputPortItems();
        for (var index in inputPortItems)
        {
            inputPortItems[index].resetOwner();
        }
        var outputPortItems = this._removeOutputPortItems();
        for (var index in outputPortItems)
        {
            outputPortItems[index].resetOwner();
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
        }
    }

    /**
     * Removes and returns all InputPortItems.
     */
    _removeInputPortItems()
    {
        var children = this._paperGroupInputPorts.removeChildren();
        return children;
    }

    /**
     * Removes and returns all OutputPortItems.
     */
    _removeOutputPortItems()
    {
        var children = this._paperGroupOutputPorts.removeChildren();
        return children;
    }

    /**
     * Handle double click.
     */
    _handleDoubleClick(mouseEvent)
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOBGROUP_VIEW, {url: this.getModelURL()});
    }

    /**
     * Set visibility of associated WorkflowJobItems.
     */
    _setWorkflowJobVisibility(visible)
    {
        for (var index in this._workflowJobUrls)
        {
            var item = BaseItem.getAssociatedItem(this._workflowJobUrls[index]);
            if (item)
            {
                item.setVisible(visible);
            }
        }  
    }

    /**
     * Get associated ports.
     */
    _getAssociatedPorts()
    {
        var ports = this.rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_GET_PORTS, {url: this._modelURL});
        if (ports)
        {
            for (var index in ports.inputports)
            {
                var inputPortItem = BaseItem.getAssociatedItem(ports.inputports[index].get('url'));
                inputPortItem.setOwner(this._modelURL);
            }

            for (var index in ports.outputports)
            {
                var outputPortItem = BaseItem.getAssociatedItem(ports.outputports[index].get('url'));
                outputPortItem.setOwner(this._modelURL);
            }
            this._gotPorts = true;
        }
    }
}

export default WorkflowJobGroupItem;