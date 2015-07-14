import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import _ from 'underscore';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_WorkflowRun from '../../../../../Models/VISRC_WorkflowRun';
import VISRC_ViewInputPortList from './InputPort/VISRC_ViewInputPortList';
import VISRC_ViewResourceList from './Resource/VISRC_ViewResourceList';
import VISRC_ViewWorkflowRunData from './VISRC_ViewWorkflowRunData';

/**
 * LayoutView for creating a new workflow run.
 */
class VISRC_LayoutViewNewWorkflowRun extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize(aOptions)
    {
        this._workflow = aOptions.workflow;
        this.addRegions({
            regionData: "#region-main_workflowrun_newworkflowrun_data",
            regionInputPortList: "#region-main_workflowrun_newworkflowrun_inputport_list",
            regionResourceList: "#region-main_workflowrun_newworkflowrun_resource_list"
        });
        this.template = "#template-main_workflowrun_newworkflowrun";
        this._initializeRadio();
        this._initializeViews();
        this._resourceAssignments = {};
    }

    /**
     * Insert views.
     */
    onBeforeShow()
    {
        this.regionData.show(this._viewData);
        this.regionInputPortList.show(this._viewInputPortList);
        this.regionResourceList.show(this._viewResourceList);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.reply(VISRC_Events.REQUEST__WORKFLOWRUNCREATOR_IS_RESOURCEASSIGNMENT, aPass => this._handleRequestIsResourceAssignment(aPass));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWRUNCREATOR_ADD_RESOURCEASSIGNMENT, aPass => this._handleCommandAddRequest(aPass));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWRUNCREATOR_REMOVE_RESOURCEASSIGNMENT, aPass => this._handleCommandRemoveRequest(aPass));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWRUNCREATOR_CREATE_WORKFLOWRUN, aPass => this._handleCommandCreate(aPass));
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this._viewInputPortList = new VISRC_ViewInputPortList({workflow: this._workflow});
        this._viewResourceList = new VISRC_ViewResourceList({workflow: this._workflow});
        this._viewData = new VISRC_ViewWorkflowRunData({workflow: this._workflow});
    }

    /**
     * Handle request is resource assignment. Return true iff associated input port and resource exist as assignment.
     */
    _handleRequestIsResourceAssignment(aPass)
    {
        return this._isResourceAssignment(aPass.inputport.get("url"), aPass.resource.get("url"));
    }

    /**
     * Handle create resource assignment request command.
     */
    _handleCommandAddRequest(aPass)
    {
        // todo - error checking?
        this._addResourceAssignment(aPass.inputport.get("url"), aPass.resource.get("url"));
    }

    /**
     * Handle remove resource assignment request command.
     */
    _handleCommandRemoveRequest(aPass)
    {
        // todo - error checking?
        this._removeResourceAssignment(aPass.inputport.get("url"), aPass.resource.get("url"));
    }

    /**
     * Handle create command.
     */
    _handleCommandCreate(aPass)
    {
        var workflowRun = new VISRC_WorkflowRun(aPass);
        workflowRun.set("resource_assignments", this._resourceAssignments);
        workflowRun.set("workflow", this._workflow.get("url"));
        workflowRun.save();
    }

    /**
     * Return true iff resource assignment exists.
     */
    _isResourceAssignment(aInputPortUrl, aResourceUrl)
    {
        return _.has(this._resourceAssignments, aInputPortUrl) && this._resourceAssignments[aInputPortUrl].indexOf(aResourceUrl) > -1;
    }

    /**
     * Add resource assignment.
     */
    _addResourceAssignment(aInputPortUrl, aResourceUrl)
    {
        if (!this._isResourceAssignment(aInputPortUrl, aResourceUrl))
        {
            if (!_.has(this._resourceAssignments, aInputPortUrl))
            {
                this._resourceAssignments[aInputPortUrl] = [];
            }
            this._resourceAssignments[aInputPortUrl].push(aResourceUrl);
        }
    }

    /**
     * Remove resource assignment.
     */
    _removeResourceAssignment(aInputPortUrl, aResourceUrl)
    {
        if (this._isResourceAssignment(aInputPortUrl, aResourceUrl))
        {
            var index = this._resourceAssignments[aInputPortUrl].indexOf(aResourceUrl);
            this._resourceAssignments[aInputPortUrl].splice(index, 1);
        }
    }
}

export default VISRC_LayoutViewNewWorkflowRun;