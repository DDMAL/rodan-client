import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';
import VISRC_LayoutViewWorkflowBuilder from './VISRC_LayoutViewWorkflowBuilder';
import VISRC_ViewJob from './Control/Individual/VISRC_ViewJob';
import VISRC_ViewJobList from './Control/List/VISRC_ViewJobList';

/**
 * Controller for the Workflow Builder.
 */
class VISRC_WorkflowBuilderController extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize(aOptions)
    {
        this._initializeViews();
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
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWBUILDER_SELECTED, aReturn => this._handleEventBuilderSelected(aReturn));
        this.rodanChannel.on(VISRC_Events.EVENT__JOB_SELECTED, aReturn => this._handleEventJobSelected(aReturn));
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.layoutView = new VISRC_LayoutViewWorkflowBuilder();
        this.jobListView = new VISRC_ViewJobList();
    }

    /**
     * Handle selection.
     */
    _handleEventBuilderSelected(aReturn)
    {
        // Send the layout view to the main region.
        this.rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this.layoutView);

        // Tell the layout view what to render.
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        this.jobListView.isDestroyed = false;
        this.layoutView.showControlJobList(this.jobListView);
    }

    /**
     * Handle selection.
     */
    _handleEventJobSelected(aReturn)
    {
        // TODO - I don't want to instantiate a view every time, but Marionette doesn't rerender a view if the ENTIRE model
        // is replaced. I should find a better way to do this so I can reuse the same ItemView again and again.
        this.jobView = new VISRC_ViewJob(aReturn);
        this.layoutView.showControlJob(this.jobView);
    }
}

export default VISRC_WorkflowBuilderController;