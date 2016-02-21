import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * Base View for lists.
 */
class BaseViewList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(options)
    {
        super(options);
        this.rodanChannel = Radio.channel('rodan');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
BaseViewList.prototype.modelEvents = { 'all': 'render' };
BaseViewList.prototype.collectionEvents = { 'all': 'render' };
BaseViewList.prototype.childViewContainer = 'tbody';

export default BaseViewList;