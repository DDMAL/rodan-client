import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';

/**
 * This class represents a navigation menu node.
 */
class VISRC_ViewNavigationNode extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////

    constructor(aParameters)
    {
        this.modelEvents = {
            "all": "render"
        };
        this.childViewContainer = "ul";
        this.template = "#template-navigation_node";
        this._rodanChannel = Radio.channel("rodan");
        this._rodanChannel.on(VISRC_Events.EVENT_NAVIGATION_NODE_SELECTED, aEvent => this._handleEventNodeSelected(aEvent));
        this.ui = {
            text: '#node_text'
        }
        this.events = {
            'click @ui.text': '_handleClick'
        };
        this._initializeRadio();
        super(aParameters);
    }

    /**
     * Initially hide everything.
     */
    onRender()
    {
        this._hideSubviews();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Sets highlight of this menu entry.
     */
    _setHighlight(aHighlight)
    {
        var node = $(this.$el.find('#node_text')[0]);
        if (aHighlight)
        {
            // TODO magic number
            node.css('background-color', '#444444');
        }
        else
        {
            node.css('background-color', '');
        }
    }

    /**
     * Handle click.
     */
    _handleClick(aEvent)
    {
        this._toggleSubviews();
        aEvent.stopPropagation();
        this._sendClickEvents();
    }

    /**
     * Toggle subview show.
     */
    _toggleSubviews()
    {
        var firstUl = $(this.$el.find(this.childViewContainer)[0]);
        if (firstUl !== undefined && firstUl.find("li").length > 0)
        {
            firstUl.toggle("fast");
        }
    }

    /**
     * Hide subvies.
     */
    _hideSubviews()
    {
        var firstUl = $(this.$el.find(this.childViewContainer)[0]);
        if (firstUl !== undefined)
        {
            firstUl.hide();
        } 
    }

    /**
     * Does highlighting.
     */
    _handleEventNodeSelected(aEvent)
    {
        this._setHighlight(this === aEvent.node);
    }

    /**
     * Sends events on click.
     */
    _sendClickEvents()
    {}
}

export default VISRC_ViewNavigationNode;