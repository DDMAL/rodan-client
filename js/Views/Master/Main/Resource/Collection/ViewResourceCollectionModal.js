import ViewResourceCollection from './ViewResourceCollection';
import ViewResourceCollectionItemModal from './ViewResourceCollectionItemModal';

/**
 * View for Resource Collection in modal view.
 */
export default class ViewResourceCollectionModal extends ViewResourceCollection {}
ViewResourceCollectionModal.prototype.allowMultipleSelection = true;
ViewResourceCollectionModal.prototype.template = '#template-modal_resource_collection';
ViewResourceCollectionModal.prototype.childView = ViewResourceCollectionItemModal;