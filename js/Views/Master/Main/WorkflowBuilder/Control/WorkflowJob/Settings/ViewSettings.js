import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

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
    initialize()
    {
        this.modelEvents = {
            'all': 'render'
        };
        this.model = null;
        this._initializeRadio();
        this.template = '#template-main_workflowbuilder_control_settings';
        this.ui = {
        };
        this.events = {
        };
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
}

export default ViewSettings;