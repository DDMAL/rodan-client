import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';

/**
 * RunJob list view.
 */
export default class ViewRunJobList extends BaseViewCollection {}
ViewRunJobList.prototype.behaviors = {Table: {'table': '#table-runjobs'}};