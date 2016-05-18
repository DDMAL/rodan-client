import BaseViewList from 'js/Views/Master/Main/BaseViewList';
import ViewOutputPortListItem from './ViewOutputPortListItem';

/**
 * OutputPort list view.
 */
export default class ViewOutputPortList extends BaseViewList {}
ViewOutputPortList.prototype.template = '#template-main_outputport_list';
ViewOutputPortList.prototype.childView = ViewOutputPortListItem;