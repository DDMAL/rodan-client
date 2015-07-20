import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';
import VISRC_ViewNavigationNodeRoot from './VISRC_ViewNavigationNodeRoot';

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
class VISRC_LayoutViewNavigation extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aOptions)
    {
        this._initializeRadio();
        this.template = "#template-navigation";
        this.addRegions({
            regionNavigationTree: "#region-navigation_tree"
        });
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel("rodan");
        this._rodanChannel.on(VISRC_Events.EVENT__AUTHENTICATION_SUCCESS, () => this._handleAuthenticationSuccess());
        this._rodanChannel.on(VISRC_Events.EVENT__DEAUTHENTICATION_SUCCESS, () => this._handleDeauthenticationSuccess());
    }

    /**
     * Handle authentication.
     */
    _handleAuthenticationSuccess()
    {
        var model = new Backbone.Model({name: "Projects"});
        var object = {model: model, collection: this._rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_PROJECT)};
        this.regionNavigationTree.show(new VISRC_ViewNavigationNodeRoot(object)); 
    }

    /**
     * Handle authentication.
     */
    _handleDeauthenticationSuccess()
    {
        var model = new Backbone.Model({name: "Projects"});
        var object = {model: model, collection: this._rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_PROJECT)};
        this.regionNavigationTree.reset(); 
    }
}

export default VISRC_LayoutViewNavigation;