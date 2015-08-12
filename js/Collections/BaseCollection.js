import $ from 'jquery';
import Backbone from 'backbone';
import Radio from 'backbone.radio';

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
        this._initializeRadio();
    }

    /**
     * Parse results.
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
        this.rodanChannel.reply(this.loadCommand, options => this._retrieveList(options));
        this.rodanChannel.reply(this.requestCommand, () => this._handleRequestInstance());
    }

    /**
     * Retrieves list.
     */
    _retrieveList(options)
    {
        this.reset();
        var data = options.hasOwnProperty('query') ? options.query : {};
        options.data = $.param(data);
        options = this._applyResponseHandlers(options);
        this.url = this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE, this.route);
        this.fetch(options);
    }

    /**
     * Returns this instance.
     */
    _handleRequestInstance()
    {
        return this;
    }

    /**
     * Override of fetch to allow for generic handling.
     */
    fetch(options)
    {
        options = this._applyResponseHandlers(options);
        options.task = 'fetch';
        super.fetch(options);
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
        this.rodanChannel.request(Events.COMMAND__DISPLAY_MESSAGE, {text: text});
    }

    /**
     * Handle error response.
     */
    _handleErrorResponse(collection, response, options)
    {
        this.rodanChannel.request(Events.COMMAND__HANDLER_ERROR, {collection: collection,
                                                                  response: response,
                                                                  options: options});
        var text = 'Unsuccessful ' + options.task
                   + ' (' + options.xhr.status + '): ' 
                   + collection.constructor.name;
        this.rodanChannel.request(Events.COMMAND__DISPLAY_MESSAGE, {text: text});
    }
}

export default BaseCollection;