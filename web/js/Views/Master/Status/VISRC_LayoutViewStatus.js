import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';
import VISRC_ViewStatusMessage from './Message/VISRC_ViewStatusMessage';
import VISRC_ViewStatusServer from './Server/VISRC_ViewStatusServer';
import VISRC_ViewStatusUser from './User/VISRC_ViewStatusUser';

/**
 * Layout view for status area.
 */
class VISRC_LayoutViewStatus extends Marionette.LayoutView
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
        this.viewStatusMessage = new VISRC_ViewStatusMessage();
        this.viewStatusServer = new VISRC_ViewStatusServer();
        this.viewStatusUser = new VISRC_ViewStatusUser({user: null});
    }

    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel("rodan");
        this._rodanChannel.on(VISRC_Events.EVENT__AUTHENTICATION_SUCCESS, aPass => this._handleAuthenticationSuccess(aPass));
        this._rodanChannel.on(VISRC_Events.EVENT__DEAUTHENTICATION_SUCCESS, () => this._handleDeauthenticationSuccess());
    }

    /**
     * Handle authentication notification.
     */
    _handleAuthenticationSuccess(aPass)
    {
        this.viewStatusUser = new VISRC_ViewStatusUser({user: aPass.user});
        this.regionStatusUser.show(this.viewStatusUser);
    }

    /**
     * Handle deauthentication notification.
     */
    _handleDeauthenticationSuccess(aPass)
    {
        this.viewStatusUser = new VISRC_ViewStatusUser({user: null});
        this.regionStatusUser.show(this.viewStatusUser);
    }
}

export default VISRC_LayoutViewStatus;