import Marionette from 'backbone.marionette';

/**
 * Base View for lists.
 */
export default class BaseViewList extends Marionette.CompositeView
{
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.allowMultipleSelection' (boolean) can be passed; multiple row selection is enabled iff this is true
     */
    initialize(options)
    {
        this.allowMultipleSelection = options.allowMultipleSelection ? options.allowMultipleSelection : false;
    }
}
BaseViewList.prototype.modelEvents = { 'all': 'render' };
BaseViewList.prototype.childViewContainer = 'tbody';