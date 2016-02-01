import BaseCollection from '../BaseCollection';
import Events from '../../Shared/Events';
import OutputPortType from '../../Models/OutputPortType';

let _instance = null;

/**
 * Global Collection of OutputPortType models.
 * This uses a pseudo-singleton model so we can inherit from BaseCollection.
 */
class GlobalOutputPortTypeCollection extends BaseCollection
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
        this.model = OutputPortType;
        this.route = 'outputporttypes';
        this.loadCommand = Events.REQUEST__LOAD_OUTPUTPORTTYPES;
        this.requestCommand = Events.REQUEST__COLLECTION_OUTPUTPORTTYPE;
    }
}

export default GlobalOutputPortTypeCollection;