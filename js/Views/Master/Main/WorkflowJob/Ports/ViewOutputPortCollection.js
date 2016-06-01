import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import ViewOutputPortCollectionItem from './ViewOutputPortCollectionItem';

/**
 * OutputPort Collection view.
 */
export default class ViewOutputPortCollection extends BaseViewCollection {}
ViewOutputPortCollection.prototype.template = '#template-main_outputport_collection';
ViewOutputPortCollection.prototype.childView = ViewOutputPortCollectionItem;