import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../Shared/Events';
import LayoutViewMain from './Main/LayoutViewMain';
import LayoutViewMasterModal from './Modals/LayoutViewMasterModal';
import LayoutViewNavigation from './Navigation/LayoutViewNavigation';
import LayoutViewStatus from './Status/LayoutViewStatus';

/**
 * Layout view for master work area.
 */
class LayoutViewMaster extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize
     */
    initialize()
    {
        this.addRegions({
            regionMain: '#region-main',
            regionNavigation: '#region-navigation',
            regionStatus: '#region-status'
        });
        this._initializeRadio();
        this._initializeViews();
    }

    /**
     * Handle rendering.
     */
    onRender()
    {
        this.regionMain.show(this.layoutViewMain);
        this.regionNavigation.show(this.layoutViewNavigation);
        this.regionStatus.show(this.layoutViewStatus);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize all the views so they can respond to events.
     */
    _initializeViews()
    {
        this.layoutViewNavigation = new LayoutViewNavigation();
        this.layoutViewMain = new LayoutViewMain();
        this.layoutViewStatus = new LayoutViewStatus();
        this._layoutViewModalWaiting = new LayoutViewMasterModal({template: '#template-modal_waiting'});
    }

    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
        this._rodanChannel.on(Events.EVENT__SERVER_WAITING, () => this._showModalWaiting());
        this._rodanChannel.on(Events.EVENT__SERVER_IDLE, () => this._hideModalWaiting());
    }

    /**
     * Show waiting modal.
     */
    _showModalWaiting()
    {
        this._layoutViewModalWaiting.render();
        var $modalEl = $("#modal-generic");
        $modalEl.html(this._layoutViewModalWaiting.el);
        $modalEl.modal({backdrop: 'static', keyboard: false});
    }

    /**
     * Hide waiting modal.
     */
    _hideModalWaiting()
    {
        var $modalEl = $("#modal-generic");
        $modalEl.html(this._layoutViewModalWaiting.el);
        $modalEl.modal('hide');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewMaster.prototype.template = '#template-master';

export default LayoutViewMaster;