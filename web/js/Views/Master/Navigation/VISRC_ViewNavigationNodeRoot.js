import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';
import VISRC_NavigationNodeCollection from './VISRC_NavigationNodeCollection';
import VISRC_ViewNavigationNode from './VISRC_ViewNavigationNode';
import VISRC_ViewNavigationNodeProject from './VISRC_ViewNavigationNodeProject';

/**
 * This class represents the navigation menu
 */
class VISRC_ViewNavigationNodeRoot extends VISRC_ViewNavigationNode
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.template = "#template-navigation_node_root";
        this.childViewContainer = "ul";
        this.childView = VISRC_ViewNavigationNodeProject;
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_PROJECT);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_ViewNavigationNodeRoot;