import BaseModel from './BaseModel';
import WorkflowJobCollection from '../Collections/WorkflowJobCollection';

/**
 * Represents a WorkflowJobGroup.
 */
class WorkflowJobGroup extends BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        this.routeName = 'workflowjobgroups';
        this.set('workflow_jobs', new WorkflowJobCollection(options.workflow_jobs));
    }

    /**
     * Parse.
     */
    parse(resp)
    {
        resp.workflow_jobs = new WorkflowJobCollection(resp.workflow_jobs);
        return resp;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default WorkflowJobGroup;