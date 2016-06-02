import ViewResourceCollection from './ViewResourceCollection';

/**
 * View for Resource Collection in modal view.
 */
export default class ViewResourceCollectionModal extends ViewResourceCollection {}
ViewResourceCollectionModal.prototype.allowMultipleSelection = true;
ViewResourceCollectionModal.prototype.template = '#template-modal_resource_collection';