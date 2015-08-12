import BaseModel from './BaseModel';
import ConnectionCollection from '../Collections/ConnectionCollection';
import WorkflowJobCollection from '../Collections/WorkflowJobCollection';

/**
 * Represents a VIS Workflow model (i.e. a Rodan Workflow).
 */
class Workflow extends BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.routeName = 'workflows';
        this.set('workflow_jobs', new WorkflowJobCollection(aParameters.workflow_jobs));
        this.set('connections', new ConnectionCollection());
    }

    defaults()
    {
        return {description: null, name: null};
    }

    /**
     * TODO docs
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

export default Workflow;