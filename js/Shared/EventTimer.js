import RODAN_EVENTS from './RODAN_EVENTS';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * Timer that triggers a function X milliseconds.
 */
export default class EventTimer extends Marionette.Object
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     *
     * @param {object} options options for EventTimer; options.frequency sets the frequency (in milliseconds) that a registered event will be fired
     */
    initialize(options)
    {
        this._initializeRadio();
        this._options = null;
        this._function
        this._frequency = options.frequency;
        this._timer = null;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__TIMER_SET_FUNCTION, (options) => this._handleSetTimedFunction(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__TIMER_CLEAR, () => this._handleClearTimedEvent());
    }

    /**
     * Handles call to set timed function.
     */
    _handleSetTimedFunction(options)
    {
        this._clearTimer();
        this._function = options.function;
        this._timer = setTimeout(() => this._fireFunction(), this._frequency);
    }

    /**
     * Handles call to clear timed event.
     */
    _handleClearTimedEvent(options)
    {
        this._clearTimer();
    }

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

    /**
     * Clears the timer.
     */
    _clearTimer()
    {
        if (this._timer !== null)
        {
            clearInterval(this._timer);
        }
        this._options = null;
        this._function = null;
    }
}