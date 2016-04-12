import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import LayoutViewModel from '../../LayoutViewModel';
import ViewResourceList from '../../Resource/List/ViewResourceList';
import ViewResourceListItem from '../../Resource/List/ViewResourceListItem';
import ViewRunJobList from '../../RunJob/List/ViewRunJobList';
import ViewRunJobListItem from '../../RunJob/List/ViewRunJobListItem';

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
        this._runJobCollection = options.collection;
        this.addRegions({
            regionRunJobList: '#region-main_workflowrun_individual_runjobs',
            regionResourceList: '#region-main_workflowrun_individual_resources'
        });
    }

    /**
     * Insert views before render.
     */
    onRender()
    {
        // Empty regions.
        this.regionRunJobList.empty();
        this.regionResourceList.empty();

        // Create Resource views.
        this._layoutViewResources = new LayoutViewModel();
        this.rodanChannel.request(Events.REQUEST__RESOURCE_SHOWLAYOUTVIEW, {layoutView: this._layoutViewResources});
        this.regionResourceList.show(this._layoutViewResources);
        var collection = this.rodanChannel.request(Events.REQUEST__RESOURCES_LOAD, {data: {result_of_workflow_run: this.model.id}});
        this._viewResourceList = new ViewResourceList({collection: collection,
                                                       template: '#template-main_workflowrun_individual_resources_list',
                                                       childView: ViewResourceListItem});
        this._layoutViewResources.showList(this._viewResourceList);

        // Create Resource views.
        this._layoutViewRunJobs = new LayoutViewModel();
        this.rodanChannel.request(Events.REQUEST__RUNJOB_SHOWLAYOUTVIEW, {layoutView: this._layoutViewRunJobs});
        this.regionRunJobList.show(this._layoutViewRunJobs);
        this._viewRunJobList = new ViewRunJobList({collection: this._runJobCollection,
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

    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        this.model.set({name: this.ui.textName.val(), description: this.ui.textDescription.val()});
        this.rodanChannel.request(Events.REQUEST__WORKFLOWRUN_SAVE, {workflowrun: this.model});
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

export default LayoutViewIndividualWorkflowRun;