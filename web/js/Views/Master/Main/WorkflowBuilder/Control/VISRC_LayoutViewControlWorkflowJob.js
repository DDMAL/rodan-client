import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_ViewWorkflowJob from './WorkflowJob/VISRC_ViewWorkflowJob';
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
        // show other stuff...
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
    }

    /**
     * Handle workflowjob selection.
     */
    _handleEventWorkflowJobSelected(aReturn)
    {
        this._workflowJob = aReturn.workflowJob;
        this._viewWorkflowJob = new VISRC_ViewWorkflowJob(aReturn);
    }

}

export default VISRC_LayoutViewControlWorkflowJob;