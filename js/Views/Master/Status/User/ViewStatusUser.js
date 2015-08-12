import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * This class represents the view (and controller) for the status bar - login info.
 */
class ViewStatusUser extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.model = aParameters.user;
        this.modelEvents = {
            'all': 'render'
        };
        this._initializeRadio();
    }

    /**
     * TODO
     */
    getTemplate()
    {
        if (this.model !== null)
        {
            return '#template-status_user';
        }
        else
        {
            return '#template-status_user_none';
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }
}

export default ViewStatusUser;