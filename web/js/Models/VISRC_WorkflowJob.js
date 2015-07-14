import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_BaseModel from './VISRC_BaseModel';
import VISRC_InputPortCollection from '../Collections/VISRC_InputPortCollection';
import VISRC_OutputPortCollection from '../Collections/VISRC_OutputPortCollection';

/**
 * Represents a VIS WorkflowJob model.
 */
class VISRC_WorkflowJob extends VISRC_BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.set("input_ports", new VISRC_InputPortCollection(aParameters.input_ports));
        this.set("output_ports", new VISRC_OutputPortCollection(aParameters.output_ports));
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
        resp.input_ports = new VISRC_InputPortCollection(resp.input_ports);
        resp.output_ports = new VISRC_OutputPortCollection(resp.output_ports);
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

export default VISRC_WorkflowJob;