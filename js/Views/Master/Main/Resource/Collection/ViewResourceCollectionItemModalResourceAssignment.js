import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';

/**
 * Resource item View for Collection in modal - Resource assignment.
 */
export default class ViewResourceCollectionItemModalResourceAssignment extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.inputport' (InputPort), 'options.assigned' (boolean; is this item assigned for a WorkflowRun), and 'options.workflow' (Workflow) must also be provided
     */
    initialize(options)
    {
        this._inputPort = options.inputport;
        this._assigned = options.assigned;
        this._workflow = options.workflow;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles double click.
     */
    _handleDoubleClick()
    {
        if (this._assigned)
        {
            Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__WORKFLOWBUILDER_UNASSIGN_RESOURCE, {inputport: this._inputPort, resource: this.model, workflow: this._workflow}); 
        }
        else
        {
            Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__WORKFLOWBUILDER_ASSIGN_RESOURCE, {inputport: this._inputPort, resource: this.model, workflow: this._workflow}); 
        }
    }
}
ViewResourceCollectionItemModalResourceAssignment.prototype.template = '#template-modal_resource_collection_item';
ViewResourceCollectionItemModalResourceAssignment.prototype.tagName = 'tr';
ViewResourceCollectionItemModalResourceAssignment.prototype.events = {
    'dblclick': '_handleDoubleClick'
};