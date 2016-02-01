import BaseCollection from '../BaseCollection';
import Events from '../../Shared/Events';
import InputPortType from '../../Models/InputPortType';

let _instance = null;

/**
 * Global Collection of InputPortType models.
 * This uses a pseudo-singleton model so we can inherit from BaseCollection.
 */
class GlobalInputPortTypeCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        if (_instance)
        {
            throw new Error('only one instance of this class may exist');
        }
        _instance = this;
        this.model = InputPortType;
        this.route = 'inputporttypes';
        this.loadCommand = Events.REQUEST__LOAD_INPUTPORTTYPES;
        this.requestCommand = Events.REQUEST__COLLECTION_INPUTPORTTYPE;
    }
}

export default GlobalInputPortTypeCollection;