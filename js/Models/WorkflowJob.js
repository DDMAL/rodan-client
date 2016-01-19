import BaseModel from './BaseModel';
import Events from '../Shared/Events';
import InputPort from './InputPort';
import OutputPort from './OutputPort';
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
        this.set('input_ports', new InputPortCollection(options.input_ports));
        this.set('output_ports', new OutputPortCollection(options.output_ports));
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
        // Check for unknown InputPorts.
     /*   for (var index in response.input_ports)
        {
            if (typeof response.input_ports[index] === 'string')
            {
                var uuid = this.parseIdFromUrl(response.input_ports[index]);
                if (!this.get('input_ports').get(uuid))
                {
                    var port = new InputPort({'uuid': uuid, 'url': response.input_ports[index]});
                    port.fetch();
                    this.get('input_ports').add(port);
                }
            }
        }

        // Check for unknown OutputPorts.
        for (var index in response.output_ports)
        {
            if (typeof response.output_ports[index] === 'string')
            {
                var uuid = this.parseIdFromUrl(response.output_ports[index]);
                if (!this.get('output_ports').get(uuid))
                {
                    var port = new OutputPort({'uuid': uuid, 'url': response.output_ports[index]});
                    port.fetch();
                    this.get('output_ports').add(port);
                }
            }
        }*//*
        this.get('input_ports').fetch({data: {'workflow_job': response.uuid}});
        this.get('output_ports').fetch({data: {'workflow_job': response.uuid}});*/

        // Put the Collections in the response (so backbone doesn't populate the Collections with URLs).
        response.input_ports = this.get('input_ports');
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