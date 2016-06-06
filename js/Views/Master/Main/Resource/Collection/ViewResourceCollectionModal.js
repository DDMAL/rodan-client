import ViewResourceCollection from 'js/Views/Master/Main/Resource/Collection/ViewResourceCollection';
import ViewResourceCollectionModalItem from 'js/Views/Master/Main/Resource/Collection/ViewResourceCollectionModalItem';

/**
 * View for Resource Collection in modal view.
 */
export default class ViewResourceCollectionModal extends ViewResourceCollection {}
ViewResourceCollectionModal.prototype.allowMultipleSelection = true;
ViewResourceCollectionModal.prototype.template = '#template-modal_resource_collection';
ViewResourceCollectionModal.prototype.childView = ViewResourceCollectionModalItem;