import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_ViewJob from './Job/Individual/VISRC_ViewJob';
import VISRC_ViewJobList from './Job/List/VISRC_ViewJobList';

/**
 * This class represents the view for choosing jobs for a workflow
 */
class VISRC_LayoutViewControlJob extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.addRegions({
            regionControlJobList: "#region-main_workflowbuilder_control_job_list",
            regionControlJobIndividual: "#region-main_workflowbuilder_control_job_individual"
        });
        this._initializeRadio();
        this._initializeViews();
        this.template = "#template-main_workflowbuilder_control_job";
    }

    /**
     * Initially show the list.
     */
    onShow()
    {
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        this.viewJobList.isDestroyed = false;
        this.regionControlJobList.show(this.viewJobList, {preventDestroy: true});
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
     * Initialize views.
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
        var viewJob = new VISRC_ViewJob(aReturn);
        this.regionControlJobIndividual.show(viewJob, {preventDestroy: true});
    }

}

export default VISRC_LayoutViewControlJob;