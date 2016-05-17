import AbstractUpdater from './AbstractUpdater';
import Radio from 'backbone.radio';
import RODAN_EVENTS from './RODAN_EVENTS';

/**
 * Updater that syncs collections by a timer.
 */
export default class PollUpdater extends AbstractUpdater
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor
     *
     * @param {options} options options.frequency is the update interval in milliseconds
     */
    constructor(options)
    {
        super(options);
        this._timer = setInterval(() => this.update(), options.frequency);
    }
}