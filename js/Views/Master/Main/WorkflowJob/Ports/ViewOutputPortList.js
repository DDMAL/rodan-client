import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import ViewOutputPortListItem from './ViewOutputPortListItem';

/**
 * OutputPort list view.
 */
export default class ViewOutputPortList extends BaseViewCollection {}
ViewOutputPortList.prototype.template = '#template-main_outputport_list';
ViewOutputPortList.prototype.childView = ViewOutputPortListItem;