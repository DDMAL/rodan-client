import ViewResourceCollection from './ViewResourceCollection';
import ViewResourceCollectionItemModal from './ViewResourceCollectionItemModal';

/**
 * View for available Resources when assigning to InputPort.
 */
export default class ViewResourceCollectionAvailable extends ViewResourceCollection {}
ViewResourceCollectionAvailable.prototype.allowMultipleSelection = true;
ViewResourceCollectionAvailable.prototype.template = '#template-modal_resource_list';
ViewResourceCollectionAvailable.prototype.childView = ViewResourceCollectionItemModal;