import BaseModel from './BaseModel';

/**
 * Represents a WorkflowJobGroup.
 */
class WorkflowJobGroup extends BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize
     */
    initialize()
    {
        this.routeName = 'workflowjobgroups';
    }

    defaults()
    {
        return {name: 'untitled'};
    }
}

export default WorkflowJobGroup;