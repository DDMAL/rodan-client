import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';
import VISRC_ViewProjectController from './Project/VISRC_ViewProjectController';
import VISRC_ViewResourceController from './Resource/VISRC_ViewResourceController';
import VISRC_ViewWorkflowController from './Workflow/VISRC_ViewWorkflowController';
import VISRC_ViewWorkflowRunController from './WorkflowRun/VISRC_ViewWorkflowRunController';
import VISRC_WorkflowBuilderController from './WorkflowBuilder/VISRC_WorkflowBuilderController';

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
class VISRC_LayoutViewMain extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aOptions)
    {
        this.el = "#app";
        this.template = "#template-empty";
        this.addRegions({
            region: "#region-main"
        });
        this._initializeViews();
        this._initializeRadio();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.viewProjectController = new VISRC_ViewProjectController();
        this.viewResourceController = new VISRC_ViewResourceController();
        this.viewWorkflowController = new VISRC_ViewWorkflowController();
        this.viewWorkflowRunController = new VISRC_ViewWorkflowRunController();
        this.workflowBuilderController = new VISRC_WorkflowBuilderController();
    }

    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.comply(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, aView => this._handleCommandShow(aView));
    }

    /**
     * Handle show.
     */
    _handleCommandShow(aView)
    {
        this.region.show(aView, {preventDestroy: true});
    }
}

export default VISRC_LayoutViewMain;