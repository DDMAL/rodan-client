import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import ViewJob from './Individual/ViewJob';
import ViewJobList from './List/ViewJobList';
import Events from '../../../../../../../Shared/Events';

/**
 * This class represents the layout view for Jobs.
 */
class LayoutViewControlJob extends Marionette.LayoutView
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
            regionControlJobList: "#region-main_workflowbuilder_control_job_list",
            regionControlJobIndividual: "#region-main_workflowbuilder_control_job_individual"
        });
        this._initializeViews();
        this._initializeRadio();
        this.template = "#template-main_workflowbuilder_control_job";
    }

    /**
     * Unbind from events.
     */
    onDestroy()
    {
        this.rodanChannel.off(null, null, this);
        this.rodanChannel.stopComplying(null, null, this);
        this.rodanChannel.stopReplying(null, null, this);
    }

    /**
     * Initially show the list.
     */
    onBeforeShow()
    {
        this.regionControlJobList.show(this.viewJobList);
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
        this.rodanChannel.on(Events.EVENT__JOB_SELECTED, aReturn => this._handleEventJobSelected(aReturn), this);
    }

    /**
     * Handle workflowjob selection.
     */
    _initializeViews()
    {
        this.viewJobList = new ViewJobList();
    }

    /**
     * Handle job selection.
     */
    _handleEventJobSelected(aReturn)
    {
        this.viewJob = new ViewJob(aReturn);
        try
        {
            this.regionControlJobIndividual.show(this.viewJob);
        }
        catch (exception)
        {
            this.viewJob.destroy();
            console.log("TODO - not sure why error is being thrown, https://github.com/ELVIS-Project/vis-client/issues/6");
        }
    }
}

export default LayoutViewControlJob;