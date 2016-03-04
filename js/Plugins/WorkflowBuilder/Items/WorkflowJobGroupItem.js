import paper from 'paper';
import BaseItem from './BaseItem';
import BaseWorkflowJobItem from './BaseWorkflowJobItem';
import Configuration from '../../../Configuration';
import Events from '../../../Shared/Events';
import WorkflowJobGroupCoordinateSet from '../Models/WorkflowJobGroupCoordinateSet';

/**
 * WorkflowJobGroup item.
 */
class WorkflowJobGroupItem extends BaseWorkflowJobItem
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
        this._workflowJobUrls = options.model.get('workflow_jobs');
        this.menuItems = [{label: 'Edit', radiorequest: Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOBGROUP_VIEW, options: {workflowjobgroup: this.getModel()}},
                          {label: 'Ungroup', radiorequest: Events.REQUEST__WORKFLOWBUILDER_UNGROUP_WORKFLOWJOBGROUP, options: {model: options.model}},
                          {label: 'Delete', radiorequest: Events.REQUEST__WORKFLOWBUILDER_REMOVE_WORKFLOWJOBGROUP, options: {model: options.model}}];

        this.coordinateSetInfo = [];
        this.coordinateSetInfo['class'] = WorkflowJobGroupCoordinateSet;
        this.coordinateSetInfo['url'] = 'workflow_job_group';
        this.loadCoordinates();
        this.fillColor = Configuration.WORKFLOWBUILDER.WORKFLOWJOBGROUP_FILL_COLOR;
        this._gotPorts = false;
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

        super.update();
    }

    /**
     * Destroy cleanup.
     */
    destroy()
    {
        this._setWorkflowJobVisibility(true);
        var inputPortItems = this._paperGroupInputPorts.removeChildren();
        var outputPortItems = this._paperGroupOutputPorts.removeChildren();
        for (var index in inputPortItems)
        {
            inputPortItems[index].resetOwner();
        }
        for (var index in outputPortItems)
        {
            outputPortItems[index].resetOwner();
        }
        super.destroy();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle double click.
     */
    _handleDoubleClick(mouseEvent)
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOBGROUP_VIEW, {workflowjobgroup: this.getModel()});
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