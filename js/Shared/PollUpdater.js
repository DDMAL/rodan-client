import AbstractUpdater from './AbstractUpdater';
import Radio from 'backbone.radio';
import RODAN_EVENTS from './RODAN_EVENTS';

export default class PollUpdater extends AbstractUpdater
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    constructor(options)
    {
        super(options);
        this._function = null;
        this._frequency = options.frequency;
        this._timer = null;
    }

    setFunction(callbackFunction)
    {
        this.clear();
        this._function = callbackFunction;
        this._timer = setTimeout(() => this._fireFunction(), this._frequency);
    }

    clear()
    {
        if (this._timer !== null)
        {
            clearInterval(this._timer);
        }
        this._function = null;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Fires the function.
     */
    _fireFunction()
    {
        if (this._function != null)
        {
            var response = this._function();
            this._timer = setTimeout(() => this._fireFunction(), this._frequency);
        }
    }
}