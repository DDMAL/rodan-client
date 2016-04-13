import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * Base controller.
 */
export default class BaseController extends Marionette.Object
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     *
     * @param {object} options Marionette.Object options object
     */
    constructor(options)
    {
        super(options);
        /** @ignore */
        this.rodanChannel = Radio.channel('rodan');
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
        throw new Error('this method must be defined by the inheriting class');
    }
}