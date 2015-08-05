import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import Connection from '../Models/Connection';

/**
 * Collection of Connection models.
 */
class ConnectionCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = Connection;
        this.route = 'connections';
        this.loadCommand = Events.COMMAND__LOAD_CONNECTIONS;
        this.requestCommand = Events.REQUEST__COLLECTION_CONNECTION;
    }
}

export default ConnectionCollection;