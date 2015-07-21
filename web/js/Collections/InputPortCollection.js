import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Configuration from '../Configuration';
import Events from '../Shared/Events';
import InputPort from '../Models/InputPort';

class InputPortCollection extends Backbone.Collection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.model = InputPort;
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
        this.rodanChannel.comply(Events.COMMAND__LOAD_INPUTPORTS, aQueryParameters => this._retrieveList(aQueryParameters));
        this.rodanChannel.reply(Events.REQUEST__COLLECTION_INPUTPORT, () => this._handleRequestInstance());
    }

    /**
     * Retrieves list.
     */
    _retrieveList(aQueryParameters)
    {
        this.url = this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'inputports');
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

export default InputPortCollection;