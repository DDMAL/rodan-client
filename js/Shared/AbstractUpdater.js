import Radio from 'backbone.radio';
import RODAN_EVENTS from './RODAN_EVENTS';

export default class PollUpdater
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    setFunction(callbackFunction)
    {
        console.error('this function must be defined by a subclass');
    }
    
    clear()
    {
        console.error('this function must be defined by a subclass');
    }
}