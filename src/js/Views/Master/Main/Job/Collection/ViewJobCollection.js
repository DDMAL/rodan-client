import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import ViewJobCollectionItem from './ViewJobCollectionItem';

/**
 * View for Job Collection.
 */
export default class ViewJobCollection extends BaseViewCollection {}
ViewJobCollection.prototype.template = '#template-main_job_collection';
ViewJobCollection.prototype.childView = ViewJobCollectionItem;
ViewJobCollection.prototype.behaviors = {Table: {'table': '#table-jobs'}};