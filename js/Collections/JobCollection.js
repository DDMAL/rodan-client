import Radio from 'backbone.radio';
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
        var globalJobCollection = Radio.channel('rodan').request(Events.REQUEST__GLOBAL_JOB_COLLECTION);
        this.model = Job;
        this.route = 'jobs';
        this.enumerations = globalJobCollection.enumerations; // TODO - not the best way to do this, but works
    }
}

export default JobCollection;