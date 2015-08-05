import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import Resource from '../Models/Resource';

/**
 * Collection of Resource models.
 */
class ResourceCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = Resource;
        this.route = 'resources';
        this.loadCommand = Events.COMMAND__RESOURCES_LOAD;
        this.requestCommand = Events.REQUEST__RESOURCE_COLLECTION;
    }
}

export default ResourceCollection;