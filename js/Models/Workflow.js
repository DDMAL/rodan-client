import BaseModel from './BaseModel';
import ConnectionCollection from '../Collections/ConnectionCollection';
import WorkflowRunCollection from '../Collections/WorkflowRunCollection';
import InputPortCollection from '../Collections/InputPortCollection';
import OutputPortCollection from '../Collections/OutputPortCollection';
import WorkflowJobCollection from '../Collections/WorkflowJobCollection';

/**
 * Represents a Workflow.
 */
class Workflow extends BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize
     */
    initialize(options)
    {
        this.routeName = 'workflows';
        this.set('connections', new ConnectionCollection(options.connections));
        //this.set('workflow_input_ports', new InputPortCollection(options.workflow_input_ports));
        //this.set('workflow_output_ports', new OutputPortCollection(options.workflow_output_ports));
        this.set('workflow_jobs', new WorkflowJobCollection(options.workflow_jobs));
        this.set('workflow_runs', new WorkflowRunCollection(options.workflow_runs));
    }

    defaults()
    {
        return {description: null, name: null, created: null, updated: null, valid: false};
    }

    /**
     * Parse response.
     */
    parse(resp)
    {
        this.get('connections').add(resp.connections, {merge: true});
        resp.connections = this.get('connections');
        //this.get('workflow_input_ports').add(resp.workflow_input_ports, {merge: true});
        //resp.workflow_input_ports = this.get('workflow_input_ports');
        //this.get('workflow_output_ports').add(resp.workflow_output_ports, {merge: true});
        //resp.workflow_output_ports = this.get('workflow_output_ports');
        this.get('workflow_runs').add(resp.workflow_runs, {merge: true});
        resp.workflow_runs = this.get('workflow_runs');

        // If the WorkflowJobs Collection has already been populated, we don't want to repopulate it.
        // This will cause the ports to be clobbered.
        // Issue #43: think of a better way to load WorkflowJobs on the fly. Might require adjustment to Rodan.
        if (this.get('workflow_jobs').length === 0)
        {
            this.get('workflow_jobs').add(resp.workflow_jobs, {merge: true});
        }
        resp.workflow_jobs = this.get('workflow_jobs');

        return resp;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default Workflow;