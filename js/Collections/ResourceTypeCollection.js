import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import ResourceType from '../Models/ResourceType';

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
        this.model = ResourceType;
        this.route = 'resourcetypes';
        this.loadCommand = Events.COMMAND__LOAD_RESOURCETYPES;
        this.requestCommand = Events.REQUEST__RESOURCETYPE_COLLECTION;
    }
}

export default ResourceTypeCollection;