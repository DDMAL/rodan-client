import BaseCollection from './BaseCollection';
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
    }
}

export default InputPortCollection;