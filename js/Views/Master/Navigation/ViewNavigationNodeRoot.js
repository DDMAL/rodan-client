import Events from '../../../Shared/Events';
import ViewNavigationNode from './ViewNavigationNode';
import ViewNavigationNodeProject from './ViewNavigationNodeProject';

/**
 * This class represents a navigation menu node.
 */
class ViewNavigationNodeRoot extends ViewNavigationNode
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize()
    {
        this.template = '#template-navigation_root';
        this.childView = ViewNavigationNodeProject;
        this.ui = {
            buttonLogout: '#button-navigation_logout',
            text: '#node_text'
        };
        this.events = {
            'click @ui.buttonLogout': '_handleButton',
            'click @ui.text': '_handleClick'
        };
    }

    /**
     * Initially hide everything.
     */
    onRender()
    {
        this._showSubviews();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
    }

    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        this._rodanChannel.trigger(Events.EVENT__PROJECTS_SELECTED);
    }

    /**
     * Handle button.
     */
    _handleButton()
    {
        this._rodanChannel.command(Events.COMMAND__AUTHENTICATION_LOGOUT);
    }
}

export default ViewNavigationNodeRoot;