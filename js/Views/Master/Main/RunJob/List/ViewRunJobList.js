import BaseViewList from 'js/Views/Master/Main/BaseViewList';

/**
 * RunJob list view.
 */
export default class ViewRunJobList extends BaseViewList {}
ViewRunJobList.prototype.behaviors = {Table: {'table': '#table-runjobs'}};