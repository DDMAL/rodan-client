import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * This class represents the view (and controller) for the status bar - login info.
 */
class NavTestView extends Marionette.ItemView
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
    }

    /**
     * TODO
     */
    getTemplate()
    {
        return "#template-dummy";
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default NavTestView;