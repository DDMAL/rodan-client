import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * Project admin view.
 */
export default class ViewProjectAdmin extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
   /*     Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__USER_SAVE, 
                                  {fields: {first_name: this.ui.textFirstName.val(), 
                                            last_name: this.ui.textLastName.val(), 
                                            email: this.ui.textEmail.val()}});*/
    }
}
ViewProjectAdmin.prototype.modelEvents = {
            'all': 'render'
        };
ViewProjectAdmin.prototype.ui = {
            buttonAdd: '#button-add_user'
        };
ViewProjectAdmin.prototype.events = {
            'click @ui.buttonAdd': '_handleButtonSave'
        };
ViewProjectAdmin.prototype.template = '#template-main_project_admin';
