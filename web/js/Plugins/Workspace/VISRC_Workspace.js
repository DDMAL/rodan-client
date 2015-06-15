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

        this._initializeRadio();
    }

    /**
     * Call this to activate the workspace.
     */
    activate()
    {
        console.log("activate");
    }

    /**
     * Call this to deactivate the workspace.
     */
    deactivate()
    {
        console.log("here again");
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
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKSPACE_ADD_ITEM_WORKFLOW, aReturn => this._handleCommandAddWorkflowItem(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKSPACE_ADD_ITEM_WORKFLOWJOB, aReturn => this._handleCommandAddWorkflowJobItem(aReturn));
    }

    /**
     * Handle add.
     */
    _handleEventAddWorkflowItem(aReturn)
    {
        console.log("workspace - added workflow");
        // TODO - refactor all ofo this
     //   var test = new VISRC_WorkflowJobItem({model: aReturn.job});
       // paper.view.draw();
    }

    /**
     * Handle add.
     */
    _handleCommandAddWorkflowJobItem(aReturn)
    {
        // TODO - refactor all ofo this
        var test = new VISRC_WorkflowJobItem({model: aReturn.job});
        paper.view.draw();
    }
}

export default VISRC_Workspace;