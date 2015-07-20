import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';
import VISRC_ViewNavigationNode from './VISRC_ViewNavigationNode';
import VISRC_ViewNavigationNodeProject from './VISRC_ViewNavigationNodeProject';

/**
 * This class represents a navigation menu node.
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
        this.template = "#template-navigation_root";
        this.childView = VISRC_ViewNavigationNodeProject;
        this.ui = {
            buttonLogout: '#button-navigation_logout'
        }
        this.events = {
            'click @ui.buttonLogout': '_handleButton'
        };
    }

    /**
     * Initially hide everything.
     */
    onRender()
    {
        this._showSubviews();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
    }

    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        this._rodanChannel.trigger(VISRC_Events.EVENT__PROJECTS_SELECTED);
    }

    /**
     * Handle button.
     */
    _handleButton()
    {
        this._rodanChannel.command(VISRC_Events.COMMAND__AUTHENTICATION_LOGOUT);
    }
}

export default VISRC_ViewNavigationNodeRoot;