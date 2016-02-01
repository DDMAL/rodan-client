import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import ResourceType from '../Models/ResourceType';

let _hasBeenInstantiated = false;

/**
 * Collection of ResourceType models.
 */
class ResourceTypeCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        if (_hasBeenInstantiated)
        {
            throw new Error('only one instance of this class may exist');
        }
        _hasBeenInstantiated = true;
        this.model = ResourceType;
        this.route = 'resourcetypes';
        this.loadCommand = Events.REQUEST__RESOURCETYPES_LOAD;
        this.requestCommand = Events.REQUEST__RESOURCETYPE_COLLECTION;
    }
}

export default ResourceTypeCollection;