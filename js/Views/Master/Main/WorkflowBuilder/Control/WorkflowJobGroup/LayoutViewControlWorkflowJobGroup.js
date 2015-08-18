import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import ViewWorkflowJobGroup from './Individual/ViewWorkflowJobGroup';
import ViewWorkflowJobGroupList from './List/ViewWorkflowJobGroupList';
import Events from '../../../../../../Shared/Events';

/**
 * This class represents the layout view for WorkflowJobGroups.
 */
class LayoutViewControlWorkflowJobGroup extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.addRegions({
            regionControlWorkflowJobGroupList: '#region-main_workflowbuilder_control_workflowjobgroup_list',
            regionControlWorkflowJobGroupIndividual: '#region-main_workflowbuilder_control_workflowjobgroup_individual'
        });
        this._initializeViews();
        this._initializeRadio();
    }

    /**
     * Unbind from events.
     */
    onDestroy()
    {
        this.rodanChannel.off(null, null, this);
        this.rodanChannel.stopReplying(null, null, this);
    }

    /**
     * Initially show the list.
     */
    onBeforeShow()
    {
        this.regionControlWorkflowJobGroupList.show(this.viewWorkflowJobGroupList);
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
        this.rodanChannel.on(Events.EVENT__WORKFLOWJOBGROUP_SELECTED, options => this._handleEventWorkflowJobGroupSelected(options), this);
    }

    /**
     * Handle workflowjob selection.
     */
    _initializeViews()
    {
        this.viewWorkflowJobGroupList = new ViewWorkflowJobGroupList();
    }

    /**
     * Handle WorkflowJobGroup selection.
     */
    _handleEventWorkflowJobGroupSelected(options)
    {
        this.viewWorkflowJobGroup = new ViewWorkflowJobGroup(options);
        try
        {
            this.regionControlWorkflowJobGroupIndividual.show(this.viewWorkflowJobGroup);
        }
        catch (exception)
        {
            this.viewWorkflowJobGroup.destroy();
            console.log('TODO - not sure why error is being thrown, https://github.com/ELVIS-Project/vis-client/issues/6');
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewControlWorkflowJobGroup.prototype.template = '#template-main_workflowbuilder_control_workflowjobgroup';

export default LayoutViewControlWorkflowJobGroup;