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
        this.set('workflow_input_ports', new InputPortCollection(options.workflow_input_ports));
        this.set('workflow_output_ports', new OutputPortCollection(options.workflow_output_ports));
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
        for (var i in resp.connections)
        {
            var modelClass = this.get('connections').model;
            var model = new modelClass(resp.connections[i]);
            this.get('connections').add(model, {merge: true});
        }
        resp.connections = this.get('connections');

        for (var i in resp.workflow_runs)
        {
            var modelClass = this.get('workflow_runs').model;
            var model = new modelClass(resp.workflow_runs[i]);
            this.get('workflow_runs').add(model, {merge: true});
        }
        resp.workflow_runs = this.get('workflow_runs');

        for (var i in resp.workflow_jobs)
        {
            var modelClass = this.get('workflow_jobs').model;
            var model = new modelClass(resp.workflow_jobs[i]);
            this.get('workflow_jobs').add(model, {merge: true});
        }
        resp.workflow_jobs = this.get('workflow_jobs');

     /*   for (var i in resp.workflow_input_ports)
        {
            var modelClass = this.get('workflow_input_ports').model;
            var model = new modelClass(resp.workflow_input_ports[i]);
            this.get('workflow_input_ports').add(model, {merge: true});
        }*/
     //   debugger;
        this.get('workflow_input_ports').set(resp.workflow_input_ports, {merge: true, remove: true});
        resp.workflow_input_ports = this.get('workflow_input_ports');

        for (var i in resp.workflow_output_ports)
        {
            var modelClass = this.get('workflow_output_ports').model;
            var model = new modelClass(resp.workflow_output_ports[i]);
            this.get('workflow_output_ports').add(model, {merge: true});
        }
        resp.workflow_output_ports = this.get('workflow_output_ports');

        return resp;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default Workflow;