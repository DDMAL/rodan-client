import BaseViewList from '../../BaseViewList';
import ViewJobListItem from './ViewJobListItem';

class ViewJobList extends BaseViewList {}
ViewJobList.prototype.template = '#template-main_job_list';
ViewJobList.prototype.childView = ViewJobListItem;
ViewJobList.prototype.behaviors = {Table: {'table': '#table-jobs'}};

export default ViewJobList;