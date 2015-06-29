import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_BaseModel from './VISRC_BaseModel';

/**
 * InputPort.
 */
class VISRC_InputPort extends VISRC_BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.routeName = "inputports";
    }

    defaults()
    {
        return {label: null};
    }

    /**
     * Return true iff port satisfied.
     */
    isSatisfied()
    {
        return false;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_InputPort;