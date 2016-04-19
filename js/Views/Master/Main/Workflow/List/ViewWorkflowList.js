import BaseViewList from '../../BaseViewList';
import RODAN_EVENTS from '../../../../../Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';
import ViewWorkflowListItem from './ViewWorkflowListItem';

/**
 * Workflow list view.
 */
export default class ViewWorkflowList extends BaseViewList
{
    _handleButtonNewWorkflow()
    {
        var project = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__PROJECT_GET_ACTIVE);
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__WORKFLOW_CREATE, {project: project});
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