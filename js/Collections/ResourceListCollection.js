import BaseCollection from './BaseCollection';
import ResourceList from '../Models/ResourceList';

/**
 * Collection of ResourceList models.
 */
class ResourceListCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = ResourceList;
        this.route = 'resourcelists';
    }
}

export default ResourceListCollection;