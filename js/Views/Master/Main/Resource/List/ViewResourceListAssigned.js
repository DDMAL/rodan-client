import _ from 'underscore';
import BaseViewList from '../../BaseViewList';
import Radio from 'backbone.radio';
import RODAN_EVENTS from '../../../../../Shared/RODAN_EVENTS';
import ViewResourceList from './ViewResourceList';
import ViewResourceListItemModal from './ViewResourceListItemModal';

/**
 * View for assigned Resources when assigning to InputPort.
 */
export default class ViewResourceListAssigned extends ViewResourceList
{
	/**
	 * Handle click.
	 */
	_handleClick()
	{
		var elementsSelection = $(this.el).find('tbody tr.active');
	}
}
ViewResourceListAssigned.prototype.allowMultipleSelection = true;
ViewResourceListAssigned.prototype.template = '#template-modal_resource_list';
ViewResourceListAssigned.prototype.childView = ViewResourceListItemModal;
ViewResourceListAssigned.prototype.events = {
	'click': '_handleClick'
}