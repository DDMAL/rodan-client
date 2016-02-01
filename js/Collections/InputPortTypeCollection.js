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
    }
}

export default InputPortTypeCollection;