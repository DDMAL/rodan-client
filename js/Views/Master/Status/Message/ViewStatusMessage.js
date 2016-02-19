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
    }

    /**
     * Returns template.
     */
    getTemplate()
    {
        return _.template($('#template-status_message').html())({messageText: this.model.get('text')});
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
        this.rodanChannel.reply(Events.REQUEST__DISPLAY_MESSAGE, options => this._processMessage(options));
    }

    /**
     * Process message.
     */
    _processMessage(options)
    {
        this.model.set('text', options.text);
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewStatusMessage.prototype.modelEvents = {
    'all': 'render'
};
ViewStatusMessage.prototype.model = new Backbone.Model({text: 'initialized'});

export default ViewStatusMessage;