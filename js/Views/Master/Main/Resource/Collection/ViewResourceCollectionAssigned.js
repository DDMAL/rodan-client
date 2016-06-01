import ViewResourceCollection from './ViewResourceCollection';
import ViewResourceCollectionItemModal from './ViewResourceCollectionItemModal';

/**
 * View for assigned Resources when assigning to InputPort.
 */
export default class ViewResourceCollectionAssigned extends ViewResourceCollection {}
ViewResourceCollectionAssigned.prototype.allowMultipleSelection = true;
ViewResourceCollectionAssigned.prototype.template = '#template-modal_resource_list';
ViewResourceCollectionAssigned.prototype.childView = ViewResourceCollectionItemModal;