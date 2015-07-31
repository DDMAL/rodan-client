import $ from 'jquery';
import Backbone from 'backbone';
import Radio from 'backbone.radio';

import Events from '../Shared/Events';
import Resource from '../Models/Resource';

/**
 * Resource collection.
 */
class ResourceCollection extends Backbone.Collection
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
        this.model = Resource;
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
        this.rodanChannel.comply(Events.COMMAND__RESOURCES_LOAD, aQueryParameters => this._retrieveList(aQueryParameters));
        this.rodanChannel.reply(Events.REQUEST__RESOURCE_COLLECTION, () => this._handleRequestInstance());
    }

    /**
     * Retrieves list.
     */
    _retrieveList(aQueryParameters)
    {
        this.reset();
        this.url = this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'resources');
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

export default ResourceCollection;