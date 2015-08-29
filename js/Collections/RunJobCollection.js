import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import RunJob from '../Models/RunJob';

/**
 * Collection of RunJob models.
 */
class RunJobCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = RunJob;
        this.route = 'runjobs';
        this.loadCommand = Events.COMMAND__LOAD_RUNJOBS;
        this.requestCommand = Events.REQUEST__RUNJOB_COLLECTION;
    }
}

export default RunJobCollection;