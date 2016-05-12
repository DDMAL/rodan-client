import Configuration from '../Configuration';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import RODAN_EVENTS from '../Shared/RODAN_EVENTS';

/**
 * Socket manager. This manages the connection to the server's socket and dispatches related events.
 */
export default class SocketManager
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor()
    {
        this._webSocket = null;
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__CONFIGURATION_LOADED, () => this._handleEventConfigurationLoaded());
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle config load. Read the configuration and check for socket setting.
     */
    _handleEventConfigurationLoaded()
    {
        if (Configuration.SERVER_SOCKET_AVAILABLE)
        {
            Radio.channel('rodan').on(RODAN_EVENTS.EVENT__AUTHENTICATION_LOGIN_SUCCESS, () => this._handleEventLoginSuccess());
            Radio.channel('rodan').on(RODAN_EVENTS.EVENT__AUTHENTICATION_LOGOUT_SUCCESS, () => this._handleEventLogoutSuccess());
        }
    }

    /**
     * Handle login success.
     */
    _handleEventLoginSuccess()
    {
        this._webSocket = new WebSocket('ws://' + Configuration.SERVER_HOST + ':' + Configuration.SERVER_PORT + '/ws/rodan?subscribe-broadcast&publish-broadcast&echo');
        this._webSocket.onmessage = (event) => this._handleSocketMessage(event);
    }

    /**
     * Handle login success.
     */
    _handleEventLogoutSuccess()
    {
        console.log('logout');
    }

    /**
     * Handle socket message.
     */
    _handleSocketMessage(event)
    {
        console.log(event);
    }
}