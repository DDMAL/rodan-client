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
    initialize(aParameters)
    {
        this.model = aParameters.workflowjob;
        this._initializeRadio();
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
        this._rodanChannel = Radio.channel('rodan');
    }

    /**
     * Save settings.
     */
    _saveSettings()
    {
        var element = this._getJQueryElement();
        if ($(element).is(":visible"))
        {
            this.model.set({'job_settings': this._editor.getValue()});
            this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_SAVE_WORKFLOWJOB, {'workflowjob': this.model});
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

        // Check if we have settings.
        var startValues = this.model.get('job_settings');
        startValues = $.isEmptyObject(startValues) ? null : startValues;
        if (startValues !== null)
        {
            $(element).show();
            var jobUuid = this.model.getJobUuid();
            var collection = this._rodanChannel.request(Events.REQUEST__COLLECTION_JOB);
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
                form_name_root: ''
            };
            this._editor = new JSONEditor.JSONEditor(element, settingsSchema); 
            this._editor.on('change', () => this._saveSettings());
        }
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
ViewSettings.prototype.template = '#template-main_workflowbuilder_control_settings';

export default ViewSettings;