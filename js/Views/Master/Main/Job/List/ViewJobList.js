import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import ViewJobListItem from './ViewJobListItem';

/**
 * View for Job list.
 */
export default class ViewJobList extends BaseViewCollection {}
ViewJobList.prototype.template = '#template-main_job_list';
ViewJobList.prototype.childView = ViewJobListItem;
ViewJobList.prototype.behaviors = {Table: {'table': '#table-jobs'}};

export default ViewJobList;