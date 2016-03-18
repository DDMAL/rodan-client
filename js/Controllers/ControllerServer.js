import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Configuration from '../Configuration';
import Events from '../Shared/Events';
import BaseController from '../Controllers/BaseController';

var oldsync = Backbone.sync;
Backbone.sync = function(method, model, options) { return oldsync(method, model, options); };

/**
 * Server controller.
 */
class ControllerServer extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this._serverDate = null;
        this._server = null;
        this._originalSync = Backbone.sync;
        this._responseTimeout = null;
        this._responsePanic = null;
        this._waitingEventTriggered = false;
        Backbone.sync = (method, model, options) => this._sync(method, model, options);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Sends dummy request to get server time.
     */
    _sendTimeGetterRequest()
    {
        var request = new XMLHttpRequest();
        request.open('HEAD', Configuration.SERVER_URL);
        request.onreadystatechange = (event) => this._handleTimeRequest(event);
        request.setRequestHeader("Content-Type", "text/html");
        request.send('');
    }

    /**
     * Sync override. This is needed if we want to use WebSockets.
     */
    _sync(method, model, options)
    {
        // Set a timeout for x seconds.
        if (this._responseTimeout === null)
        {
            this._responseTimeout = setTimeout(() => this._sendWaitingNotification(), Configuration.SERVER_WAIT_TIMER);
        }

        // Set a timeout for panic.
        if (this._responsePanic === null)
        {
            this._responsePanic = setTimeout(() => this._sendPanicNotification(), Configuration.SERVER_PANIC_TIMER);
        }

        // Apply generic handler for timeout.
        options = this._applyResponseHandlers(options);

        // Do call.
        return this._originalSync(method, model, options);
    }

    /**
     * Event bindings.
     */
    _initializeRadio()
    {
        this.rodanChannel.reply(Events.REQUEST__SERVER_DATE, () => this._handleRequestDate());
        this.rodanChannel.reply(Events.REQUEST__SERVER_LOAD_ROUTES, () => this._getRoutes());
        this.rodanChannel.reply(Events.REQUEST__SERVER_LOAD_ROUTE_OPTIONS, () => this._handleGetRouteOptions());
        this.rodanChannel.reply(Events.REQUEST__SERVER_GET_ROUTE, routeName => this._handleRequestServerRoute(routeName));
        this.rodanChannel.reply(Events.REQUEST__SERVER_GET_ROUTE_OPTIONS, options => this._handleRequestServerRouteOptions(options));
        this.rodanChannel.reply(Events.REQUEST__SERVER_GET_HOSTNAME, () => this._handleRequestServerHostname());
        this.rodanChannel.reply(Events.REQUEST__SERVER_GET_VERSION, () => this._handleRequestServerVersionRodan());
    }

    /**
     * Return server date.
     */
    _handleRequestDate()
    {
        return this._serverDate;
    }

    /**
     * Returns associated route.
     */
    _handleRequestServerRoute(routeName)
    {
        return this._server.routes[routeName].url;
    }

    /**
     * Returns associated route options.
     */
    _handleRequestServerRouteOptions(options)
    {
        return this._server.routes[options.route].options;
    }

    /**
     * Returns server hostname.
     */
    _handleRequestServerHostname()
    {
        return Configuration.SERVER_URL;
    }

    /**
     * Returns server version - Rodan.
     */
    _handleRequestServerVersionRodan()
    {
        return this._server.version;
    }

    /*
    * Fetches the routes from the Rodan server. This is the first function to be called in the
    * Rodan loading process. It hits the root endpoint on the Rodan server and from there downloads
    * all of the path endpoints required to automatically configure the client application.
    * */
    _getRoutes()
    {
        var routeRequest = new XMLHttpRequest();

        // FYI: the use of the Fat arrow maps `this` to `ServerController`, not the request object.
        routeRequest.onload = (event) =>
        {
            if (routeRequest.responseText && routeRequest.status === 200)
            {
                this._server = JSON.parse(routeRequest.responseText);
                for (var routeName in this._server.routes)
                {
                    this._server.routes[routeName] = {url: this._server.routes[routeName]};
                }
                this.rodanChannel.trigger(Events.EVENT__SERVER_ROUTESLOADED);
            }
            else
            {
                console.error('Routes could not be loaded from the server.');
                console.error(event);
            }
        };

        routeRequest.open('GET', Configuration.SERVER_URL, true);
        routeRequest.setRequestHeader('Accept', 'application/json');
        routeRequest.send();
    }


    /**
     * Fetches the OPTIONS (arguments for sorting, filtering, etc).
     */
    _handleGetRouteOptions()
    {
        for (var key in this._server.routes)
        {
            // Skip routes that don't have any options.
            if (Configuration.ROUTES_WITHOUT_OPTIONS.indexOf(key) >= 0)
            {
                continue;
            }

            var ajaxSettings = {success: (result, status, xhr) => this._handleGetRouteOptionsSuccess(result, status, xhr),
                                type: 'OPTIONS',
                                url: this._server.routes[key].url,
                                dataType: 'json'};
            var request = $.ajax(ajaxSettings); 
            request.key = key;
        }
    }

    /**
     * Handle get route options success.
     */
    _handleGetRouteOptionsSuccess(result, status, xhr)
    {
        this._server.routes[xhr.key].options = result;
    }

    /**
     * Apply success/error handlers to HTTP request.
     */
    _applyResponseHandlers(options)
    {
        var genericResponseFunction = (model, response, options) => this._handleResponse(model, response, options);

        // Success.
        if (!options.hasOwnProperty('success'))
        {
            options.success = genericResponseFunction;
        }
        else
        {
            var customSuccessFunction = options.success;
            options.success = function(model, response, options)
            {
                customSuccessFunction(model, response, options);
                genericResponseFunction(model, response, options);
            };
        }

        // Error
        if (!options.hasOwnProperty('error'))
        {
            options.error = genericResponseFunction;
        }
        else
        {
            var customErrorFunction = options.error;
            options.error = function(model, response, options)
            {
                customErrorFunction(model, response, options);
                genericResponseFunction(model, response, options);
            };
        }

        // Complete
        if (!options.hasOwnProperty('complete'))
        {
            options.complete = genericResponseFunction;
        }

        return options;
    }

    /**
     * Handle response.
     */
    _handleResponse(model, response, options)
    {
        if (document.readyState === 'complete')
        {
            clearTimeout(this._responseTimeout);
            clearTimeout(this._responsePanic);
            this._responseTimeout = null;
            this._responsePanic = null;
            if (this._waitingEventTriggered)
            {
                this._sendIdleNotification();
            }
        }

        // Get the time.
        if (options && options.getResponseHeader && options.getResponseHeader('Date'))
        {
            var dateResponse = new Date(options.getResponseHeader('Date'));
            if (this._serverDate === null || this._serverDate.getTime() < dateResponse.getTime())
            {
                this._serverDate = dateResponse;
                clearInterval(this._timeGetterInterval);
                this._timeGetterInterval = null;
            }
        }

        if (!this._timeGetterInterval)
        {
            this._timeGetterInterval = setInterval(() => this._sendTimeGetterRequest(), 5000);
        }
    }

    /**
     * Sends a notification that queries are still pending.
     */
    _sendWaitingNotification()
    {
        this._waitingEventTriggered = true;
        this.rodanChannel.trigger(Events.EVENT__SERVER_WAITING);
    }

    /**
     * Send idle notification.
     */
    _sendIdleNotification()
    {
        this._waitingEventTriggered = false;
        this.rodanChannel.trigger(Events.EVENT__SERVER_IDLE);
    }

    /**
     * Sends a panic notification
     */
    _sendPanicNotification()
    {
        this.rodanChannel.trigger(Events.EVENT__SERVER_PANIC);
    }

    /**
     * Handle time getter request response.
     */
    _handleTimeRequest(event)
    {
        var request = event.currentTarget;
        if (request && request.getResponseHeader('Date'))
        {
            var dateResponse = new Date(request.getResponseHeader('Date'));
            if (this._serverDate === null || this._serverDate.getTime() < dateResponse.getTime())
            {
                this._serverDate = dateResponse;
            }
        }
    }
}

export default ControllerServer;