import Marionette from 'backbone.marionette';

/**
 * Base View for lists.
 */
export default class BaseViewList extends Marionette.CompositeView {}
BaseViewList.prototype.modelEvents = { 'all': 'render' };
BaseViewList.prototype.childViewContainer = 'tbody';