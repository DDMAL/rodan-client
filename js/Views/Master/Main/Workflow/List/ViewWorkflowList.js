import BaseViewList from '../../BaseViewList';
import ViewWorkflowListItem from './ViewWorkflowListItem';

class ViewWorkflowList extends BaseViewList {}
ViewWorkflowList.prototype.template = '#template-main_workflow_list';
ViewWorkflowList.prototype.childView = ViewWorkflowListItem;
ViewWorkflowList.prototype.behaviors = {Table: {'table': '#table-workflows'}};

export default ViewWorkflowList;