import BaseCollection from './BaseCollection';
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