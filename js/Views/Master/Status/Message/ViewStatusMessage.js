import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import _ from 'underscore';

import Events from '../../../../Shared/Events'

/**
 * This class represents the view (and controller) for the status bar - messages.
 */
class ViewStatusMessage extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.model = null;
        this.modelEvents = {
            "all": "render"
        };
        this._initializeRadio();
        this.template = () => this._template();
    }

    /**
     * TODO docs
     */
    _template()
    {
        return _.template($("#template-status_message").html())({test: "messages should go here!"});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
    }
}

export default ViewStatusMessage;