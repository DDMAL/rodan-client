import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';
import ViewWorkflowCollectionItem from './ViewWorkflowCollectionItem';

/**
 * Workflow Collection view.
 */
export default class ViewWorkflowCollection extends BaseViewCollection
{
    _handleButtonNewWorkflow()
    {
        var project = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__PROJECT_GET_ACTIVE);
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__WORKFLOW_CREATE, {project: project});
    }
}
ViewWorkflowCollection.prototype.template = '#template-main_workflow_collection';
ViewWorkflowCollection.prototype.childView = ViewWorkflowCollectionItem;
ViewWorkflowCollection.prototype.behaviors = {Table: {'table': '#table-workflows'}};
ViewWorkflowCollection.prototype.ui = {
    newWorkflowButton: '#button-new_workflow'
};
ViewWorkflowCollection.prototype.events = {
    'click @ui.newWorkflowButton': '_handleButtonNewWorkflow'
};