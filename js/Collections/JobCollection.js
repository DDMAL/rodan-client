import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import Job from '../Models/Job';

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
        this.model = Job;
        this.route = 'jobs';
        this.loadCommand = Events.REQUEST__LOAD_JOBS;
        this.requestCommand = Events.REQUEST__COLLECTION_JOB;
    }
}

export default JobCollection;