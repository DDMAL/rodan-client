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
    }
}

export default RunJobCollection;