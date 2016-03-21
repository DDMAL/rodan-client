import _ from 'underscore';
import BaseViewList from '../../BaseViewList';
import Events from '../../../../../Shared/Events';

class ViewResourceList extends BaseViewList
{
	/**
	 * Handle file button.
	 */
    _handleClickButtonFile()
    {
    	var type = this.$el.find('#select-resourcetype').val();
        for (var i = 0; i < this.ui.fileInput[0].files.length; i++)
        {
        	var file = this.ui.fileInput[0].files[i];
    	    this.rodanChannel.request(Events.REQUEST__RESOURCE_CREATE, {project: this.model, file: file, resourcetype: type});
    	}
	    this.ui.fileInput.replaceWith(this.ui.fileInput = this.ui.fileInput.clone(true));
    }

    /**
     * On render populate the REsourceTypeList select.
     */
    onRender()
    {
        var templateResourceType = _.template($('#template-main_resource_list_resourcetype_list_item').html());
        var resourceTypeCollection = this.rodanChannel.request(Events.REQUEST__GLOBAL_RESOURCETYPE_COLLECTION);
        var html = templateResourceType({url: null, mimetype: 'Auto-detect', extension: 'Rodan will attempt to determine the file type based on the file itself'});
        this.$el.find('#select-resourcetype').append(html);
        for (var i = 0; i < resourceTypeCollection.length; i++)
        {
        	var resourceType = resourceTypeCollection.at(i);
            html = templateResourceType(resourceType.attributes);
        	this.$el.find('#select-resourcetype').append(html);
        }
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