import BaseModel from './BaseModel';
import Events from '../Shared/Events';
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
     * TODO docs
     */
    initialize(aParameters)
    {
        this.set('input_ports', new InputPortCollection(aParameters.input_ports));
        this.set('output_ports', new OutputPortCollection(aParameters.output_ports));
        this.routeName = 'workflowjobs';
    }

    defaults()
    {
        return {input_ports: null, output_ports: null, job_name: null, job_description: null};
    }

    /**
     * Initialize.
     */
    parse(resp)
    {
        this.rodanChannel.request(Events.REQUEST__LOAD_INPUTPORTS, {query: {workflow_job: this.id}});
        var inputPorts = this.rodanChannel.request(Events.REQUEST__COLLECTION_INPUTPORT);
        resp.input_ports = new InputPortCollection(inputPorts);

        this.rodanChannel.request(Events.REQUEST__LOAD_OUTPUTPORTS, {query: {workflow_job: this.id}});
        var outputPorts = this.rodanChannel.request(Events.REQUEST__COLLECTION_OUTPUTPORT);
        resp.output_ports = new OutputPortCollection(outputPorts);

        return resp;
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