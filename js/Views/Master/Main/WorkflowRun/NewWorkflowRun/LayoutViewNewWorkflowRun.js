import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import _ from 'underscore';

import Events from '../../../../../Shared/Events';
import WorkflowRun from '../../../../../Models/WorkflowRun';
import ViewInputPortList from './InputPort/ViewInputPortList';
import ViewResourceList from './Resource/ViewResourceList';
import ViewWorkflowRunData from './ViewWorkflowRunData';

/**
 * LayoutView for creating a new workflow run.
 */
class LayoutViewNewWorkflowRun extends Marionette.LayoutView
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
            regionData: '#region-main_workflowrun_newworkflowrun_data',
            regionInputPortList: '#region-main_workflowrun_newworkflowrun_inputport_list',
            regionResourceList: '#region-main_workflowrun_newworkflowrun_resource_list'
        });
        this.template = '#template-main_workflowrun_newworkflowrun';
        this._initializeRadio();
        this._initializeViews();
        this._resourceAssignments = {};
    }

    /**
     * Insert views.
     */
    onBeforeShow()
    {
        this.regionData.empty();
        this.regionInputPortList.empty();
        this.regionResourceList.empty();
        this._viewInputPortList = new ViewInputPortList({workflow: this._workflow});
        this._viewResourceList = new ViewResourceList({workflow: this._workflow});
        this._viewData = new ViewWorkflowRunData({workflow: this._workflow});
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
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWRUNCREATOR_IS_RESOURCEASSIGNMENT, aPass => this._handleRequestIsResourceAssignment(aPass));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWRUNCREATOR_ADD_RESOURCEASSIGNMENT, aPass => this._handleCommandAddRequest(aPass));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWRUNCREATOR_REMOVE_RESOURCEASSIGNMENT, aPass => this._handleCommandRemoveRequest(aPass));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWRUNCREATOR_CREATE_WORKFLOWRUN, aPass => this._handleCommandCreate(aPass));
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
    }

    /**
     * Handle request is resource assignment. Return true iff associated input port and resource exist as assignment.
     */
    _handleRequestIsResourceAssignment(aPass)
    {
        return this._isResourceAssignment(aPass.inputport.get('url'), aPass.resource.get('url'));
    }

    /**
     * Handle create resource assignment request command.
     */
    _handleCommandAddRequest(aPass)
    {
        this._addResourceAssignment(aPass.inputport.get('url'), aPass.resource.get('url'));
    }

    /**
     * Handle remove resource assignment request command.
     */
    _handleCommandRemoveRequest(aPass)
    {
        this._removeResourceAssignment(aPass.inputport.get('url'), aPass.resource.get('url'));
    }

    /**
     * Handle create command.
     */
    _handleCommandCreate(aPass)
    {
        var workflowRun = new WorkflowRun(aPass);
        workflowRun.set('resource_assignments', this._resourceAssignments);
        workflowRun.set('workflow', this._workflow.get('url'));
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

export default LayoutViewNewWorkflowRun;