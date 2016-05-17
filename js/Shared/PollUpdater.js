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
        this._timer = setInterval(() => this.update(), options.frequency);
    }
}