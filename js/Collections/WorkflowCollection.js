import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import Workflow from '../Models/Workflow';

/**
 * Collection of Workflow models.
 */
class WorkflowCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = Workflow;
        this.route = 'workflows';
        this.loadCommand = Events.COMMAND__LOAD_WORKFLOWS;
        this.requestCommand = Events.REQUEST__COLLECTION_WORKFLOW;
    }
}

export default WorkflowCollection;