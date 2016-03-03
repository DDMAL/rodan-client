import paper from 'paper';
import Radio from 'backbone.radio';
import BaseItem from './BaseItem';
import BaseWorkflowJobItem from './BaseWorkflowJobItem';
import Configuration from '../../../Configuration';
import Events from '../../../Shared/Events';
import GUI_EVENTS from '../Shared/Events';
import WorkflowJobCoordinateSet from '../Models/WorkflowJobCoordinateSet';

/**
 * WorkflowJob item.
 */
class WorkflowJobItem extends BaseWorkflowJobItem
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
        var workflowJobIds = Radio.channel('rodan-client_gui').request(GUI_EVENTS.REQUEST__WORKFLOWBUILDER_GUI_GET_SELECTED_WORKFLOWJOB_IDS);
        return [{channel: 'rodan', label: 'Group', radiorequest: Events.REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOBGROUP, options: {workflowjobids: workflowJobIds}}];
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
        this.menuItems = [{label: 'Edit', radiorequest: Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_VIEW, options: {url: this.getModelURL()}},
                          {label: 'Settings', radiorequest: Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_SETTINGS_VIEW, options: {url: this.getModelURL()}},
                          {label: 'Ports', radiorequest: Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_PORTS_VIEW, options: {url: this.getModelURL()}},
                          {label: 'Delete', radiorequest: Events.REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOB, options: {model: options.model}}];
        this.coordinateSetInfo = [];
        this.coordinateSetInfo['class'] = WorkflowJobCoordinateSet;
        this.coordinateSetInfo['url'] = 'workflow_job';
        this.loadCoordinates();
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
     * Handle double click.
     */
    _handleDoubleClick(mouseEvent)
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_VIEW, {url: this.getModelURL()});
    }
}

export default WorkflowJobItem;