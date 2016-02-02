import BaseCollection from './BaseCollection';
import OutputPortType from '../Models/OutputPortType';

/**
 * Collection of OutputPortType models.
 */
class OutputPortTypeCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = OutputPortType;
        this.route = 'outputporttypes';
    }
}

export default OutputPortTypeCollection;