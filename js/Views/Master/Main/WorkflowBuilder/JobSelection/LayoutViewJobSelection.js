import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewJobList from '../../Job/List/ViewJobList';
import ViewWorkflowList from '../../Workflow/List/ViewWorkflowList';
import ViewWorkflowListImportItem from './ViewWorkflowListImportItem';

/**
 * View for listing Jobs and Workflows for import.
 */
class LayoutViewJobSelection extends Marionette.LayoutView
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
        this.addRegions({
            regionJobs: '#region-main_workflowbuilder_jobs',
            regionWorkflows: '#region-main_workflowbuilder_workflows'
        });
        this._initializeViews(options);
    }

    /**
     * Initially show just settings.
     */
    onBeforeShow()
    {
        // Empty regions.
        this.regionJobs.empty();
        this.regionWorkflows.empty();

        // Setup regions.
        this.regionJobs.show(this._viewJobList);
        this.regionWorkflows.show(this._viewWorkflowList);

        // Default to showing jobs.
        this._showJobs();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle workflowjob selection.
     */
    _initializeViews(options)
    {
        var project = this._rodanChannel.request(Events.REQUEST__PROJECT_ACTIVE);
        this._viewJobList = new ViewJobList();
        this._viewWorkflowList = new ViewWorkflowList({project: project,
                                                       childView: ViewWorkflowListImportItem,
                                                       template: '#template-main_workflow_list_import'});
    }
    
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle button show Jobs.
     */
    _showJobs()
    {
        this.regionWorkflows.$el.hide();
        this.ui.buttonToggleJobs.css('text-decoration', 'underline');
        this.ui.buttonToggleWorkflows.css('text-decoration', 'none');
        if (!this.regionJobs.$el.is(':visible'))
        {
            this.regionJobs.$el.toggle('fast');
        }
    }

    /**
     * Handle button show Workflows.
     */
    _showWorkflows()
    {
        this.regionJobs.$el.hide();
        this.ui.buttonToggleJobs.css('text-decoration', 'none');
        this.ui.buttonToggleWorkflows.css('text-decoration', 'underline');
        if (!this.regionWorkflows.$el.is(':visible'))
        {
            this.regionWorkflows.$el.toggle('fast');
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewJobSelection.prototype.template = '#template-main_workflowbuilder_job_selection';
LayoutViewJobSelection.prototype.ui = {
    buttonToggleJobs: '#button-jobs_toggle',
    buttonToggleWorkflows: '#button-workflows_toggle'
};
LayoutViewJobSelection.prototype.events = {
    'click @ui.buttonToggleJobs': '_showJobs',
    'click @ui.buttonToggleWorkflows': '_showWorkflows'
};

export default LayoutViewJobSelection;