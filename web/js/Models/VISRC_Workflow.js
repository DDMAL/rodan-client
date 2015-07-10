import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_BaseModel from './VISRC_BaseModel';
import VISRC_ConnectionCollection from '../Collections/VISRC_ConnectionCollection';

/**
 * Represents a VIS Workflow model (i.e. a Rodan Workflow).
 */
class VISRC_Workflow extends VISRC_BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.routeName = "workflows";
        this.set("connections", new VISRC_ConnectionCollection());
    }

    defaults()
    {
        return {description: null, name: null};
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_Workflow;