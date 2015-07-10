import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_ViewInputPortList from './InputPort/VISRC_ViewInputPortList';
import VISRC_ViewResourceList from './Resource/VISRC_ViewResourceList';

/**
 * LayoutView for creating a new workflow run.
 */
class VISRC_LayoutViewNewWorkflowRun extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize(aOptions)
    {
        this._workflow = aOptions.workflow;
        this.addRegions({
            regionData: "#region-main_workflowrun_newworkflowrun_data",
            regionInputPortList: "#region-main_workflowrun_newworkflowrun_inputport_list",
            regionResourceList: "#region-main_workflowrun_newworkflowrun_resource_list"
        });
        this.template = "#template-main_workflowrun_newworkflowrun";
        this._initializeRadio();
        this._initializeViews();
    }

    /**
     * Insert views.
     */
    onBeforeShow()
    {
        this.regionInputPortList.show(this._viewInputPortList);
        this.regionResourceList.show(this._viewResourceList);
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
     * Initialize views.
     */
    _initializeViews()
    {
        this._viewInputPortList = new VISRC_ViewInputPortList({workflow: this._workflow});
        this._viewResourceList = new VISRC_ViewResourceList();
    }
}

export default VISRC_LayoutViewNewWorkflowRun;