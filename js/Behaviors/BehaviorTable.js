import _ from 'underscore';

import BaseCollection from '../Collections/BaseCollection';
import Events from '../Shared/Events';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * This class represents the table Behavior for views.
 */
class BehaviorTable extends Marionette.Behavior
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
        if (returnObject instanceof BaseCollection)
        {
            // Get options. If they exist, apply filtering and ordering to the template.
            if (returnObject.route)
            {
                var options = this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE_OPTIONS, returnObject.route);
                if (options)
                {
                  //  this._injectFiltering(options.filter_fields);
                }
            }

            // Handle pagination.
            var pagination = returnObject.getPagination();
            if (pagination !== null/* && pagination.get('total') > 1*/)
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
        if (this.$('#pagination').length === 0)
        {
            this.$(this.options.table).before($(this.options.templatePagination).html());
        }

        // Set buttons.
        this.$('#pagination #pagination-previous').hide();
        this.$('#pagination #pagination-next').hide();
        if (pagination.get('current') < pagination.get('total'))
        {
            this.$('#pagination #pagination-next').show();
        }
        if (pagination.get('current') > 1)
        {
            this.$('#pagination #pagination-previous').show();
        }
    }

    /**
     * Injects filtering functionality into template.
     */
    _injectFiltering(filterFields)
    {
        if (this.$('#filter').length === 0)
        {
            // Inject filtering:
            //
            // -    icontains: have a text box for searching; should be automatically created
            // -    if the template has a column marked as 'data-enum', this should tell the app
            //      that values corresponding to that field can be enumerated
            //this.$(this.options.table).before($(this.options.templateFilter).html());
        }
    }


    /**
     * Removes pagination.
     */
    _removePagination()
    {
        $(this.el).remove('#pagination');
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

    /**
     * Handles sort request.
     *
     * Defaults to ascending. Only goes descending if the associated ascending
     * CSS style is currently attached to the target th.
     */
    _handleSort(event)
    {
        var sortField = $(event.currentTarget).attr('data-name');
        if (sortField)
        {
            // Check for sort arrow "up" already there. If so, we want down (else, up).
            var ascending = true;
            if ($(event.currentTarget).find('span.glyphicon-arrow-up').length > 0)
            {
                ascending = false;
            }

            // Do the sort.
            this.view.collection.fetchSort(ascending, sortField);

            // Set the sort arrows properly.
            $(event.currentTarget).parent().find('th span.glyphicon').remove();
            if (ascending)
            {
                $(event.currentTarget).append('<span class="glyphicon glyphicon-arrow-up"></span>');
            }
            else
            {
                $(event.currentTarget).append('<span class="glyphicon glyphicon-arrow-down"></span>');
            }
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
BehaviorTable.prototype.ui = {
    paginationPrevious: '#pagination-previous',
    paginationNext: '#pagination-next'
};
BehaviorTable.prototype.events = {
    'click @ui.paginationPrevious': '_handlePaginationPrevious',
    'click @ui.paginationNext': '_handlePaginationNext',
    'click th': '_handleSort'
};
BehaviorTable.prototype.defaults = {
    'templatePagination': '#template-pagination',
    'templateFilter': '#template-filter',
    'templateFlterText': '#template-filter-text',
    'templateFilterEnum': '#template-filter-enum',
    'table': 'table'
};
BehaviorTable.prototype.collectionEvents = {
    'sync': '_handleCollectionEventSync'
}

export default BehaviorTable;