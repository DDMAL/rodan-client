import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import _ from 'underscore';

import Events from '../../../../Shared/Events';

/**
 * View for status bar messages.
 */
class ViewStatusMessage extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this._initializeRadio();
        this.model = new Backbone.Model({text: null});
        this.modelEvents = {
            'all': 'render'
        };
        this.template = () => this._template();
    }

    /**
     * Return template.
     */
    _template()
    {
        return _.template($('#template-status_message').html())({test: this.model.get('text')});
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
        this._rodanChannel.comply(Events.COMMAND__DISPLAY_MESSAGE, options => this._processMessage(options));
    }

    /**
     * Process message.
     */
    _processMessage(options)
    {
        this.model.set('text', options.text);
    }
}

export default ViewStatusMessage;