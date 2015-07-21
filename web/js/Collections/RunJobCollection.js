import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../Shared/Events'
import RunJob from '../Models/RunJob'

class RunJobCollection extends Backbone.Collection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.model = RunJob;
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
        this.rodanChannel.comply(Events.COMMAND__LOAD_RUNJOBS, aQueryParameters => this._retrieveList(aQueryParameters));
        this.rodanChannel.reply(Events.REQUEST__COLLECTION_RUNJOB, () => this._handleRequestInstance());
    }

    /**
     * Retrieves list.
     */
    _retrieveList(aQueryParameters)
    {
        this.url = this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'runjobs');
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

export default RunJobCollection;