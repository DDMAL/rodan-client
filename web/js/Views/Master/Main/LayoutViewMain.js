import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../Shared/Events';
import ViewLogin from './Login/ViewLogin';
import ProjectController from './Project/ProjectController';
import ResourceController from './Resource/ResourceController';
import WorkflowController from './Workflow/WorkflowController';
import WorkflowRunController from './WorkflowRun/WorkflowRunController';
import WorkflowBuilderController from './WorkflowBuilder/WorkflowBuilderController';

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
class LayoutViewMain extends Marionette.LayoutView
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
        this._initializeRadio();

        // Create controllers.
        this.projectController = new ProjectController();
        this.resourceController = new ResourceController();
        this.workflowController = new WorkflowController();
        this.workflowRunController = new WorkflowRunController();
        this.workflowBuilderController = new WorkflowBuilderController();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel("rodan");
        this._rodanChannel.comply(Events.COMMAND__LAYOUTVIEW_SHOW, aView => this._handleCommandShow(aView));
        this._rodanChannel.on(Events.EVENT__DEAUTHENTICATION_SUCCESS, () => this._handleDeauthenticationSuccess());
        this._rodanChannel.on(Events.EVENT__AUTHENTICATION_ERROR_401, () => this._handleAuthentication401());
    }

    /**
     * Handles failed authentication check.
     */
    _handleAuthentication401()
    {
        this.loginView = new ViewLogin();
        this._rodanChannel.command(Events.COMMAND__LAYOUTVIEW_SHOW, this.loginView);
    }

    /**
     * Handle show.
     */
    _handleCommandShow(aView)
    {
        this.region.show(aView);
    }

    /**
     * Handle deauthentication success.
     */
    _handleDeauthenticationSuccess()
    {
        this.loginView = new ViewLogin();
        this._rodanChannel.command(Events.COMMAND__LAYOUTVIEW_SHOW, this.loginView);
    }
}

export default LayoutViewMain;