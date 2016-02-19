import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Events from '../../../../Shared/Events';

/**
 * This class represents the view for editing WorkflowJobGroups.
 */
class ViewWorkflowJobGroup extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        this._initializeRadio();
        this._workflow = options.workflow;
        this.model = options.workflowjobgroup;
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

    /**
     * Handle button delete.
     */
    _handleButtonDelete()
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_DELETE, {workflowjobgroup: this.model, workflow: this._workflow});
    }

    /**
     * Handle button save.
     */
    _handleButtonSave()
    {
        this.model.set({name: this.ui.textName.val()});
        this.rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_SAVE, {workflowjobgroup: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflowJobGroup.prototype.template = '#template-main_workflowjobgroup';
ViewWorkflowJobGroup.prototype.ui = {
    buttonSave: '#button-save_workflowjobgroup_data',
    buttonDelete: '#button-delete_workflowjobgroup',
    textName: '#text-workflowjobgroup_name',
};
ViewWorkflowJobGroup.prototype.events = {
    'click @ui.buttonSave': '_handleButtonSave',
    'click @ui.buttonDelete': '_handleButtonDelete'
};

export default ViewWorkflowJobGroup;