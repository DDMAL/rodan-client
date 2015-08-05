import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import InputPort from '../Models/InputPort';

/**
 * Collection of InputPort models.
 */
class InputPortCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = InputPort;
        this.route = 'inputports';
        this.loadCommand = Events.COMMAND__LOAD_INPUTPORTS;
        this.requestCommand = Events.REQUEST__COLLECTION_INPUTPORT;
    }
}

export default InputPortCollection;