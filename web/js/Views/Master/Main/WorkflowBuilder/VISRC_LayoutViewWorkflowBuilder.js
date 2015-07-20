import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';

/**
 * Controller for the Workflow Builder.
 */
class VISRC_LayoutViewWorkflowBuilder extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize(aOptions)
    {
        this.addRegions({
            regionControl: "#region-main_workflowbuilder_control"
        });
        this.template = "#template-main_workflowbuilder";
        this.ui = {
            buttonZoomIn: '#button-zoom_in',
            buttonZoomOut: '#button-zoom_out',
            buttonZoomReset: '#button-zoom_reset'
        }
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
        this.rodanChannel = Radio.channel("rodan");
    }


    /**
     * TODO
     */
    showView(aView)
    {
        this.regionControl.show(aView);
    }
}

export default VISRC_LayoutViewWorkflowBuilder;