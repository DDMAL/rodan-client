import BaseModel from './BaseModel';
import InputPortTypeCollection from '../Collections/InputPortTypeCollection';
import OutputPortTypeCollection from '../Collections/OutputPortTypeCollection';

/**
 * TODO docs.
 */
class Job extends BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.routeName = 'jobs';
        this.set('input_port_types', new InputPortTypeCollection(aParameters.input_port_types));
        this.set('output_port_types', new OutputPortTypeCollection(aParameters.output_port_types));
    }

    defaults()
    {
        return {input_port_types: null, output_port_types: null};
    }

    /**
     * TODO docs
     */
    parse(resp)
    {
        resp.input_port_types = new InputPortTypeCollection(resp.input_port_types);
        resp.output_port_types = new OutputPortTypeCollection(resp.output_port_types);
        return resp;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default Job;