import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import { mapFromJsonObject } from '../Helpers/VISRC_Utilities';
import VISRC_Cookie from '../Shared/VISRC_Cookie';
import VISRC_Events from '../Shared/VISRC_Events';

/**
 * TODO docs
 */
class VISRC_ControllerServer extends Marionette.Object
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aConfiguration)
    {
        this.configuration = aConfiguration;
        this.routes = null;
        this.serverConfiguration = null;
        this.activeUser = null;
        this.CSRFToken = new VISRC_Cookie('csrftoken');

        this._initializeRadio();
    }

    /**
     * Return URL for specified route.
     */
    routeForRouteName(aName)
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
     * TODO remove
     */
    getAuthenticationRoute()
    {
        switch (this.configuration.authenticationType)
        {
            case 'session':
                return this.routeForRouteName('session-auth');
            case 'token':
                return this.routeForRouteName('token-auth');
            default:
                console.error('An acceptable Authentication Type was not provided');
                break;
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.comply(VISRC_Events.COMMAND__GET_ROUTES, () => this._getRoutes());
        this.rodanChannel.reply(VISRC_Events.REQUEST__SERVER_ROUTE, aString => this._handleRequestServerRoute(aString));
    }

    /**
     * Returns associated route.
     */
    _handleRequestServerRoute(aString)
    {
        return this.routeForRouteName(aString);
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
                this.rodanChannel.trigger(VISRC_Events.EVENT__ROUTESLOADED);
            }
            else
            {
                console.error('Routes could not be loaded from the server.');
            }
        };

        routeRequest.open('GET', this.configuration.server, true);
        routeRequest.setRequestHeader('Accept', 'application/json');
        routeRequest.send();
    }
}

export default VISRC_ControllerServer;