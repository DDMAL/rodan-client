import GlobalCollection from './GlobalCollection';
import Events from '../../Shared/Events';
import ResourceType from '../../Models/ResourceType';

let _instance = null;

/**
 * Global Collection of ResourceType models.
 * This uses a pseudo-singleton model so we can inherit from BaseCollection.
 */
class GlobalResourceTypeCollection extends GlobalCollection
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
        this.model = ResourceType;
        this.route = 'resourcetypes';
        this.loadCommand = Events.REQUEST__RESOURCETYPES_LOAD;
        this.requestCommand = Events.REQUEST__RESOURCETYPE_COLLECTION;
    }
}

export default GlobalResourceTypeCollection;