import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import _ from 'underscore';

import Events from '../../../../../Shared/Events';
import WorkflowRun from '../../../../../Models/WorkflowRun';
import ViewResourceList from '../../Resource/List/ViewResourceList';
import ViewResourceListItem from '../../Resource/List/ViewResourceListItem';
import ViewRunJobList from './RunJob/ViewRunJobList';
import ViewRunJobListItem from './RunJob/ViewRunJobListItem';

/**
 * LayoutView for viewing an individual WorkflowRun.
 */
class LayoutViewIndividualWorkflowRun extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize(options)
    {
        this._initializeRadio();
        this.model = options.workflowRun;
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_RUNJOB);
        this.rodanChannel.request(Events.COMMAND__LOAD_RUNJOBS, {query: {workflow_run: this.model.id}});
        this.addRegions({
            regionRunJobList: '#region-main_workflowrun_individual_runjob_list',
            regionResourceList: '#region-main_workflowrun_individual_resource_list'
        });
    }

    /**
     * Insert views before show.
     */
    onBeforeShow()
    {
        // Empty regions.
        this.regionRunJobList.empty();
        this.regionResourceList.empty();

        // Create lists.
        this._viewResourceList = new ViewResourceList({query: {result_of_workflow_run: this.model.id},
                                                       template: '#template-main_workflowrun_individual_resource_list',
                                                       childView: ViewResourceListItem,
                                                       filters: false})
        this._viewRunJobList = new ViewRunJobList({query: {workflow_run: this.model.id},
                                                      template: '#template-main_runjob_list',
                                                      childView: ViewRunJobListItem});
        this.regionRunJobList.show(this._viewRunJobList);
        this.regionResourceList.show(this._viewResourceList);

        // Hide RunJob list by default.
//        this.regionRunJobList.$el.hide();
        this._showResources();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle button show Resources.
     */
    _showResources()
    {
        this.regionRunJobList.$el.hide();
        this.ui.buttonShowResources.css('text-decoration', 'underline');
        this.ui.buttonShowRunJobs.css('text-decoration', 'none');
        if (!this.regionResourceList.$el.is(':visible'))
        {
            this.regionResourceList.$el.toggle('fast');
        }
    }

    /**
     * Handle button show RunJobs.
     */
    _showRunJobs()
    {
        this.regionResourceList.$el.hide();
        this.ui.buttonShowResources.css('text-decoration', 'none');
        this.ui.buttonShowRunJobs.css('text-decoration', 'underline');
        if (!this.regionRunJobList.$el.is(':visible'))
        {
            this.regionRunJobList.$el.toggle('fast');
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewIndividualWorkflowRun.prototype.modelEvents = {
    'all': 'render'
};
LayoutViewIndividualWorkflowRun.prototype.ui = {
    buttonShowResources: '#button-resources_show',
    buttonShowRunJobs: '#button-runjobs_show'
};
LayoutViewIndividualWorkflowRun.prototype.events = {
    'click @ui.buttonShowResources': '_showResources',
    'click @ui.buttonShowRunJobs': '_showRunJobs'
};
LayoutViewIndividualWorkflowRun.prototype.template = '#template-main_workflowrun_individual';

export default LayoutViewIndividualWorkflowRun;