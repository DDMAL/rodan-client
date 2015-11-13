import _ from 'underscore';

import BaseCollection from '../Collections/BaseCollection';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * This class represents the pagination Behavior for views.
 */
class BehaviorPagination extends Marionette.Behavior
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        this._initializeRadio();
    }

    /**
     * When a view has rendered, we want to inject the pagination HTML.
     */
    onRender()
    {

        // Not really pretty, but works for now. Marionette calls 'delegateEvents'
        // bevore our custom 'initialize' on the view. However, at that point, the
        // collection is not yet set in the view, so binding doesn't work. This next
        // line is a work around.
        // TODO - fix/find better way
        this.view.delegateEvents();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle pagination previous.
     */
    _handlePaginationPrevious()
    {
        var pagination = this.view.collection.getPagination();
        var data = this._getURLQueryParameters(pagination.get('previous'));
        this.view.collection.fetch({data: data, reset: true});
    }

    /**
     * Handle pagination next.
     */
    _handlePaginationNext()
    {
        var pagination = this.view.collection.getPagination();
        var data = this._getURLQueryParameters(pagination.get('next'));
        this.view.collection.fetch({data: data, reset: true});
    }

    /**
     * Handles collection event.
     */
    _handleCollectionEventSync(returnObject, object, request)
    {
        var pagination = null;
        if (returnObject instanceof BaseCollection)
        {
            pagination = returnObject.getPagination();
            if (pagination !== null && pagination.get('total') > 1)
            {
                this._injectPagination(pagination);
            }
            else
            {
                this._removePagination();
            }
        }
    }

    /**
     * Injects pagination functionality into view/template.
     */
    _injectPagination(pagination)
    {
        if (this.$('#template-pagination').length === 0)
        {
            this.$(this.options.table).before($(this.options.template).html());
        }

        // Set buttons.
        if (pagination.get('current') === 1)
        {
            this.$('#template-pagination li.previous').hide();
            this.$('#template-pagination li.next').show();
        }
        else if (pagination.get('current') === pagination.get('total'))
        {
            this.$('#template-pagination li.previous').show();
            this.$('#template-pagination li.next').hide();
        }
        else
        {
            this.$('#template-pagination li.previous').show();
            this.$('#template-pagination li.next').show();
        }
    }

    /**
     * Removes pagination.
     */
    _removePagination()
    {
        this.$('#template-pagination').remove();
    }

    /**
     * Returns query parameters from passed URL string.
     *
     * TODO: move this out of here...
     */
    _getURLQueryParameters(string)
    {
        var queryString = string.substr(string.indexOf('?') + 1),
            match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };

        var urlParams = {};
        while (match = search.exec(queryString))
            urlParams[decode(match[1])] = decode(match[2]);
        return urlParams;
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
BehaviorPagination.prototype.ui = {
    paginationPrevious: '#pagination-previous',
    paginationNext: '#pagination-next'
};
BehaviorPagination.prototype.events = {
    'click @ui.paginationPrevious': '_handlePaginationPrevious',
    'click @ui.paginationNext': '_handlePaginationNext'
};
BehaviorPagination.prototype.defaults = {
    'template': '#template-pagination',
    'table': 'table'
};
BehaviorPagination.prototype.collectionEvents = {
    'sync': '_handleCollectionEventSync'
}

export default BehaviorPagination;