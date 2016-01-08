import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
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
        this.loadCommand = Events.REQUEST__LOAD_OUTPUTPORTS;
        this.requestCommand = Events.REQUEST__COLLECTION_OUTPUTPORT;
    }
}

export default OutputPortCollection;