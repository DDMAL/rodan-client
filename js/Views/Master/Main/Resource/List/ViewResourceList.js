import BaseViewList from '../../BaseViewList';
import Events from '../../../../../Shared/Events';

class ViewResourceList extends BaseViewList
{
    _handleClickButtonFile()
    {
        for (var i = 0; i < this.ui.fileInput[0].files.length; i++)
        {
        	var file = this.ui.fileInput[0].files[i];
    	    this.rodanChannel.request(Events.REQUEST__RESOURCE_CREATE, {project: this.model, file: file});
    	}
	    this.ui.fileInput.replaceWith(this.ui.fileInput = this.ui.fileInput.clone(true));
    }

}
ViewResourceList.prototype.behaviors = {Table: {'table': '#table-resources'}};
ViewResourceList.prototype.ui = {
    fileInput: '#file-main_resource_file'
};
ViewResourceList.prototype.events = {
    'change @ui.fileInput': '_handleClickButtonFile'
};

export default ViewResourceList;