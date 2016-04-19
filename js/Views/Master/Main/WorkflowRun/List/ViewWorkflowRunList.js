import BaseViewList from '../../BaseViewList';
import ViewWorkflowRunListItem from './ViewWorkflowRunListItem';

/**
 * WorkflowRun list view.
 */
export default class ViewWorkflowRunList extends BaseViewList {}
ViewWorkflowRunList.prototype.template = '#template-main_workflowrun_list';
ViewWorkflowRunList.prototype.childView = ViewWorkflowRunListItem;
ViewWorkflowRunList.prototype.behaviors = {Table: {'table': '#table-workflowruns'}};