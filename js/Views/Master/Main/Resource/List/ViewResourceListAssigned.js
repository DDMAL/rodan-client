import _ from 'underscore';
import BaseViewList from '../../BaseViewList';
import RODAN_EVENTS from '../../../../../Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';
import ViewResourceList from './ViewResourceList';
import ViewResourceListItemModal from './ViewResourceListItemModal';

/**
 * View for assigned Resources when assigning to InputPort.
 */
export default class ViewResourceListAssigned extends ViewResourceList {}
ViewResourceListAssigned.prototype.allowMultipleSelection = true;
ViewResourceListAssigned.prototype.template = '#template-modal_resource_list';
ViewResourceListAssigned.prototype.childView = ViewResourceListItemModal;