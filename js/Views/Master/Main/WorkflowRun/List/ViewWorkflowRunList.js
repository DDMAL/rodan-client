import BaseViewList from '../../BaseViewList';
import ViewWorkflowRunListItem from './ViewWorkflowRunListItem';

class ViewWorkflowRunList extends BaseViewList {}
ViewWorkflowRunList.prototype.template = '#template-main_workflowrun_list';
ViewWorkflowRunList.prototype.childView = ViewWorkflowRunListItem;
ViewWorkflowRunList.prototype.behaviors = {Table: {'table': '#table-workflowruns'}};

export default ViewWorkflowRunList;