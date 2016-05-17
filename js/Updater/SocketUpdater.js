import AbstractUpdater from './AbstractUpdater';
import Configuration from '../Configuration';

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
        this._webSocket = new WebSocket('ws://' + Configuration.SERVER_HOST + ':' + Configuration.SERVER_PORT + '/ws/rodan?subscribe-broadcast&publish-broadcast&echo');
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
        if (event.data === '--heartbeat--')
        {
            this._processHeartbeat(event);
        }
        else
        {
            this.update();
        }
    }

    /**
     * Process heartbeat.
     */
    _processHeartbeat(event)
    {
    }
}