import $ from 'jquery';
import BaseController from './BaseController';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * Controls modals.
 */
export default class ControllerModal extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
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
        // Requests.
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__MODAL_HIDE, () => this._handleRequestModalHide());
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__MODAL_SHOW, options => this._handleRequestModalShow(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__MODAL_SHOW_SIMPLE, options => this._handleRequestModalSimpleShow(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__MODAL_UPDATE_FOOTER, options => this._handleRequestModalUpdateFooter(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle request modal hide.
     */
    _handleRequestModalHide()
    {
        var $modalElement = $('#modal-generic');
        $modalElement.modal('hide');
        this._waiting = false;
    }

    /**
     * Handle request modal simple show.
     */
    _handleRequestModalSimpleShow(options)
    {
        var $modalEl = $('#modal-generic');
        if (!options.override && $modalEl.is(':visible'))
        {
            return;
        }
        this._layoutViewModal = new Marionette.LayoutView({template: '#template-modal_simple'});
        this._layoutViewModal.render();
        $modalEl.css({top: 0, left: 0, position: 'absolute'});
        $modalEl.html(this._layoutViewModal.el);
        $('.modal-title').text(options.title);
        $('.modal-body').append(options.text);
        $modalEl.modal({backdrop: 'static', keyboard: false}); 
    }

    /**
     * Handle request modal show.
     */
    _handleRequestModalShow(options)
    {
        var $modalEl = $('#modal-generic');
        if (!options.override && $modalEl.is(':visible'))
        {
            return;
        }
        this._layoutViewModal = new Marionette.LayoutView({template: '#template-modal'});
        this._layoutViewModal.addRegions({modal_body: '#region-modal_body'});
        this._layoutViewModal.render();
        this._layoutViewModal.getRegion('modal_body').show(options.view);
        $modalEl.css({top: 0, left: 0, position: 'absolute'});
        $modalEl.html(this._layoutViewModal.el);
        $modalEl.draggable({handle: '.modal-header'});
        $('.modal-title').text(options.title);
        $modalEl.modal({backdrop: 'static'});
    }

    /**
     * Handles modal update footer. If a modal is currently visible, this will
     * update the footer.
     */
    _handleRequestModalUpdateFooter(options)
    {
        var $modalEl = $('#modal-generic');
        if ($modalEl.is(':visible'))
        {
            $('.modal-footer').text(options.text); 
        }
    }
}