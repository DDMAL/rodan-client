import BaseModel from './BaseModel';

/**
 * RunJob model.
 */
class RunJob extends BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize()
    {
        this.routeName = 'runjobs';
        this.set('statusText', this._getStatusText(this.get('status')));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Return text based on status.
     */
    _getStatusText(aStatus)
    {
        switch(aStatus)
        {
            case -1:
            {
                return 'Failed';
            }

            case 0:
            {
                return 'Scheduled';
            }

            case 1:
            {
                return 'Processing';
            }

            case 2:
            {
                return 'Waiting for input';
            }

            case 4:
            {
                return 'Finished';
            }

            case 8:
            {
                return 'Expired';
            }

            case 9:
            {
                return 'Cancelled';
            }

            case 11:
            {
                return 'Retrying';
            }

            default:
            {
                return 'Unknown status';
            }
        }
    }
}

export default RunJob;