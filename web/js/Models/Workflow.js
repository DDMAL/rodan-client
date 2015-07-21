import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import BaseModel from './BaseModel';
import ConnectionCollection from '../Collections/ConnectionCollection';

/**
 * Represents a VIS Workflow model (i.e. a Rodan Workflow).
 */
class Workflow extends BaseModel
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
        this.set("connections", new ConnectionCollection());
    }

    defaults()
    {
        return {description: null, name: null};
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default Workflow;