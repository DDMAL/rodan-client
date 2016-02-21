import BaseViewList from '../../BaseViewList';

class ViewRunJobList extends BaseViewList {}
ViewRunJobList.prototype.behaviors = {Table: {'table': '#table-runjobs'}};

export default ViewRunJobList;