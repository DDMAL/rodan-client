import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events'
import VISRC_ProjectCollection from './VISRC_ProjectCollection'
import VISRC_ViewProjectItemList from './VISRC_ViewProjectListItem'

/**
 * This class represents the view (and controller) for the project list.
 */
class VISRC_ViewProjectList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this._initializeRadio();

        this.modelEvents = {
            "all": "render"
        };
        this.childViewContainer = 'tbody';
        this.template = "#template-main_project_list";
        this.childView = VISRC_ViewProjectItemList;
        this.collection = new VISRC_ProjectCollection();
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
        this.rodanChannel.on(VISRC_Events.EVENT__APPLICATION_READY, () => this._handleEventApplicationReady());
        this.rodanChannel.on(VISRC_Events.EVENT__AUTHENTICATION_SUCCESS, aUser => this._handleAuthenticationSuccess(aUser));
    }

    /**
     * TODO docs
     */
    _handleEventApplicationReady()
    {
    }

    /**
     * Handle authentication notification.
     */
    _handleAuthenticationSuccess(aUser)
    {
    }
}

export default VISRC_ViewProjectList;