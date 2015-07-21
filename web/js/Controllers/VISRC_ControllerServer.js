import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Configuration from '../VISRC_Configuration';
import { mapFromJsonObject } from '../Helpers/VISRC_Utilities';
import VISRC_Cookie from '../Shared/VISRC_Cookie';
import VISRC_Events from '../Shared/VISRC_Events';
import VISRC_BaseController from '../Controllers/VISRC_BaseController';

/**
 * Server controller.
 */
class VISRC_ControllerServer extends VISRC_BaseController
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
        this._rodanChannel.comply(VISRC_Events.COMMAND__GET_ROUTES, () => this._getRoutes());
        this._rodanChannel.reply(VISRC_Events.REQUEST__SERVER_ROUTE, aString => this._handleRequestServerRoute(aString));
        this._rodanChannel.reply(VISRC_Events.REQUEST__SERVER_HOSTNAME, () => this._handleRequestServerHostname());
        this._rodanChannel.reply(VISRC_Events.REQUEST__SERVER_VERSION_RODAN, () => this._handleRequestServerVersionRodan());
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
        return VISRC_Configuration.SERVER_URL;
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
                this._rodanChannel.trigger(VISRC_Events.EVENT__ROUTESLOADED);
            }
            else
            {
                console.error('Routes could not be loaded from the server.');
            }
        };

        routeRequest.open('GET', VISRC_Configuration.SERVER_URL, true);
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

export default VISRC_ControllerServer;