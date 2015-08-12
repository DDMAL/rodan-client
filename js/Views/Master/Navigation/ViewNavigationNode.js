import $ from 'jquery';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../Shared/Events';

/**
 * This class represents a navigation menu node.
 */
class ViewNavigationNode extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this._rodanChannel = Radio.channel('rodan');
        this._rodanChannel.on(Events.EVENT_NAVIGATION_NODE_SELECTED, aEvent => this._handleEventNodeSelected(aEvent));
        this._initializeRadio();
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
        if (firstUl !== undefined && firstUl.find('div').length > 0)
        {
            firstUl.toggle('fast');
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
     * Show subviews.
     */
    _showSubviews()
    {
        // Show subviews.
        var firstUl = $(this.$el.find(this.childViewContainer)[0]);
        if (firstUl !== undefined)
        {
            firstUl.show();
        }  
    }

    /**
     * Expand parent.
     */
     _expandParent()
     {
        // Show parents.
        if (this._parent !== null && this._parent !== undefined && this._parent instanceof ViewNavigationNode)
        {
            this._parent._showSubviews();
            this._parent._expandParent();
        }
    }

    /**
     * Does highlighting.
     */
    _handleEventNodeSelected(aEvent)
    {
        if (this === aEvent.node)
        {
            this._setHighlight(true);
            this._expandParent();
        }
        else
        {
            this._setHighlight(false);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewNavigationNode.prototype.modelEvents = {
    'all': 'render'
};
ViewNavigationNode.prototype.ui = {
    text: '#node_text'
};
ViewNavigationNode.prototype.events = {
    'click @ui.text': '_handleClick'
};
ViewNavigationNode.prototype.template = '#template-navigation_node';
ViewNavigationNode.prototype.childViewContainer = 'ul';

export default ViewNavigationNode;