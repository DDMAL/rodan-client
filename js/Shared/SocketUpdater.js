import AbstractUpdater from './AbstractUpdater';
import Configuration from '../Configuration';
import Radio from 'backbone.radio';
import RODAN_EVENTS from '../Shared/RODAN_EVENTS';

export default class SocketUpdater extends AbstractUpdater
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    constructor(options)
    {
        super(options);
        this._webSocket = new WebSocket('ws://' + Configuration.SERVER_HOST + ':' + Configuration.SERVER_PORT + '/ws/rodan?subscribe-broadcast&publish-broadcast&echo');
        this._webSocket.onmessage = (event) => this._handleSocketMessage(event);
    }

    setFunction(callbackFunction)
    {
    }

    clear()
    {
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
            this._processMessage(event);
        }
    }

    /**
     * Process heartbeat.
     */
    _processHeartbeat(event)
    {
    }

    /**
     * Process message.
     */
    _processMessage(event)
    {
        console.log(event.data);
    }
}