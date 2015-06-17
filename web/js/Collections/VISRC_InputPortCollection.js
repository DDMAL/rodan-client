import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../Shared/VISRC_Events';
import VISRC_InputPort from '../Models/VISRC_InputPort';

class VISRC_InputPortCollection extends Backbone.Collection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.model = VISRC_InputPort;
        this._initializeRadio();
    }

    /**
     * TODO docs
     */
    parse(resp, options)
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
        this.rodanChannel = Radio.channel("rodan");
    }

    /**
     * Retrieves list.
     */
    _retrieveList(aQueryParameters)
    {
        this.fetch({ data: $.param(aQueryParameters) });
    }

    /**
     * Returns this instance.
     */
    _handleRequestInstance()
    {
        return this;
    }

    /**
     * Handles application ready notification.
     */
    _handleEventApplicationReady()
    {
        var appInstance = this.rodanChannel.request(VISRC_Events.REQUEST__APPLICATION);
        this.url = appInstance.controllerServer.routeForRouteName('inputports');
    }
}

export default VISRC_InputPortCollection;