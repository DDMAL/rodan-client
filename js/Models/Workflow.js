import BaseModel from './BaseModel';
import ConnectionCollection from '../Collections/ConnectionCollection';
import InputPortCollection from '../Collections/InputPortCollection';
import OutputPortCollection from '../Collections/OutputPortCollection';
import WorkflowJobCollection from '../Collections/WorkflowJobCollection';
import WorkflowRunCollection from '../Collections/WorkflowRunCollection';

/**
 * Workflow.
 */
export default class Workflow extends BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize
     *
     * @param {object} options Backbone.Model options object
     */
    initialize(options)
    {
        this.set('connections', new ConnectionCollection(options.connections));
        this.set('workflow_input_ports', new InputPortCollection(options.workflow_input_ports));
        this.set('workflow_output_ports', new OutputPortCollection(options.workflow_output_ports));
        this.set('workflow_jobs', new WorkflowJobCollection(options.workflow_jobs));
        this.set('workflow_runs', new WorkflowRunCollection(options.workflow_runs));
    }

    /**
     * Returns defaults.
     *
     * @return {object} object holding default values
     */
    defaults()
    {
        return {description: null, name: null, created: null, updated: null, valid: false};
    }

    /**
     * Override of Backbone.Model.parse. This will populate 'workflow_runs', 'workflow_jobs', 'workflow_input_ports', and 'workflow_output_ports' with the appropriate models.
     *
     * @param {object} response JSON response from server
     * @return {object} response object
     */
    parse(response)
    {
        for (var i in response.workflow_runs)
        {
            var modelClass = this.get('workflow_runs').model;
            var model = new modelClass(response.workflow_runs[i]);
            this.get('workflow_runs').add(model, {merge: true});
        }
        response.workflow_runs = this.get('workflow_runs');

        for (var i in response.workflow_jobs)
        {
            var modelClass = this.get('workflow_jobs').model;
            var model = new modelClass(response.workflow_jobs[i]);
            this.get('workflow_jobs').add(model, {merge: true});
        }
        response.workflow_jobs = this.get('workflow_jobs');

        this.get('workflow_input_ports').set(response.workflow_input_ports, {merge: true, remove: true});
        response.workflow_input_ports = this.get('workflow_input_ports');

        for (var i in response.workflow_output_ports)
        {
            var modelClass = this.get('workflow_output_ports').model;
            var model = new modelClass(response.workflow_output_ports[i]);
            this.get('workflow_output_ports').add(model, {merge: true});
        }
        response.workflow_output_ports = this.get('workflow_output_ports');

        return response;
    }
}
Workflow.prototype.routeName = 'workflows';