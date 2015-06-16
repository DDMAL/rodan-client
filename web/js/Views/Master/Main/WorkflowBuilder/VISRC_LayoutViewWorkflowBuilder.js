import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';

/**
 * This is a layout to help render the workflow builder.
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
        this._initializeRadio();
    }

    /**
     * Show view.
     */
    showView(aView)
    {
        this.regionControl.show(aView, {preventDestroy: true});
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
}

export default VISRC_LayoutViewWorkflowBuilder;