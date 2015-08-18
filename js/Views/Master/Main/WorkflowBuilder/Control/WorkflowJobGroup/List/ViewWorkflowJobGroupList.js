import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../../Shared/Events';
import ViewWorkflowJobGroupListItem from './ViewWorkflowJobGroupListItem';

/**
 * View/controller for WorkflowJobGroup list.
 */
class ViewWorkflowJobGroupList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this._initializeRadio();
        this.collection = this.rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_COLLECTION);
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
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflowJobGroupList.prototype.modelEvents = {
    'all': 'render'
};
ViewWorkflowJobGroupList.prototype.childViewContainer = 'tbody';
ViewWorkflowJobGroupList.prototype.template = '#template-main_workflowbuilder_control_workflowjobgroup_list';
ViewWorkflowJobGroupList.prototype.childView = ViewWorkflowJobGroupListItem;

export default ViewWorkflowJobGroupList;