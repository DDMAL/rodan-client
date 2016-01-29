import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import Job from '../Models/Job';

let _hasBeenInstantiated = false;

/**
 * Collection of Job models.
 */
class JobCollection extends BaseCollection
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
        this.model = Job;
        this.route = 'jobs';
        this.loadCommand = Events.REQUEST__LOAD_JOBS;
        this.requestCommand = Events.REQUEST__COLLECTION_JOB;
    }
}

export default JobCollection;