import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_ViewWorkflowJob from './WorkflowJob/VISRC_ViewWorkflowJob';
import VISRC_ViewInputPortList from './WorkflowJob/VISRC_ViewInputPortList';
import VISRC_ViewInputPortTypeList from './WorkflowJob/VISRC_ViewInputPortTypeList';
import VISRC_ViewOutputPortList from './WorkflowJob/VISRC_ViewOutputPortList';
import VISRC_ViewOutputPortTypeList from './WorkflowJob/VISRC_ViewOutputPortTypeList';

/**
 * This class represents the view for editing workflowjobs.
 */
class VISRC_LayoutViewControlWorkflowJob extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.addRegions({
            regionControlWorkflowJob: "#region-main_workflowbuilder_control_workflowjob",
            regionControlInputPortTypes: "#region-main_workflowbuilder_control_workflowjob_inputporttypes",
            regionControlInputPorts: "#region-main_workflowbuilder_control_workflowjob_inputports",
            regionControlOutputPortTypes: "#region-main_workflowbuilder_control_workflowjob_outputporttypes",
            regionControlOutputPorts: "#region-main_workflowbuilder_control_workflowjob_outputports"
        });
        this._initializeRadio();
        this._initializeViews();
        this._workflowJob = null;
        this.template = "#template-main_workflowbuilder_control_workflowjob";
    }

    /**
     * Initially show the list.
     */
    onShow()
    {
        this.regionControlWorkflowJob.show(this._viewWorkflowJob, {preventDestroy: true});
        this.regionControlInputPortTypes.show(this._inputPortTypeListView, {preventDestroy: true});
        this.regionControlInputPorts.show(this._inputPortListView, {preventDestroy: true});
        this.regionControlOutputPortTypes.show(this._outputPortTypeListView, {preventDestroy: true});
        this.regionControlOutputPorts.show(this._outputPortListView, {preventDestroy: true});
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
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, aReturn => this._handleEventWorkflowJobSelected(aReturn));
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this._inputPortTypeListView = new VISRC_ViewInputPortTypeList();
        this._inputPortListView = new VISRC_ViewInputPortList();
        this._outputPortTypeListView = new VISRC_ViewOutputPortTypeList();
        this._outputPortListView = new VISRC_ViewOutputPortList();
    }

    /**
     * Handle workflowjob selection.
     */
    _handleEventWorkflowJobSelected(aReturn)
    {
        this._workflowJob = aReturn.workflowjob;
        this._viewWorkflowJob = new VISRC_ViewWorkflowJob(aReturn);
        this._inputPortListView.collection = this._workflowJob.get("input_ports");
        this._outputPortListView.collection = this._workflowJob.get("output_ports");
    }
}

export default VISRC_LayoutViewControlWorkflowJob;