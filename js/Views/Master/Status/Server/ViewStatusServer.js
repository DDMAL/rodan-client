import $ from 'jquery';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import _ from 'underscore';

import Configuration from '../../../../Configuration';
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
     * Initialize.
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

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.on(Events.EVENT__SERVER_DATE_UPDATED, options => this._showServerTime(options));
    }

    /**
     * Show the server time.
     */
    _showServerTime(options)
    {
        if (options.date)
        {
            this.$el.find('#status-server_date').text(options.date.toString());
        }
    }

    /**
     * Provide server info with tempalte.
     */
    _template()
    {
        var hostname = this.rodanChannel.request(Events.REQUEST__SERVER_GET_HOSTNAME);
        var version = this.rodanChannel.request(Events.REQUEST__SERVER_GET_VERSION);
        var date = this._serverDate;
        return _.template($('#template-status_server_withadmin').html())({hostname: hostname,
                                                                          version: version,
                                                                          name: Configuration.ADMIN_CLIENT.NAME,
                                                                          email: Configuration.ADMIN_CLIENT.EMAIL});
    }
}

export default ViewStatusServer;
