import Marionette from 'backbone.marionette';

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
    initialize(options)
    {
        this.model = options.user;
        this.modelEvents = {
            'all': 'render'
        };
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
}

export default ViewStatusUser;