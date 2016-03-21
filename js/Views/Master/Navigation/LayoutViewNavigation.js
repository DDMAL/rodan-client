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
     * Initialize.
     */
    initialize()
    {
        this._initializeRadio();
        this.addRegions({
            regionNavigationTree: '#region-navigation_tree'
        });
    }

    /**
     * On show initialize the transfer info.
     */
    onShow()
    {
        this._populateUploadCount();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.on(Events.EVENT__AUTHENTICATION_LOGIN_SUCCESS, () => this._handleAuthenticationSuccess());
        this.rodanChannel.on(Events.EVENT__AUTHENTICATION_LOGOUT_SUCCESS, () => this._handleDeauthenticationSuccess());
        this.rodanChannel.on(Events.EVENT__TRANSFERMANAGER_UPLOAD_FAILED, () => this._populateUploadCount());
        this.rodanChannel.on(Events.EVENT__TRANSFERMANAGER_UPLOAD_SUCCEEDED, () => this._populateUploadCount());
    }

    /**
     * Handle authentication.
     */
    _handleAuthenticationSuccess()
    {
        var model = new Backbone.Model({name: 'Projects'});
        var object = {model: model, collection: this.rodanChannel.request(Events.REQUEST__GLOBAL_PROJECT_COLLECTION)};
        this.regionNavigationTree.show(new ViewNavigationNodeRoot(object)); 
    }

    /**
     * Handle deauthentication.
     */
    _handleDeauthenticationSuccess()
    {
        this.regionNavigationTree.reset(); 
    }

    /**
     * Populates the upload count.
     */
    _populateUploadCount()
    {
        var count = this.rodanChannel.request(Events.REQUEST__TRANSFERMANAGER_GET_UPLOAD_COUNT);
        this.$el.find('#navigation-upload_count_pending').text(count.pending);
        this.$el.find('#navigation-upload_count_completed').text(count.completed);
        this.$el.find('#navigation-upload_count_failed').text(count.failed);
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewNavigation.prototype.template = '#template-navigation';

export default LayoutViewNavigation;