import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';
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
     * Initialize.
     */
    initialize(options)
    {
        this._initializeRadio();
        this.addRegions({
            regionControlWorkflowJob: '#region-main_workflowjob',
            regionControlPorts: '#region-main_workflowjob_ports',
            regionControlSettings: '#region-main_workflowjob_settings'
        });
        this.model = options.workflowjob;
        this._initializeViews(options);
    }

    /**
     * Initially show just settings.
     */
    onBeforeShow()
    {
        // Empty regions.
        this.regionControlPorts.empty();
        this.regionControlSettings.empty();

        
        this.regionControlPorts.show(this._portsLayoutView);
        this.regionControlSettings.show(this._viewSettings);
        this._showSettings();
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
     * Handle save button.
     */
    _handleButtonSave()
    {
        this.model.set({'name': this.ui.textName.val()});
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_SAVE_WORKFLOWJOB, {workflowjob: this.model});
    }

    /**
     * Handle delete button.
     */
    _handleButtonDelete()
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOB, {model: this.model});
    }

    /**
     * Handle button show Ports.
     */
    _showPorts()
    {
        this.regionControlSettings.$el.hide();
        this.ui.buttonTogglePorts.css('text-decoration', 'underline');
        this.ui.buttonToggleSettings.css('text-decoration', 'none');
        if (!this.regionControlPorts.$el.is(':visible'))
        {
            this.regionControlPorts.$el.toggle('fast');
        }
    }

    /**
     * Handle button show Settings.
     */
    _showSettings()
    {
        this.regionControlPorts.$el.hide();
        this.ui.buttonTogglePorts.css('text-decoration', 'none');
        this.ui.buttonToggleSettings.css('text-decoration', 'underline');
        if (!this.regionControlSettings.$el.is(':visible'))
        {
            this.regionControlSettings.$el.toggle('fast');
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewControlWorkflowJob.prototype.template = '#template-main_workflowjob';
LayoutViewControlWorkflowJob.prototype.ui = {
    buttonTogglePorts: '#button-ports_toggle',
    buttonToggleSettings: '#button-settings_toggle',
    buttonSave: '#button-save_workflowjob_data',
    buttonDelete: '#button-delete_workflowjob',
    textName: '#text-workflowjob_name'
};
LayoutViewControlWorkflowJob.prototype.events = {
    'click @ui.buttonTogglePorts': '_showPorts',
    'click @ui.buttonToggleSettings': '_showSettings',
    'click @ui.buttonSave': '_handleButtonSave',
    'click @ui.buttonDelete': '_handleButtonDelete'
};

export default LayoutViewControlWorkflowJob;