import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import ViewWorkflowRunCollectionItem from './ViewWorkflowRunCollectionItem';

/**
 * WorkflowRun Collection view.
 */
export default class ViewWorkflowRunCollection extends BaseViewCollection {}
ViewWorkflowRunCollection.prototype.template = '#template-main_workflowrun_collection';
ViewWorkflowRunCollection.prototype.childView = ViewWorkflowRunCollectionItem;
ViewWorkflowRunCollection.prototype.behaviors = {Table: {'table': '#table-workflowruns'}};