import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../Shared/Events';
import ViewStatusMessage from './Message/ViewStatusMessage';
import ViewStatusServer from './Server/ViewStatusServer';
import ViewStatusUser from './User/ViewStatusUser';

/**
 * Layout view for status area.
 */
class LayoutViewStatus extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aOptions)
    {
        this.template = "#template-status";
        this.addRegions({
            regionStatusUser: "#region-status_user",
            regionStatusMessage: "#region-status_message",
            regionStatusServer: "#region-status_server"
        });
        this._initializeViews();
        this._initializeRadio();
    }

    /**
     * Render the regions.
     */
    onBeforeShow()
    {
        this.regionStatusMessage.show(this.viewStatusMessage);
        this.regionStatusServer.show(this.viewStatusServer);
        this.regionStatusUser.show(this.viewStatusUser);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.viewStatusMessage = new ViewStatusMessage();
        this.viewStatusServer = new ViewStatusServer();
        this.viewStatusUser = new ViewStatusUser({user: null});
    }

    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel("rodan");
        this._rodanChannel.on(Events.EVENT__AUTHENTICATION_SUCCESS, aPass => this._handleAuthenticationSuccess(aPass));
        this._rodanChannel.on(Events.EVENT__DEAUTHENTICATION_SUCCESS, () => this._handleDeauthenticationSuccess());
    }

    /**
     * Handle authentication notification.
     */
    _handleAuthenticationSuccess(aPass)
    {
        this.viewStatusUser = new ViewStatusUser({user: aPass.user});
        this.regionStatusUser.show(this.viewStatusUser);
    }

    /**
     * Handle deauthentication notification.
     */
    _handleDeauthenticationSuccess(aPass)
    {
        this.viewStatusUser = new ViewStatusUser({user: null});
        this.regionStatusUser.show(this.viewStatusUser);
    }
}

export default LayoutViewStatus;