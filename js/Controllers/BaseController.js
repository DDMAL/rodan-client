import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * Base controller.
 */
class BaseController extends Marionette.Object
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(aOptions)
    {
        super(aOptions);
        this._rodanChannel = Radio.channel('rodan');
        this._initializeViews();
        this._initializeRadio();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        throw new Error('this method must be defined by the inheriting class');
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
    }
}

export default BaseController;