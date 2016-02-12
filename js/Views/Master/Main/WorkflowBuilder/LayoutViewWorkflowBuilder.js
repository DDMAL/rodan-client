import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';

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
        this._rodanChannel.request(Events.REQUEST__CLEAR_TIMED_EVENT);
    }

    /**
     * Unbind from events.
     */
    onDestroy()
    {
        this._rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_DESTROY);
        this._rodanChannel.off(null, null, this);
        this._rodanChannel.stopReplying(null, null, this);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_ADDPORTS, () => this._handleRequestGetAddPorts(), this); 
    }

    /**
     * Handle button zoom in.
     */
    _handleButtonZoomIn()
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_IN);
    }
    
    /**
     * Handle button zoom out.
     */
    _handleButtonZoomOut()
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_OUT);
    }
    
    /**
     * Handle button zoom reset.
     */
    _handleButtonZoomReset()
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_RESET);
    }

    /**
     * Handle request get add ports.
     */
    _handleRequestGetAddPorts()
    {
        return this.ui.checkboxAddPorts.is(':checked');
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
    checkboxAddPorts: '#checkbox-add_ports'
};
LayoutViewWorkflowBuilder.prototype.events = {
    'click @ui.buttonZoomIn': '_handleButtonZoomIn',
    'click @ui.buttonZoomOut': '_handleButtonZoomOut',
    'click @ui.buttonZoomReset': '_handleButtonZoomReset'
};

export default LayoutViewWorkflowBuilder;