import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import InputPortType from '../Models/InputPortType';

/**
 * Collection of InputPortType models.
 */
class InputPortTypeCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = InputPortType;
        this.route = 'inputporttypes';
        this.loadCommand = Events.COMMAND__LOAD_INPUTPORTTYPES;
        this.requestCommand = Events.REQUEST__COLLECTION_INPUTPORTTYPE;
    }
}

export default InputPortTypeCollection;