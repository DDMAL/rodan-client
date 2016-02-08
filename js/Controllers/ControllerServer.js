import _ from 'underscore';
import Backbone from 'backbone';
import Configuration from '../Configuration';
import Events from '../Shared/Events';
import BaseController from '../Controllers/BaseController';

var oldsync = Backbone.sync;
Backbone.sync = function(method, model, options) { oldsync(method, model, options); };

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
        this.routes = null;
        this.serverConfiguration = null;
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
        var jqXHR = this._originalSync(method, model, options);
    }

    /**
     * Event bindings.
     */
    _initializeRadio()
    {
        this._rodanChannel.reply(Events.REQUEST__SERVER_GET_ROUTES, () => this._getRoutes());
        this._rodanChannel.reply(Events.REQUEST__SERVER_ROUTE, aString => this._handleRequestServerRoute(aString));
        this._rodanChannel.reply(Events.REQUEST__SERVER_HOSTNAME, () => this._handleRequestServerHostname());
        this._rodanChannel.reply(Events.REQUEST__SERVER_VERSION_RODAN, () => this._handleRequestServerVersionRodan());
    }

    /**
     * Returns associated route.
     */
    _handleRequestServerRoute(aString)
    {
        return this._routeForRouteName(aString);
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
        return this.version;
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
                var resp = JSON.parse(routeRequest.responseText);

                this.routes = this._mapFromJsonObject(resp.routes);
                this.serverConfiguration = this._mapFromJsonObject(resp.configuration);
                this.version = resp.version;
                this._rodanChannel.trigger(Events.EVENT__SERVER_ROUTESLOADED);
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
     * Return URL for specified route.
     */
    _routeForRouteName(aName)
    {
        if (this.routes.has(aName))
        {
            return this.routes.get(aName);
        }
        else
        {
            return null;
        }
    }

    /**
     * Makes map from JSON object.
     */
    _mapFromJsonObject(JsonObject)
    {
        var keyvals = _.pairs(JsonObject);
        var map = new Map();
        var x = null;
        for (x in keyvals)
        {
            map.set(keyvals[x][0], keyvals[x][1]);
        }
        return map;
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
    }

    /**
     * Sends a notification that queries are still pending.
     */
    _sendWaitingNotification()
    {
        this._waitingEventTriggered = true;
        this._rodanChannel.trigger(Events.EVENT__SERVER_WAITING);
        this._rodanChannel.request(Events.REQUEST__MODAL_SHOW_WAITING);
    }

    /**
     * Send idle notification.
     */
    _sendIdleNotification()
    {
        this._waitingEventTriggered = false;
        this._rodanChannel.trigger(Events.EVENT__SERVER_IDLE);
        this._rodanChannel.request(Events.REQUEST__MODAL_HIDE);
    }

    /**
     * Sends a panic notification
     */
    _sendPanicNotification()
    {
        this._rodanChannel.trigger(Events.EVENT__SERVER_PANIC);
    }
}

export default ControllerServer;