import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Events from '../../../../Shared/Events';

/**
 * Controller for the Workflow Builder.
 */
class LayoutViewWorkflowBuilder extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize()
    {
        this.addRegions({
            regionControl: '#region-main_workflowbuilder_control'
        });
        this.template = '#template-main_workflowbuilder';
        this.ui = {
            buttonZoomIn: '#button-zoom_in',
            buttonZoomOut: '#button-zoom_out',
            buttonZoomReset: '#button-zoom_reset'
        };
        this.events = {
            'click @ui.buttonZoomIn': '_handleButtonZoomIn',
            'click @ui.buttonZoomOut': '_handleButtonZoomOut',
            'click @ui.buttonZoomReset': '_handleButtonZoomReset'
        };
        this._initializeRadio();
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
    }


    /**
     * TODO
     */
    showView(aView)
    {
        this.regionControl.show(aView);
    }
    
    /**
     * Handle button zoom in.
     */
    _handleButtonZoomIn()
    {
        this._rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ZOOM_IN);
    }
    
    /**
     * Handle button zoom out.
     */
    _handleButtonZoomOut()
    {
        this._rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ZOOM_OUT);
    }
    
    /**
     * Handle button zoom reset.
     */
    _handleButtonZoomReset()
    {
        this._rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ZOOM_RESET);
    }
}

export default LayoutViewWorkflowBuilder;