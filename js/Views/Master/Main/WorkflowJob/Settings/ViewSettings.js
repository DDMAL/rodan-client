import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import JSONEditor from 'json-editor';

import Events from '../../../../../Shared/Events';

/**
 * This represents settings for a workflow job.
 */
class ViewSettings extends Marionette.ItemView
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
        this._workflow = options.workflow;
    }

    onRender()
    {
        this._initializeSettingsDisplay();
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
    }

    /**
     * Save settings.
     */
    _handleButtonSave()
    {
        var element = this._getJQueryElement();
        if ($(element).is(':visible'))
        {
            this.model.set('job_settings', this._editor.getValue());
            this.rodanChannel.request(Events.REQUEST__WORKFLOWJOB_SAVE, {workflowjob: this.model, workflow: this._workflow});
        }
    }

    /**
     * Initializes settings display.
     */
    _initializeSettingsDisplay()
    {
        // Initially hide.
        var element = this._getJQueryElement();
        $(element).hide();

        // Create settings.
        var startValues = this.model.get('job_settings');
        startValues = $.isEmptyObject(startValues) ? null : startValues;
        $(element).show();
        var jobUuid = this.model.getJobUuid();
        var collection = this.rodanChannel.request(Events.REQUEST__GLOBAL_JOB_COLLECTION);
        var job = collection.get(jobUuid);
        var settingsSchema = { 
            schema: job.get('settings'),
            theme: 'bootstrap3',
            disable_collapse: true,
            disable_edit_json: true,
            disable_properties: true,
            no_additional_properties: true,
            show_errors: 'always',
            startval: startValues,
            form_name_root: ' '
        };
        this._editor = new JSONEditor.JSONEditor(element, settingsSchema); 
    }

    /**
     * Get HTML element as jQuery object.
     */
    _getJQueryElement()
    {
        return $(this.$el.find('#workflowjob-settings')[0])[0];
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewSettings.prototype.modelEvents = {
    'all': 'render'
};
ViewSettings.prototype.ui = {
    buttonSave: '#button-save_workflowjob_settings'
        };
ViewSettings.prototype.events = {
    'click @ui.buttonSave': '_handleButtonSave'
        };
ViewSettings.prototype.template = '#template-main_workflowjob_settings';

export default ViewSettings;