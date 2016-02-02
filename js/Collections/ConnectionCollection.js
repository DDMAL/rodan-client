import BaseCollection from './BaseCollection';
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
    }
}

export default ConnectionCollection;