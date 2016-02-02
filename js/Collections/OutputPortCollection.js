import BaseCollection from './BaseCollection';
import OutputPort from '../Models/OutputPort';

/**
 * Collection of OutputPort models.
 */
class OutputPortCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = OutputPort;
        this.route = 'outputports';
    }
}

export default OutputPortCollection;