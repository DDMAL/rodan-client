import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import VISRC_Configuration from '../VISRC_Configuration';
import VISRC_BaseModel from './VISRC_BaseModel';

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
    constructor(aParameters)
    {
        this.idAttribute = 'uuid';
        this.url = VISRC_Configuration.server + "/workflowjobs/";
        super(aParameters);
    }

    /**
     * Returns UUID of associated job.
     */
    getJobUuid()
    {
        var lastSlash = this.attributes.job.lastIndexOf('/');
        var subString = this.attributes.job.substring(0, lastSlash);
        var secondLastSlash = subString.lastIndexOf('/');
        return this.attributes.job.substring(secondLastSlash + 1, lastSlash);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_WorkflowJob;