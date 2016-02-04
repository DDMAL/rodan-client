import GlobalCollection from './GlobalCollection';
import Events from '../../Shared/Events';
import Project from '../../Models/Project';

let _instance = null;

/**
 * Global Collection of Project models.
 * This uses a pseudo-singleton model so we can inherit from BaseCollection.
 */
class GlobalProjectCollection extends GlobalCollection
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
        this._allowPagination = true;
        this.loadCommand = Events.REQUEST__GLOBAL_PROJECTS_LOAD;
        this.requestCommand = Events.REQUEST__GLOBAL_PROJECT_COLLECTION;
    }
}

export default GlobalProjectCollection;