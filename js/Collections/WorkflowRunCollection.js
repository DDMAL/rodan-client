import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import WorkflowRun from '../Models/WorkflowRun';

/**
 * Collection of WorkflowRun models.
 */
class WorkflowRunCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = WorkflowRun;
        this.route = 'workflowruns';
        this.loadCommand = Events.REQUEST__LOAD_WORKFLOWRUNS;
        this.requestCommand = Events.REQUEST__COLLECTION_WORKFLOWRUN;
        this.syncCommand = Events.REQUEST__WORKFLOWRUNS_SYNC;
    }
}

export default WorkflowRunCollection;