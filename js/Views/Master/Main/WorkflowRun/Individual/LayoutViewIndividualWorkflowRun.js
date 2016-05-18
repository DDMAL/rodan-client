import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import LayoutViewModel from 'js/Views/Master/Main/LayoutViewModel';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import ViewResourceList from 'js/Views/Master/Main/Resource/List/ViewResourceList';
import ViewResourceListItem from 'js/Views/Master/Main/Resource/List/ViewResourceListItem';
import ViewRunJobList from 'js/Views/Master/Main/RunJob/List/ViewRunJobList';
import ViewRunJobListItem from 'js/Views/Master/Main/RunJob/List/ViewRunJobListItem';

/**
 * WorkflowRun view.
 */
export default class LayoutViewIndividualWorkflowRun extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.runjobs' (RunJobCollection) and 'options.resources' (ResourceCollection) must also be provided
     */
    initialize(options)
    {
        this._runJobs = options.runjobs;
        this._resources = options.resources;
        this.addRegions({
            regionRunJobList: '#region-main_workflowrun_individual_runjobs',
            regionResourceList: '#region-main_workflowrun_individual_resources'
        });
    }

    /**
     * Insert subviews after render.
     */
    onRender()
    {
        // Empty regions.
        this.regionRunJobList.empty();
        this.regionResourceList.empty();

        // Create Resource list view.
        this._layoutViewResources = new LayoutViewModel();
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__RESOURCE_SHOWLAYOUTVIEW, {layoutView: this._layoutViewResources});
        this.regionResourceList.show(this._layoutViewResources);
        this._viewResourceList = new ViewResourceList({collection: this._resources,
                                                       template: '#template-main_workflowrun_individual_resources_list',
                                                       childView: ViewResourceListItem});
        this._layoutViewResources.showList(this._viewResourceList);

        // Create RunJob list view.
        this._layoutViewRunJobs = new LayoutViewModel();
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__RUNJOB_SHOWLAYOUTVIEW, {layoutView: this._layoutViewRunJobs});
        this.regionRunJobList.show(this._layoutViewRunJobs);
        this._viewRunJobList = new ViewRunJobList({collection: this._runJobs,
                                                   template: '#template-main_runjob_list_notitle',
                                                   childView: ViewRunJobListItem});
        this._layoutViewRunJobs.showList(this._viewRunJobList);

        // Show Resources on default.
        this._showResources();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
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

    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        this.model.set({name: this.ui.textName.val(), description: this.ui.textDescription.val()});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__WORKFLOWRUN_SAVE, {workflowrun: this.model});
    }
}
LayoutViewIndividualWorkflowRun.prototype.modelEvents = {
    'all': 'render'
};
LayoutViewIndividualWorkflowRun.prototype.ui = {
    buttonShowResources: '#button-resources_show',
    buttonShowRunJobs: '#button-runjobs_show',
    buttonSave: '#button-save_workflowrun',
    textName: '#text-workflowrun_name',
    textDescription: '#text-workflowrun_description'
};
LayoutViewIndividualWorkflowRun.prototype.events = {
    'click @ui.buttonShowResources': '_showResources',
    'click @ui.buttonShowRunJobs': '_showRunJobs',
    'click @ui.buttonSave': '_handleButtonSave'

};
LayoutViewIndividualWorkflowRun.prototype.template = '#template-main_workflowrun_individual';