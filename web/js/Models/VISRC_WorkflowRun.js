import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import VISRC_Configuration from '../VISRC_Configuration';
import VISRC_BaseModel from './VISRC_BaseModel';

/**
 * WorkflowRun model.
 */
class VISRC_WorkflowRun extends VISRC_BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Basic constructor.
     */
    constructor(data)
    {
        this.idAttribute = 'uuid';
        this.url = VISRC_Configuration.server + "/workflowruns/";
        super(data);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_WorkflowRun;