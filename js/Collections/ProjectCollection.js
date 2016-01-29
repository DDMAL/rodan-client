import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import Project from '../Models/Project';

let _hasBeenInstantiated = false;

/**
 * Collection of Project models.
 */
class ProjectCollection extends BaseCollection
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
            console.error('TODO - the ProjectCollection should be migrated to a singleton; this should only be instantiated once!!!!!!!');
        }
        _hasBeenInstantiated = true;
        this.model = Project;
        this.route = 'projects';
    }
}

export default ProjectCollection;