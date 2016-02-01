import BaseCollection from '../BaseCollection';
import Events from '../../Shared/Events';
import Job from '../../Models/Job';

let _instance = null;

/**
 * Global Collection of Job models.
 * This uses a pseudo-singleton model so we can inherit from BaseCollection.
 */
class GlobalJobCollection extends BaseCollection
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
        this.model = Job;
        this.route = 'jobs';
        this.loadCommand = Events.REQUEST__LOAD_JOBS;
        this.requestCommand = Events.REQUEST__COLLECTION_JOB;
    }
}

export default GlobalJobCollection;