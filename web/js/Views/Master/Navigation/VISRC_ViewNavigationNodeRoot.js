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
        this._initializeRadio();
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
        this.rodanChannel.on(VISRC_Events.EVENT__AUTHENTICATION_SUCCESS, aUser => this._handleEventSuccessAuthentication(aUser));
        this.rodanChannel.on(VISRC_Events.EVENT__PROJECT_SELECTED, aReturn => this._handleEventProjectSelected(aReturn));
    }

    /**
     * Handle event success authentication
     */
    _handleEventSuccessAuthentication(aUser)
    {
        // Nothing to load here...?
    }

    /**
     * Handle event project selected.
     */
    _handleEventProjectSelected(aReturn)
    {
        this.collection.add(aReturn.project);
    }
}

export default VISRC_ViewNavigationNodeRoot;