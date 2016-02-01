import BaseCollection from '../BaseCollection';
import Events from '../../Shared/Events';
import Project from '../../Models/Project';

let _instance = null;

/**
 * Global Collection of Project models.
 * This uses a pseudo-singleton model so we can inherit from BaseCollection.
 */
class GlobalProjectCollection extends BaseCollection
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
        this.model = Project;
        this.route = 'projects';
        this.loadCommand = Events.REQUEST__LOAD_PROJECTS;
        this.requestCommand = Events.REQUEST__COLLECTION_PROJECT;
    }
}

export default GlobalProjectCollection;