import _ from 'underscore';
import BaseViewList from '../../BaseViewList';
import RODAN_EVENTS from '../../../../../Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';
import ViewResourceList from './ViewResourceList';
import ViewResourceListItemModal from './ViewResourceListItemModal';

/**
 * View for available Resources when assigning to InputPort.
 */
export default class ViewResourceListAvailable extends ViewResourceList
{
    /**
     * Handle click.
     */
    _handleClick()
    {
        var elementsSelection = $(this.el).find('tbody tr.active');
    }
}
ViewResourceListAvailable.prototype.allowMultipleSelection = true;
ViewResourceListAvailable.prototype.template = '#template-modal_resource_list';
ViewResourceListAvailable.prototype.childView = ViewResourceListItemModal;