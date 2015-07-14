import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';
import VISRC_NavigationNodeCollection from './VISRC_NavigationNodeCollection';

/**
 * This class represents a navigation menu node.
 */
class VISRC_ViewNavigationNode extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Override constructor to create collection.
     */
    constructor(aParameters)
    {
        this.modelEvents = {
            "all": "render"
        };
        this.collection = new VISRC_NavigationNodeCollection();
        this.childView = VISRC_ViewNavigationNode;
        this.rodanChannel = Radio.channel("rodan");
        super(aParameters);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_ViewNavigationNode;