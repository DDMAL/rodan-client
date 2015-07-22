import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../Shared/Events';
import ViewInputPortList from './ViewInputPortList';
import ViewInputPortTypeList from './ViewInputPortTypeList';
import ViewOutputPortList from './ViewOutputPortList';
import ViewOutputPortTypeList from './ViewOutputPortTypeList';

/**
 * This class represents the view for editing workflowjobs.
 * It just holds a bunch of views and doesn't do much than that.
 */
class LayoutViewControlWorkflowJob extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this._initializeRadio();
        this.addRegions({
            regionControlWorkflowJob: '#region-main_workflowbuilder_control_workflowjob',
            regionControlInputPortTypes: '#region-main_workflowbuilder_control_workflowjob_inputporttypes',
            regionControlInputPorts: '#region-main_workflowbuilder_control_workflowjob_inputports',
            regionControlOutputPortTypes: '#region-main_workflowbuilder_control_workflowjob_outputporttypes',
            regionControlOutputPorts: '#region-main_workflowbuilder_control_workflowjob_outputports'
        });
        this.model = aParameters.workflowjob;
        this._workflowJob = aParameters.workflowjob;
        this._initializeViews(aParameters);
        this.template = '#template-main_workflowbuilder_control_workflowjob';
        this.ui = {
            buttonShowWorkflow: '#button-show_workflow',
            buttonSave: '#button-save_workflowjob_data',
            textName: '#text-workflowjob_name'
        };
        this.events = {
            'click @ui.buttonShowWorkflow': '_handleButtonShowWorkflow',
            'click @ui.buttonSave': '_handleButtonSave'
        };
    }

    /**
     * Initially show the list.
     */
    onBeforeShow()
    {
        this.regionControlInputPortTypes.show(this._inputPortTypeListView);
        this.regionControlInputPorts.show(this._inputPortListView);
        this.regionControlOutputPortTypes.show(this._outputPortTypeListView);
        this.regionControlOutputPorts.show(this._outputPortListView);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle workflowjob selection.
     */
    _initializeViews(aParameters)
    {
        // Create new input port and output port views.
        // We pass the workflow job so the views' initializers can setup their collections.
        this._inputPortListView = new ViewInputPortList(aParameters);
        this._outputPortListView = new ViewOutputPortList(aParameters);

        // Create new port type lists. We pass the workflow job, which has info on the associated job.
        // The list views will do the rest.
        this._inputPortTypeListView = new ViewInputPortTypeList(aParameters);
        this._outputPortTypeListView = new ViewOutputPortTypeList(aParameters);
    }
    
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle button show workflow.
     */
    _handleButtonShowWorkflow()
    {
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, {});
    }
}

export default LayoutViewControlWorkflowJob;