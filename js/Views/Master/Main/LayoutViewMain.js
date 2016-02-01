import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../Shared/Events';
import ViewLogin from './Login/ViewLogin';
import InputPortController from './InputPort/InputPortController';
import ProjectController from './Project/ProjectController';
import ResourceController from './Resource/ResourceController';
import RunJobController from './RunJob/RunJobController';
import WorkflowController from './Workflow/WorkflowController';
import WorkflowRunController from './WorkflowRun/WorkflowRunController';
import WorkflowBuilderController from './WorkflowBuilder/WorkflowBuilderController';
import WorkflowJobController from './WorkflowJob/WorkflowJobController';
import WorkflowJobGroupController from './WorkflowJobGroup/WorkflowJobGroupController';

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
    initialize()
    {
        this.addRegions({
            region: 'div'
        });
        this._initializeRadio();

        // Create controllers.
        this.inputPortController = new InputPortController();
        this.projectController = new ProjectController();
        this.resourceController = new ResourceController();
        this.runJobController = new RunJobController();
        this.workflowController = new WorkflowController();
        this.workflowRunController = new WorkflowRunController();
        this.workflowBuilderController = new WorkflowBuilderController();
        this.WorkflowJobController = new WorkflowJobController();
        this.WorkflowJobGroupController = new WorkflowJobGroupController();
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
        this._rodanChannel.reply(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, view => this._handleCommandShow(view));
        this._rodanChannel.on(Events.EVENT__DEAUTHENTICATION_SUCCESS, () => this._handleDeauthenticationSuccess());
        this._rodanChannel.on(Events.EVENT__AUTHENTICATION_LOGINREQUIRED, () => this._handleAuthenticationLoginRequired());
    }

    /**
     * Handles request for login.
     */
    _handleAuthenticationLoginRequired()
    {
        this.loginView = new ViewLogin();
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this.loginView);
    }

    /**
     * Handle show.
     */
    _handleCommandShow(view)
    {
        this.region.show(view);
    }

    /**
     * Handle deauthentication success.
     */
    _handleDeauthenticationSuccess()
    {
        this.loginView = new ViewLogin();
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this.loginView);
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewMain.prototype.template = '#template-empty';

export default LayoutViewMain;