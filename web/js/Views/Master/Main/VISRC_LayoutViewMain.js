import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';
import VISRC_ViewLogin from './Login/VISRC_ViewLogin';
import VISRC_ProjectController from './Project/VISRC_ProjectController';
import VISRC_ResourceController from './Resource/VISRC_ResourceController';
import VISRC_WorkflowController from './Workflow/VISRC_WorkflowController';
import VISRC_WorkflowRunController from './WorkflowRun/VISRC_WorkflowRunController';
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
        this.projectController = new VISRC_ProjectController();
        this.resourceController = new VISRC_ResourceController();
        this.workflowController = new VISRC_WorkflowController();
        this.workflowRunController = new VISRC_WorkflowRunController();
        this.workflowBuilderController = new VISRC_WorkflowBuilderController();
        this.loginView = new VISRC_ViewLogin();
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
        this.region.show(aView);
    }
}

export default VISRC_LayoutViewMain;