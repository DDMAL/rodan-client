import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../Shared/Events';
import ViewNavigationNodeRoot from './ViewNavigationNodeRoot';

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
class LayoutViewNavigation extends Marionette.LayoutView
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
        this._rodanChannel.on(Events.EVENT__AUTHENTICATION_SUCCESS, () => this._handleAuthenticationSuccess());
        this._rodanChannel.on(Events.EVENT__DEAUTHENTICATION_SUCCESS, () => this._handleDeauthenticationSuccess());
    }

    /**
     * Handle authentication.
     */
    _handleAuthenticationSuccess()
    {
        var model = new Backbone.Model({name: "Projects"});
        var object = {model: model, collection: this._rodanChannel.request(Events.REQUEST__COLLECTION_PROJECT)};
        this.regionNavigationTree.show(new ViewNavigationNodeRoot(object)); 
    }

    /**
     * Handle authentication.
     */
    _handleDeauthenticationSuccess()
    {
        var model = new Backbone.Model({name: "Projects"});
        var object = {model: model, collection: this._rodanChannel.request(Events.REQUEST__COLLECTION_PROJECT)};
        this.regionNavigationTree.reset(); 
    }
}

export default LayoutViewNavigation;