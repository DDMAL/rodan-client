import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import BaseModel from './BaseModel';
import InputPortCollection from '../Collections/InputPortCollection';
import OutputPortCollection from '../Collections/OutputPortCollection';

/**
 * Represents a VIS WorkflowJob model.
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
        this.set("input_ports", new InputPortCollection(aParameters.input_ports));
        this.set("output_ports", new OutputPortCollection(aParameters.output_ports));
        this.routeName = "workflowjobs";
    }

    defaults()
    {
        return {input_ports: null, output_ports: null, name: "untitled"};
    }

    /**
     * TODO docs
     */
    parse(resp, options)
    {
        resp.input_ports = new InputPortCollection(resp.input_ports);
        resp.output_ports = new OutputPortCollection(resp.output_ports);
        return resp;
    }

    /**
     * Returns UUID of associated job.
     */
    getJobUuid()
    {
        var lastSlash = this.get("job").lastIndexOf('/');
        var subString = this.get("job").substring(0, lastSlash);
        var secondLastSlash = subString.lastIndexOf('/');
        return this.get("job").substring(secondLastSlash + 1, lastSlash);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default WorkflowJob;