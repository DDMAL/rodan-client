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
        this._workflowJob = null;
        this.template = "#template-main_workflowbuilder_control_workflowjob";
    }

    /**
     * Initially show the list.
     */
    onShow()
    {
        this.regionControlWorkflowJob.show(this._viewWorkflowJob);
        this.regionControlInputPortTypes.show(this._inputPortTypeListView);
        this.regionControlInputPorts.show(this._inputPortListView);
        this.regionControlOutputPortTypes.show(this._outputPortTypeListView);
        this.regionControlOutputPorts.show(this._outputPortListView);
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
     * Handle workflowjob selection.
     */
    _handleEventWorkflowJobSelected(aReturn)
    {
        // Create new workflow job view.
        this._workflowJob = aReturn.workflowjob;
        this._viewWorkflowJob = new VISRC_ViewWorkflowJob(aReturn);

        // Create new input port and output port views.
        // We pass the workflow job so the views' initializers can setup their collections.
        this._inputPortListView = new VISRC_ViewInputPortList(aReturn);
        this._outputPortListView = new VISRC_ViewOutputPortList(aReturn);

        // Create new port type lists. We pass the workflow job, which has info on the associated job.
        // The list views will do the rest.
        this._inputPortTypeListView = new VISRC_ViewInputPortTypeList(aReturn);
        this._outputPortTypeListView = new VISRC_ViewOutputPortTypeList(aReturn);
    }
}

export default VISRC_LayoutViewControlWorkflowJob;