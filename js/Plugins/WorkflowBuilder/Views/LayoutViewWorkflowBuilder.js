import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Events from '../../../Shared/Events';
import GUI_EVENTS from '../Shared/Events';

/**
 * This class represents the controller for editing a Workflow.
 */
class LayoutViewWorkflowBuilder extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        this._initializeRadio();
        this.rodanChannel.request(Events.REQUEST__TIMER_CLEAR);
        this._lastErrorCode = '';
        this._lastErrorDetails = '';
    }

    /**
     * Unbind from events.
     */
    onDestroy()
    {
        this.guiChannel.trigger(GUI_EVENTS.EVENT__WORKFLOWBUILDER_GUI_DESTROY);
        
        this.rodanChannel.off(null, null, this);
        this.rodanChannel.stopReplying(null, null, this);
        this.guiChannel.off(null, null, this);
        this.guiChannel.stopReplying(null, null, this);
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
        this.guiChannel = Radio.channel('rodan-client_gui');
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_ADDPORTS, () => this._handleRequestGetAddPorts(), this); 
        this.rodanChannel.on(Events.EVENT__SERVER_ERROR, options => this._handleEventRodanError(options), this);
        this.rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_WORKFLOW_VALIDATED, () => this._handleEventWorkflowValidated(), this);
    }

    /**
     * Handle button zoom in.
     */
    _handleButtonZoomIn()
    {
        this.guiChannel.request(GUI_EVENTS.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_IN);
    }
    
    /**
     * Handle button zoom out.
     */
    _handleButtonZoomOut()
    {
        this.guiChannel.request(GUI_EVENTS.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_OUT);
    }
    
    /**
     * Handle button zoom reset.
     */
    _handleButtonZoomReset()
    {
        this.guiChannel.request(GUI_EVENTS.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_RESET);
    }

    /**
     * Handle request get add ports.
     */
    _handleRequestGetAddPorts()
    {
        return this.ui.checkboxAddPorts.is(':checked');
    }

    /**
     * Handle event Workflow updated.
     */
    _handleEventRodanError(options)
    {
        this._lastErrorCode = options.json.error_code;
        this._lastErrorDetails = options.json.details[0];
        this.ui.dataStatus.text('Workflow is INVALID. Click here for details.'); 
    }

    /**
     * Handle click data status.
     */
    _handleClickDataStatus()
    {
        if (this._lastErrorCode !== '' || this._lastErrorDetails !== '')
        {   
            this.rodanChannel.request(Events.REQUEST__MODAL_SHOW_SIMPLE, {title: 'Error code: ' + this._lastErrorCode, text: this._lastErrorDetails});
        }
    }

    /**
     * Handle event Workflow validated.
     */
    _handleEventWorkflowValidated()
    {
        this._lastErrorCode = '';
        this._lastErrorDetails = '';
        this.ui.dataStatus.text('Workflow is valid.'); 
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewWorkflowBuilder.prototype.template = '#template-main_workflowbuilder';
LayoutViewWorkflowBuilder.prototype.ui = {
    buttonZoomIn: '#button-zoom_in',
    buttonZoomOut: '#button-zoom_out',
    buttonZoomReset: '#button-zoom_reset',
    checkboxAddPorts: '#checkbox-add_ports',
    dataStatus: '#data-workflow_status'
};
LayoutViewWorkflowBuilder.prototype.events = {
    'click @ui.buttonZoomIn': '_handleButtonZoomIn',
    'click @ui.buttonZoomOut': '_handleButtonZoomOut',
    'click @ui.buttonZoomReset': '_handleButtonZoomReset',
    'click @ui.dataStatus': '_handleClickDataStatus'
};

export default LayoutViewWorkflowBuilder;