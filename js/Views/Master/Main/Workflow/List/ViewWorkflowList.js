import BaseViewList from '../../BaseViewList';
import Events from '../../../../../Shared/Events';
import ViewWorkflowListItem from './ViewWorkflowListItem';

class ViewWorkflowList extends BaseViewList
{
    _handleButtonNewWorkflow()
    {
        var project = this.rodanChannel.request(Events.REQUEST__PROJECT_GET_ACTIVE);
        var workflow = this.rodanChannel.request(Events.REQUEST__WORKFLOW_CREATE, {project: project});
    }
}
ViewWorkflowList.prototype.template = '#template-main_workflow_list';
ViewWorkflowList.prototype.childView = ViewWorkflowListItem;
ViewWorkflowList.prototype.behaviors = {Table: {'table': '#table-workflows'}};
ViewWorkflowList.prototype.ui = {
    newWorkflowButton: '#button-new_workflow'
};
ViewWorkflowList.prototype.events = {
    'click @ui.newWorkflowButton': '_handleButtonNewWorkflow'
};

export default ViewWorkflowList;