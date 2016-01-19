import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import WorkflowJobGroup from '../Models/WorkflowJobGroup';

/**
 * Collection of WorkflowJobGroup models.
 */
class WorkflowJobGroupCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = WorkflowJobGroup;
        this.route = 'workflowjobgroups';
        this.loadCommand = Events.REQUEST__LOAD_WORKFLOWJOBGROUPS;
        this.requestCommand = Events.REQUEST__COLLECTION_WORKFLOWJOBGROUP;
    }
}

export default WorkflowJobGroupCollection;