import $ from 'jquery';
import Backbone from 'backbone';
import Radio from 'backbone.radio';

import Pagination from '../Models/Pagination';
import Events from '../Shared/Events';

class BaseCollection extends Backbone.Collection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(options)
    {
        super(options);
        this._pagination = new Pagination();
        this._lastData = {};
        this._initializeRadio();
        this._filters = {};
        this._sort = {};
        this.enumerations = this.enumerations ? this.enumerations : [];
    }

    /**
     * Returns enumerations.
     */
    getEnumerations()
    {
        return this.enumerations;
    }

    /**
     * Parse results.
     */
    parse(resp)
    {
        if (resp.count)
        {
            this._parsePagination(resp);
        }

        if (this.enumerations && this.enumerations.length > 0)
        {
            this._populateEnumerations(resp);
        }

        if (resp.hasOwnProperty('results'))
        {
            return resp.results;
        }
        return resp;
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

    /**
     * Override of fetch to allow for generic handling.
     *
     * Note that we save the data options. This is in case we do a create
     * and have to reload/fetch the previous collection. We need to preserve
     * the fetch parameters.
     */
    fetch(options)
    {
        options = this._applyResponseHandlers(options);
        options.task = 'fetch';
        this._lastData = options.data ? options.data : {};
        $.extend(options.data, this._filters);
        $.extend(options.data, this._sort);
        super.fetch(options);
    }

    /**
     * Override of create.
     *
     * This override exists because we do NOT want to add it to the collection
     * by default (as there's a limit to what the server returns for collections,
     * and we need to respect that). However, if the save worked, we do want to do a fetch
     * to update the Collection. The fetch is called in the custom success handler for creation.
     *
     * There's also the case if this Collection is local and not associated with a DB Collection.
     */
    create(options)
    {
        var instance = new this.model(options);
        if (this.hasOwnProperty('url'))
        {
            instance.save({}, {success: () => this._handleCreateSuccess()});
        }
        else
        {
            instance.save({}, {success: (model) => this.add(model)});
        }
        return instance;
    }

    /**
     * Requests a sorted fetch.
     *
     * Note that it uses _lastData. We need to keep the last options
     * data in case we're paginating.
     *
     * If options.data IS passed, it will override _lastData.
     *
     * IMPORTANT: this is not called "sort" because backbone already has
     * a "sort" method for the Collection (but don't use it)
     */
    fetchSort(ascending, field, options)
    {
        if (options && options.data)
        {
            this._lastData = options.data;
        }

        this._sort.ordering = field;
        if (!ascending)
        {
            this._sort.ordering = '-' + field;
        }

        this.fetch({data: this._lastData, reset: true});
    }

    /**
     * Requests a filtered fetch.
     *
     * Note that it uses _lastData. We need to keep the last options
     * data in case we're paginating.
     *
     * If options.data IS passed, it will override _lastData.
     */
    fetchFilter(filters, options)
    {
        if (options && options.data)
        {
            this._lastData = options.data;
        }

        this._filters = filters;

        this.fetch({data: this._lastData, reset: true});
    }

    /**
     * Returns pagination.
     */
    getPagination()
    {
        return this._pagination;
    }

    /**
     * Return the URL.
     */
    url()
    {
        return this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE, this.route);
    }

    /**
     * Syncs list.
     */
    syncList(options)
    {
        this.fetch({data: this._lastData});
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
     * Handles a succesful creation. All this does is "properly" reload the collection.
     */
    _handleCreateSuccess()
    {
        this.syncList({});
    }

    /**
     * Parses pagination parameters from response.
     */
    _parsePagination(options)
    {
        this._pagination.set({'count': options.count,
                              'next': options.next !== null ? options.next : '#',
                              'previous': options.previous !== null ? options.previous : '#',
                              'current': options.current_page,
                              'total': options.total_pages});
    }

    /**
     * Applies response handlers.
     */
    _applyResponseHandlers(options)
    {
        // Check if options are defined.
        if (options === undefined)
        {
            options = {};
        }

        // Success.
        var genericSuccessFunction = (collection, response, options) => this._handleSuccessResponse(collection, response, options);
        if (!options.hasOwnProperty('success'))
        {
            options.success = (collection, response, options) => this._handleSuccessResponse(collection, response, options);
        }
        else
        {
            var customSuccessFunction = options.success;
            options.success = function(collection, response, options)
            {
                customSuccessFunction(collection, response, options);
                genericSuccessFunction(collection, response, options);
            };
        }

        // Error.
        var genericErrorFunction = (collection, response, options) => this._handleErrorResponse(collection, response, options);
        if (!options.hasOwnProperty('error'))
        {
            options.error = (collection, response, options) => this._handleErrorResponse(collection, response, options);
        }
        else
        {
            var customErrorFunction = options.error;
            options.error = function(collection, response, options)
            {
                customErrorFunction(collection, response, options);
                genericErrorFunction(collection, response, options);
            };
        }

        return options;
    }

    /**
     * Handle success response.
     */
    _handleSuccessResponse(collection, response, options)
    {
        var text = 'Successful ' + options.task
                   + ' (' + options.xhr.status + '): ' 
                   + collection.constructor.name;
        this.rodanChannel.request(Events.REQUEST__DISPLAY_MESSAGE, {text: text});
    }

    /**
     * Handle error response.
     */
    _handleErrorResponse(collection, response, options)
    {
        this.rodanChannel.request(Events.REQUEST__HANDLER_ERROR, {collection: collection,
                                                                  response: response,
                                                                  options: options});
        var text = 'Unsuccessful ' + options.task
                   + ' (' + options.xhr.status + '): ' 
                   + collection.constructor.name;
        this.rodanChannel.request(Events.REQUEST__DISPLAY_MESSAGE, {text: text});
    }

    /**
     * Populates enumerations.
     */
    _populateEnumerations(response)
    {
        for (var j in this.enumerations)
        {
            var field = this.enumerations[j].field;
            if (!this.enumerations[j].values || this.enumerations[j].values.length === 0)
            {
                this.enumerations[j].values = [];
                for (var i in response)
                {
                    var jobResponse = response[i];
                    this.enumerations[j].values.push(jobResponse[field]);
                }
                this.enumerations[j].values = $.unique(this.enumerations[j].values);
            }
        }
    }
}

export default BaseCollection;