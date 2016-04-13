import BaseModel from './BaseModel';
import InputPortCollection from '../Collections/InputPortCollection';
import OutputPortCollection from '../Collections/OutputPortCollection';

/**
 * Represents a WorkflowJob.
 */
class WorkflowJob extends BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        var inputPortCollection = new InputPortCollection();
        var outputPortCollection = new OutputPortCollection();
        inputPortCollection.set(options.input_ports);
        outputPortCollection.set(options.output_ports);
        this.set('input_ports', inputPortCollection);
        this.set('output_ports', outputPortCollection);
        this.routeName = 'workflowjobs';
    }

    defaults()
    {
        return {input_ports: null, output_ports: null, job_name: null, job_description: null};
    }

    /**
     * Initialize.
     */
    parse(response)
    {
        for (var i in response.input_ports)
        {
            var modelClass = this.get('input_ports').model;
            var model = new modelClass(response.input_ports[i]);
            this.get('input_ports').add(model, {merge: true});
        }
        response.input_ports = this.get('input_ports');

        for (var i in response.output_ports)
        {
            var modelClass = this.get('output_ports').model;
            var model = new modelClass(response.output_ports[i]);
            this.get('output_ports').add(model, {merge: true});
        }
        response.output_ports = this.get('output_ports');

        return response;
    }

    /**
     * Returns UUID of associated job.
     */
    getJobUuid()
    {
        var lastSlash = this.get('job').lastIndexOf('/');
        var subString = this.get('job').substring(0, lastSlash);
        var secondLastSlash = subString.lastIndexOf('/');
        return this.get('job').substring(secondLastSlash + 1, lastSlash);
    }

    /**
     * Returns human-readable descriptive text.
     */
    getDescription()
    {
        var string = this.get('name') + ': ' + this.get('job_description');
        return string;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default WorkflowJob;