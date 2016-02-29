import $ from 'jquery';
import jqueryui from 'jqueryui';
import BaseController from './BaseController';
import Configuration from '../Configuration';
import Events from '../Shared/Events';
import LayoutViewMasterModal from '../Views/Master/Modal/LayoutViewMasterModal';

/**
 * Controls modals.
 */
class ControllerModal extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this._waiting = true;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel.reply(Events.REQUEST__MODAL_HIDE, () => this._handleRequestModalHide());
        this.rodanChannel.reply(Events.REQUEST__MODAL_SHOW, options => this._handleRequestModalShow(options));
        this.rodanChannel.reply(Events.REQUEST__MODAL_SHOW_WAITING, () => this._handleRequestModalShowWaiting());
        this.rodanChannel.reply(Events.REQUEST__MODAL_SIMPLE_SHOW, options => this._handleRequestModalSimpleShow(options));

        this.rodanChannel.on(Events.EVENT__SERVER_IDLE, () => this._handleOnServerIdle());
        this.rodanChannel.on(Events.EVENT__SERVER_PANIC, () => this._handleOnServerPanic());
        this.rodanChannel.on(Events.EVENT__SERVER_WAITING, () => this._handleOnServerWaiting());
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle on server idle.
     */
    _handleOnServerIdle()
    {
        var $modalEl = $("#modal-generic");
        if ($modalEl.is(':visible') && this._waiting)
        {
            this.rodanChannel.request(Events.REQUEST__MODAL_HIDE);
        }
    }

    /**
     * Handle on server panic.
     */
    _handleOnServerPanic()
    {
        console.log('server panic');
    }

    /**
     * Handle on server waiting.
     */
    _handleOnServerWaiting()
    {
        var $modalEl = $("#modal-generic");
        if (!$modalEl.is(':visible'))
        {
            this.rodanChannel.request(Events.REQUEST__MODAL_SHOW_WAITING);
        }
    }

    /**
     * Handle request modal hide.
     */
    _handleRequestModalHide()
    {
        var $modalElement = $("#modal-generic");
        $modalElement.modal('hide');
        this._waiting = false;
    }

    /**
     * Handle request modal simple show.
     */
    _handleRequestModalSimpleShow(options)
    {
        var $modalEl = $("#modal-generic");
        if ($modalEl.is(':visible'))
        {
            return;
        }
        this._layoutViewModal = new LayoutViewMasterModal({template: '#template-modal_simple'});
        this._layoutViewModal.render();
        $modalEl.css({top: 0, left: 0, position: 'absolute'});
        $modalEl.html(this._layoutViewModal.el);
        $('.modal-title').text(options.title);
        $('.modal-body').text(options.text);
        $modalEl.modal({backdrop: 'static', keyboard: false}); 
    }

    /**
     * Handle request modal show.
     */
    _handleRequestModalShow(options)
    {
        var $modalEl = $("#modal-generic");
        if ($modalEl.is(':visible'))
        {
            return;
        }
        this._layoutViewModal = new LayoutViewMasterModal({template: '#template-modal'});
        this._layoutViewModal.addRegions({modal_body: '#region-modal_body'});
        this._layoutViewModal.render();
        this._layoutViewModal.getRegion('modal_body').show(options.view);
        $modalEl.css({top: 0, left: 0, position: 'absolute'});
        $modalEl.html(this._layoutViewModal.el);
        $modalEl.draggable({handle: ".modal-header"});
        $('.modal-title').text(options.description);
        $modalEl.modal({backdrop: 'static'});
    }

    /**
     * Handle request modal show waiting.
     */
    _handleRequestModalShowWaiting(options)
    {
        var $modalEl = $("#modal-generic");
        if ($modalEl.is(':visible'))
        {
            return;
        }
        this._layoutViewModal = new LayoutViewMasterModal({template: '#template-modal_waiting'});
        this._layoutViewModal.render();
        $modalEl.css({top: 0, left: 0, position: 'absolute'});
        $modalEl.html(this._layoutViewModal.el);
        $modalEl.modal({backdrop: 'static', keyboard: false});
        this._waiting = true;
    }
}

export default ControllerModal;