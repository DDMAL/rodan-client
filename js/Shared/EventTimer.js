import RODAN_EVENTS from './RODAN_EVENTS';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * Timer that fires an event every X milliseconds.
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
        this._event = null;
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
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__TIMER_SET_EVENT, (options) => this._handleSetTimedEvent(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__TIMER_SET_REQUEST, (options) => this._handleSetTimedRequest(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__TIMER_SET_FUNCTION, (options) => this._handleSetTimedFunction(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__TIMER_CLEAR, () => this._handleClearTimedEvent());
    }

    /**
     * Handles call to set timed event.
     */
    _handleSetTimedEvent(options)
    {
        this._clearTimer();
        this._event = options.event;
        this._options = options.options;
        this._timer = setTimeout(() => this._fireEvent(), this._frequency);
    }

    /**
     * Handles call to set timed request.
     */
    _handleSetTimedRequest(options)
    {
        this._clearTimer();
        this._event = options.request;
        this._options = options.options;
        this._timer = setTimeout(() => this._fireRequest(), this._frequency);
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
     * Fires the event.
     */
    _fireEvent()
    {
        if (this._event != null)
        {
            Radio.channel('rodan').trigger(this._event, this._options);
            this._timer = setTimeout(() => this._fireEvent(), this._frequency);
        }
    }

    /**
     * Fires the request.
     */
    _fireRequest()
    {
        if (this._event != null)
        {
            var response = Radio.channel('rodan').request(this._event, this._options);
            this._timer = setTimeout(() => this._fireRequest(), this._frequency);
        }
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
     * Handle timer test event.
     */
    _handleTimerTestEvent(options)
    {
        console.log('Fired Event ' + this._event + ' with options ' + this._options);
    }

    /**
     * Handle timer test request.
     */
    _handleTimerTestRequest(options)
    {
        console.log('Fired Request ' + this._event + ' with options ' + this._options);
        return true;
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
        this._event = null;
        this._options = null;
        this._function = null;
    }
}