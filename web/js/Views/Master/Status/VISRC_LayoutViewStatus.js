import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';
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
        this.viewStatusUser = new VISRC_ViewStatusUser();
    }

    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
    }
}

export default VISRC_LayoutViewStatus;