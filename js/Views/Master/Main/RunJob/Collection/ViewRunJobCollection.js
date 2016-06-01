import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';

/**
 * RunJob Collection view.
 */
export default class ViewRunJobCollection extends BaseViewCollection {}
ViewRunJobCollection.prototype.behaviors = {Table: {'table': '#table-runjobs'}};