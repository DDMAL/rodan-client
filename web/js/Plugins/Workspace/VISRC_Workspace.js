import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../Shared/VISRC_Events';
import VISRC_WorkflowJobItem from './Items/VISRC_WorkflowJobItem';

/**
 * Main Workspace class.
 */
class VISRC_Workspace
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize the workspace.
     * The element associated with the canvas ID MUST be available at this time.
     */
    initialize(aCanvasElementId)
    {
        paper.setup(aCanvasElementId);
        this._workflowJobMap = {};
        this._initializeRadio();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKSPACE_ADD_ITEM_WORKFLOWJOB, aReturn => this._handleCommandAddWorkflowJobItem(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKSPACE_UPDATE_ITEM_WORKFLOWJOB, aReturn => this._handleCommandUpdateWorkflowJobItem(aReturn));
    }

    /**
     * Handle add.
     */
    _handleCommandAddWorkflowJobItem(aReturn)
    {
        this._createWorkflowJobItem(aReturn.workflowjob);
        paper.view.draw();
    }

    /**
     * Handle workflow job update.
     */
    _handleCommandUpdateWorkflowJobItem(aReturn)
    {
        this._updateWorkflowJobItem(aReturn.workflowjob);
    }

    /**
     * Creates a workflow job item and adds it to the map.
     */
    _createWorkflowJobItem(aModel)
    {
        var workflowJobItem = new VISRC_WorkflowJobItem({model: aModel});
        this._workflowJobMap[aModel.cid] = workflowJobItem;
    }

    /**
     * Updates an individual workflow job item. Passes associated workflow job.
     */
    _updateWorkflowJobItem(aWorkflowJob)
    {
        if (aWorkflowJob.cid in this._workflowJobMap)
        {
            this._workflowJobMap[aWorkflowJob.cid].update();
        }
    }

    /**
     * Updates all workflow jobs.
     */
    _updateWorkflowJobItems()
    {
        for (var key in this._workflowJobMap)
        {
            this._workflowJobMap[key].update();
        } 
    }
}

export default VISRC_Workspace;