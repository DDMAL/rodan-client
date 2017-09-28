import $ from 'jquery';
import _ from 'underscore';
import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';

/**
 * View for Resource Collection.
 */
export default class ViewResourceCollection extends BaseViewCollection
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
    	    Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__RESOURCE_CREATE, {project: this.model, file: file, resourcetype: type});
    	}
	    this.ui.fileInput.replaceWith(this.ui.fileInput = this.ui.fileInput.clone(true));
    }

    /**
     * On render populate the ResourceTypeList dropdown.
     */
    onRender()
    {
        var templateResourceType = _.template($('#template-resourcetype_collection_item').html());
        var resourceTypeCollection = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_RESOURCETYPE_COLLECTION);
//        var html = templateResourceType({url: null, mimetype: 'Auto-detect', extension: 'Rodan will attempt to determine the file type based on the file itself'});
 //       this.$el.find('#select-resourcetype').append(html);
        for (var i = 0; i < resourceTypeCollection.length; i++)
        {
        	var resourceType = resourceTypeCollection.at(i);
            var html = templateResourceType(resourceType.attributes);
        	this.$el.find('#select-resourcetype').append(html);
        }
    }
}
ViewResourceCollection.prototype.behaviors = {Table: {'table': '#table-resources'}};
ViewResourceCollection.prototype.ui = {
    fileInput: '#file-main_resource_file'
};
ViewResourceCollection.prototype.events = {
    'change @ui.fileInput': '_handleClickButtonFile'
};
ViewResourceCollection.prototype.filterTitles = {
    'creator__username': 'Creator'
};
