import BaseViewList from '../../BaseViewList';
import Events from '../../../../../Shared/Events';

class ViewResourceList extends BaseViewList {}
ViewResourceList.prototype.behaviors = {Table: {'table': '#table-resources'}};

export default ViewResourceList;