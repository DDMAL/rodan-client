import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import ViewPassword from './ViewPassword';

/**
 * User view.
 */
export default class ViewUser extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__USER_SAVE, 
                                  {fields: {first_name: this.ui.textFirstName.val(), 
                                            last_name: this.ui.textLastName.val(), 
                                            email: this.ui.textEmail.val()}});
    }

    /**
     * Handle change password button.
     */
    _handleButtonChangePassword()
    {
        var view = new ViewPassword();
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW, {title: 'Change Password', view: view, override: true});

    }
}
ViewUser.prototype.modelEvents = {
            'all': 'render'
        };
ViewUser.prototype.ui = {
            buttonSave: '#button-save_user',
            buttonPassword: '#button-change_password',
            textFirstName: '#text-user_firstname',
            textLastName: '#text-user_lastname',
            textEmail: '#text-user_email'
        };
ViewUser.prototype.events = {
            'click @ui.buttonSave': '_handleButtonSave',
            'click @ui.buttonPassword': '_handleButtonChangePassword'
        };
ViewUser.prototype.template = '#template-main_user_individual';
