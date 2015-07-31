import $ from 'jquery';
import Backbone from 'backbone';
import Radio from 'backbone.radio';

import Events from '../Shared/Events';
import ResourceType from '../Models/ResourceType';

/**
 * ResourceType model.
 */
class ResourceTypeCollection extends Backbone.Collection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = ResourceType;
        this._initializeRadio();
    }

    /**
     * Parse.
     */
    parse(resp)
    {
        return resp.results;
    }

    /**
     * Parses ID out of resource type URL.
     */
    parseIdFromUrl(aUrl)
    {
        var lastSlash = aUrl.lastIndexOf('/');
        var subString = aUrl.substring(0, lastSlash);
        var secondLastSlash = subString.lastIndexOf('/');
        return aUrl.substring(secondLastSlash + 1, lastSlash);
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
        this.rodanChannel.comply(Events.COMMAND__LOAD_RESOURCETYPES, aQueryParameters => this._retrieveList(aQueryParameters));
        this.rodanChannel.reply(Events.REQUEST__RESOURCETYPE_COLLECTION, () => this._handleRequestInstance());
    }

    /**
     * Retrieves list.
     */
    _retrieveList(aQueryParameters)
    {
        this.reset();
        this.url = this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'resourcetypes');
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

export default ResourceTypeCollection;