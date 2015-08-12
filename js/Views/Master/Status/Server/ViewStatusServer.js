import $ from 'jquery';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import _ from 'underscore';

import Events from '../../../../Shared/Events';

/**
 * This class represents the view (and controller) for the status bar - server info.
 */
class ViewStatusServer extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize()
    {
        this.model = null;
        this.modelEvents = {
            'all': 'render'
        };
        this._initializeRadio();
        this.template = () => this._template();
    }

    /**
     * Provide server info with tempalte.
     */
    _template()
    {
        var hostname = this.rodanChannel.request(Events.REQUEST__SERVER_HOSTNAME);
        var version = this.rodanChannel.request(Events.REQUEST__SERVER_VERSION_RODAN);
        return _.template($('#template-status_server').html())({hostname: hostname, version: version});
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
}

export default ViewStatusServer;