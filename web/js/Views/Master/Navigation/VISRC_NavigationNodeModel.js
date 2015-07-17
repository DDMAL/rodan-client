import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';

/**
 * This is a special model used in the Navigation views.
 * When a nav item does not represent an individual Rodan model, use this to represent
 * whatever "it" is you want to have in your nav.
 * For example, you can use this to represent a collection of Resources.
 */
class VISRC_NavigationNodeModel extends Backbone.Model
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(aParameters)
    {
        this._initializeRadio();
        super(aParameters);
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

export default VISRC_NavigationNodeModel;