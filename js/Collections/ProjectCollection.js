import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import Project from '../Models/Project';

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
        this.model = Project;
        this.route = 'projects';
        this.loadCommand = Events.REQUEST__PROJECTS_LOAD;
        this.requestCommand = Events.REQUEST__PROJECT_COLLECTION;
        this.syncCommand = Events.REQUEST__PROJECTS_SYNC;
    }
}

export default ProjectCollection;