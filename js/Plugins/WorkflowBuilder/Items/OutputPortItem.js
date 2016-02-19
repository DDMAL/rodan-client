import BaseItem from './BaseItem';
import Configuration from '../../../Configuration';
import Events from '../../../Shared/Events';

/**
 * OutputPort item.
 */
class OutputPortItem extends BaseItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(options)
    {
        super(options);
        this.getModelEvent = Events.REQUEST__WORKFLOWBUILDER_GET_OUTPUTPORT;
        //this.deleteModelEvent = Events.REQUEST__WORKFLOWBUILDER_DELETE_OUTPUTPORT;
        this.fillColor = Configuration.WORKFLOWBUILDER.OUTPUTPORT_COLOR;
        this._connectionItems = [];
        this._workflowJobItem = options.workflowjobitem;
    }

    /**
     * Return true iff this item can be moved by itself.
     */
    isMoveable()
    {
        return false;
    }

    /**
     * Adds associated connection item.
     */
    addConnectionItem(item)
    {
        this._connectionItems.push(item);
    }

    /**
     * Removes connection item.
     */
    removeConnectionItem(item)
    {
        for (var i = 0; i < this._connectionItems.length; i++)
        {
            if (this._connectionItems[i] === item)
            {
                this._connectionItems.splice(i, 1);
            }
        }
    }

    /**
     * Update (dummy).
     */
    update()
    {
    }

    /**
     * Disassociate self with WorkflowJobItem.
     */
    disassociate()
    {
        this._workflowJobItem.deleteOutputPortItem(this);
    }

    /**
     * Reassociates itself with WorkflowJobItem.
     */
    reassociate()
    {
        this._workflowJobItem.addOutputPortItem(this);
    }

    /**
     * Destroy cleanup.
     */
    destroy()
    {
        this._destroyConnections();
        super.destroy();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Destroys connections.
     */
    _destroyConnections()
    {
        while (this._connectionItems.length > 0)
        {
            this._connectionItems[0].destroy();
        } 
        this._connectionItems = [];
    }
}

export default OutputPortItem;