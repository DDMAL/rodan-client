import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import JSONEditor from 'json-editor';

import Events from '../../../../../../../Shared/Events';

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
        this.modelEvents = {
            'all': 'render'
        };
        this.model = aParameters.workflowjob;
        this._initializeRadio();
        this.template = '#template-main_workflowbuilder_control_settings';
        this.ui = {
            buttonSaveSettings: '#button-save_settings'
        };
        this.events = {
            'click @ui.buttonSaveSettings': '_handleButtonSaveSettings'
        };
    }

    onRender()
    {
        this._createEditor();
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
     * Handle button save settings.
     */
    _handleButtonSaveSettings()
    {
        this._rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOWJOB, {'job_settings': this._editor.getValue()});
    }

    /**
     * Creates editor.
     */
    _createEditor()
    {
        var jobUuid = this.model.getJobUuid();
        var collection = this._rodanChannel.request(Events.REQUEST__COLLECTION_JOB);
        var job = collection.get(jobUuid);
        var element = $(this.$el.find('#workflowjob-settings')[0])[0];

        // Only set start values if we have them.
        var startValues = this.model.get('job_settings');
        startValues = $.isEmptyObject(startValues) ? null : startValues;

        var settingsSchema = { 
            schema: job.get('settings'),
            ajax: true,
            disable_collapse: true,
            disable_edit_json: true,
            disable_properties: true,
            no_additional_properties: true,
            show_errors: 'always',
            startval: startValues
        };
        this._editor = new JSONEditor.JSONEditor(element, settingsSchema); 
    }
}

export default ViewSettings;