import AbstractUpdater from './AbstractUpdater';
import Configuration from 'js/Configuration';

/**
 * Updater that uses sockets to trigger collection updates.
 */
export default class SocketUpdater extends AbstractUpdater
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor()
    {
        super();
	var protocol = Configuration.SERVER_HTTPS ? 'wss' : 'ws';
        this._webSocket = new WebSocket(protocol + '://' + Configuration.SERVER_HOST + ':' + Configuration.SERVER_PORT + '/ws/rodan?subscribe-broadcast&publish-broadcast&echo');
        this._webSocket.onmessage = (event) => this._handleSocketMessage(event);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle login success.
     */
    _handleEventLogoutSuccess()
    {
        this._webSocket.close();
    }

    /**
     * Handle socket message.
     */
    _handleSocketMessage(event)
    {
        // Output if debug socket.
        if (Configuration.SERVER_SOCKET_DEBUG)
        {
            console.log(event.data);
        }

        // Process.
        if (event.data === '--heartbeat--')
        {
          //  this._processHeartbeat(event);
        }
        else
        {
            this.update();
        }
    }
}
