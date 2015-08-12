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
        this.loadCommand = Events.COMMAND__LOAD_WORKFLOWRUNS;
        this.requestCommand = Events.REQUEST__COLLECTION_WORKFLOWRUN;
    }
}

export default WorkflowRunCollection;