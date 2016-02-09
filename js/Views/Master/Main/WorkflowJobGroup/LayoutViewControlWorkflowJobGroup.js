import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';

/**
 * This class represents the view for editing WorkflowJobGroups.
 */
class LayoutViewControlWorkflowJobGroup extends Marionette.LayoutView
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
        this.addRegions({
            regionControlWorkflowJobGroup: '#region-main_workflowbuilder_control_workflowjobgroup'
        });
        this._workflow = options.workflow;
        this.model = options.workflowjobgroup;
        this._initializeViews(options);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize views.
     */
    _initializeViews(options)
    {
    }
    
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle button delete.
     */
    _handleButtonDelete()
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_DELETE, {workflowjobgroup: this.model, workflow: this._workflow});
    }

    /**
     * Handle button save.
     */
    _handleButtonSave()
    {
        this.model.set({name: this.ui.textName.val()});
        this._rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_SAVE, {workflowjobgroup: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewControlWorkflowJobGroup.prototype.template = '#template-main_workflowjobgroup';
LayoutViewControlWorkflowJobGroup.prototype.ui = {
    buttonSave: '#button-save_workflowjobgroup_data',
    buttonDelete: '#button-delete_workflowjobgroup',
    textName: '#text-workflowjobgroup_name',
};
LayoutViewControlWorkflowJobGroup.prototype.events = {
    'click @ui.buttonSave': '_handleButtonSave',
    'click @ui.buttonDelete': '_handleButtonDelete'
};

export default LayoutViewControlWorkflowJobGroup;