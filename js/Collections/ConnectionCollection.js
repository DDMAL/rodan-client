import $ from 'jquery';
import Backbone from 'backbone';
import Radio from 'backbone.radio';

import Events from '../Shared/Events';
import Connection from '../Models/Connection';

class ConnectionCollection extends Backbone.Collection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize()
    {
        this.model = Connection;
        this._initializeRadio();
    }

    /**
     * TODO docs
     */
    parse(resp)
    {
        return resp.results;
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
     * Retrieves list.
     */
    _retrieveList(aQueryParameters)
    {
        this.url = this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'connections');
        this.fetch({ data: $.param(aQueryParameters) });
    }

    /**
     * Returns this instance.
     */
    _handleRequestInstance()
    {
        return this;
    }
}

export default ConnectionCollection;