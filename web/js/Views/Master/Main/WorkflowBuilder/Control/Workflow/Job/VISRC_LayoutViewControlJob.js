import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_ViewJob from './Individual/VISRC_ViewJob';
import VISRC_ViewJobList from './List/VISRC_ViewJobList';
import VISRC_Events from '../../../../../../../Shared/VISRC_Events';

/**
 * This class represents the layout view for Jobs.
 */
class VISRC_LayoutViewControlJob extends Marionette.LayoutView
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
     * Initially show the list.
     */
    onBeforeShow()
    {
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        this.viewJobList.isDestroyed = false;
        this.regionControlJobList.show(this.viewJobList, {preventDestroy: true});
     /*   if (this.viewJob != null)
        {
            this.regionControlJobIndividual.show(this.viewJob, {preventDestroy: true});
        }*/
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
        this.rodanChannel.on(VISRC_Events.EVENT__JOB_SELECTED, aReturn => this._handleEventJobSelected(aReturn));
    }

    /**
     * Handle workflowjob selection.
     */
    _initializeViews()
    {
        this.viewJobList = new VISRC_ViewJobList();
    }

    /**
     * Handle job selection.
     */
    _handleEventJobSelected(aReturn)
    {
        this.viewJob = new VISRC_ViewJob(aReturn);
        try
        {
            this.regionControlJobIndividual.show(this.viewJob, {preventDestroy: true});
        }
        catch (exception)
        {
            this.viewJob.destroy();
            console.log("TODO - not sure why error is being thrown, https://github.com/ELVIS-Project/vis-client/issues/6");
        }
    }
}

export default VISRC_LayoutViewControlJob;