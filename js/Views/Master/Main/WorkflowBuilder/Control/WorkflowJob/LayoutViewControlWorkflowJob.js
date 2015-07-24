import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../Shared/Events';
import LayoutViewControlPorts from './Ports/LayoutViewControlPorts';
import ViewSettings from './Settings/ViewSettings';

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
            regionControlPorts: '#region-main_workflowbuilder_control_ports',
            regionControlSettings: '#region-main_workflowbuilder_control_settings'
        });
        this.model = aParameters.workflowjob;
        this._initializeViews(aParameters);
        this.template = '#template-main_workflowbuilder_control_workflowjob';
        this.ui = {
            buttonTogglePorts: '#button-ports_toggle',
            buttonToggleSettings: '#button-settings_toggle',
            buttonShowWorkflow: '#button-show_workflow',
            buttonSave: '#button-save_workflowjob_data',
            textName: '#text-workflowjob_name'
        };
        this.events = {
            'click @ui.buttonTogglePorts': '_handleButtonTogglePorts',
            'click @ui.buttonToggleSettings': '_handleButtonToggleSettings',
            'click @ui.buttonShowWorkflow': '_handleButtonShowWorkflow',
            'click @ui.buttonSave': '_handleButtonSave'
        };
    }

    /**
     * Initially show just settings.
     */
    onBeforeShow()
    {
        this.regionControlPorts.show(this._portsLayoutView);
        this.regionControlSettings.show(this._viewSettings);
        this.regionControlPorts.$el.hide();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle workflowjob selection.
     */
    _initializeViews(aParameters)
    {
        this._portsLayoutView = new LayoutViewControlPorts(aParameters);
        this._viewSettings = new ViewSettings(aParameters);
    }
    
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle button toggle ports.
     */
    _handleButtonTogglePorts()
    {
        if (this.regionControlSettings.$el.is(':visible'))
        {
            this.regionControlSettings.$el.toggle('fast');
        }
        this.regionControlPorts.$el.toggle('fast');
    }

    /**
     * Handle button toggle settings.
     */
    _handleButtonToggleSettings()
    {
        if (this.regionControlPorts.$el.is(':visible'))
        {
            this.regionControlPorts.$el.toggle('fast');
        }
        this.regionControlSettings.$el.toggle('fast');
    }

    /**
     * Handle button show workflow.
     */
    _handleButtonShowWorkflow()
    {
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, {});
    }

    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOWJOB, {name: this.ui.textName.val()});
    }
}

export default LayoutViewControlWorkflowJob;