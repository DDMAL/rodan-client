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
     * Insert views.
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
     * Initialize views.
     */
    _initializeViews()
    {
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewIndividualWorkflowRun.prototype.modelEvents = {
    'all': 'render'
};
LayoutViewIndividualWorkflowRun.prototype.template = '#template-main_workflowrun_individual';

export default LayoutViewIndividualWorkflowRun;