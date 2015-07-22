import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import ViewResourceAssignment from './Individual/ViewResourceAssignment';
import ViewResourceAssignmentList from './List/ViewResourceAssignmentList';
import Events from '../../../../../../Shared/Events';

/**
 * This class represents the layout view for resource assignments.
 */
class LayoutViewControlResourceAssignment extends Marionette.LayoutView
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
            regionControlResourceAssignmentList: '#region-main_workflowbuilder_control_resourceassignment_list',
            regionControlResourceAssignmentIndividual: '#region-main_workflowbuilder_control_resourceassignment_individual'
        });
        this._initializeViews();
        this._initializeRadio();
        this.ui = {
            buttonShowWorkflow: '#button-show_workflow'
        };
        this.events = {
            'click @ui.buttonShowWorkflow': '_handleButtonShowWorkflow'
        };
        this.template = '#template-main_workflowbuilder_control_resourceassignment';
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
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        this.viewResourceAssignmentList.isDestroyed = false;
        this.regionControlResourceAssignmentList.show(this.viewResourceAssignmentList, {preventDestroy: true});
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
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_RESOURCE, aReturn => this._handleEventResourceSelected(aReturn), this);
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, {});
    }

    /**
     * Handle resource selection.
     */
    _initializeViews()
    {
        this.viewResourceAssignmentList = new ViewResourceAssignmentList();
    }

    /**
     * Handle job selection.
     */
    _handleEventResourceSelected(aReturn)
    {
        this.viewResourceAssignment = new ViewResourceAssignment(aReturn);
        try
        {
            this.regionControlResourceAssignmentIndividual.show(this.viewResourceAssignment, {preventDestroy: true});
        }
        catch (exception)
        {
            this.viewResourceAssignment.destroy();
            console.log('TODO - not sure why error is being thrown, https://github.com/ELVIS-Project/vis-client/issues/6');
        }
    }

    /**
     * Handle button show workflow.
     */
    _handleButtonShowWorkflow()
    {
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, {});
    }
}

export default LayoutViewControlResourceAssignment;