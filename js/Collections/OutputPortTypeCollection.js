import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
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
        this.loadCommand = Events.COMMAND__LOAD_OUTPUTPORTTYPES;
        this.requestCommand = Events.REQUEST__COLLECTION_OUTPUTPORTTYPE;
    }
}

export default OutputPortTypeCollection;