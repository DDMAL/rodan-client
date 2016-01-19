import BaseItem from './BaseItem';
import Configuration from '../../../Configuration';

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
        this.fillColor = Configuration.WORKFLOWBUILDER.OUTPUTPORT_COLOR;
        this._connectionItems = [];
        this._workflowJobItem = options.workflowjobitem;
        this.update();
    }

    /**
     * Adds associated connection item.
     */
    addConnectionItem(aItem)
    {
        this._connectionItems.push(aItem);
    }

    /**
     * Removes connection item.
     */
    removeConnectionItem(aItem)
    {
        for (var i = 0; i < this._connectionItems.length; i++)
        {
            if (this._connectionItems[i] === aItem)
            {
                this._connectionItems.splice(i, 1);
            }
        }
    }

    /**
     * Update.
     */
    update()
    {
        for (var i = 0; i < this._connectionItems.length; i++)
        {
            // NOTE: we let the InputPorts handle the visibility of ConnectionItems.
            this._connectionItems[i].update();
        }
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