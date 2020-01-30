import $ from 'jquery';
import _ from 'underscore';
import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import ViewJobCollectionItem from './ViewJobCollectionItem';

/**
 * View for Job Collection.
 */
export default class ViewJobCollection extends BaseViewCollection {}
ViewJobCollection.prototype.template = _.template($('#template-main_job_collection').text());
ViewJobCollection.prototype.childView = ViewJobCollectionItem;
ViewJobCollection.prototype.behaviors = {Table: {'table': '#table-jobs'}};
