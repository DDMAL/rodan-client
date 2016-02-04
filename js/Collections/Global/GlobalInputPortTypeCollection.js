import GlobalCollection from './GlobalCollection';
import Events from '../../Shared/Events';
import InputPortType from '../../Models/InputPortType';

let _instance = null;

/**
 * Global Collection of InputPortType models.
 * This uses a pseudo-singleton model so we can inherit from BaseCollection.
 */
class GlobalInputPortTypeCollection extends GlobalCollection
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
        this.loadCommand = Events.REQUEST__GLOBAL_INPUTPORTTYPES_LOAD;
        this.requestCommand = Events.REQUEST__GLOBAL_INPUTPORTTYPE_COLLECTION;
    }
}

export default GlobalInputPortTypeCollection;