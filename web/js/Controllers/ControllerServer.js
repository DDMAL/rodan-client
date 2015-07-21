import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Configuration from '../Configuration';
import { mapFromJsonObject } from '../Helpers/Utilities';
import Cookie from '../Shared/Cookie';
import Events from '../Shared/Events';
import BaseController from '../Controllers/BaseController';

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
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Event bindings.
     */
    _initializeRadio()
    {
        this._rodanChannel.comply(Events.COMMAND__GET_ROUTES, () => this._getRoutes());
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

                this.routes = mapFromJsonObject(resp.routes);
                this.serverConfiguration = mapFromJsonObject(resp.configuration);
                this.version = resp.version;
                this._rodanChannel.trigger(Events.EVENT__ROUTESLOADED);
            }
            else
            {
                console.error('Routes could not be loaded from the server.');
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
}

export default ControllerServer;