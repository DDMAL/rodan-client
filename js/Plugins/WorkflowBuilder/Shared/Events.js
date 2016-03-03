/**
 * Backbone.Radio events use in this GUI.
 */
var GUI_EVENTS = 
{
    REQUEST__WORKFLOWBUILDER_GUI_ZOOM_IN: 'REQUEST__WORKFLOWBUILDER_GUI_ZOOM_IN',                                                   // Called when request workspace zoom in.
    REQUEST__WORKFLOWBUILDER_GUI_ZOOM_OUT: 'REQUEST__WORKFLOWBUILDER_GUI_ZOOM_OUT',                                                 // Called when request workspace zoom out.
    REQUEST__WORKFLOWBUILDER_GUI_ZOOM_RESET: 'REQUEST__WORKFLOWBUILDER_GUI_ZOOM_RESET',                                             // Called when request workspace zoom reset.

    REQUEST__WORKFLOWBUILDER_GUI_ADD_RESOURCEDISTRIBUTOR: 'REQUEST__WORKFLOWBUILDER_GUI_ADD_RESOURCEDISTRIBUTOR',                   // Called when the GUI should start creation of a Resource Distributor from the selected InputPorts.
    REQUEST__WORKFLOWBUILDER_GUI_HIDE_CONTEXTMENU: 'REQUEST__WORKFLOWBUILDER_GUI_HIDE_CONTEXTMENU', // Request that the context menu be hidden.
    REQUEST__WORKFLOWBUILDER_GUI_SHOW_CONTEXTMENU: 'REQUEST__WORKFLOWBUILDER_GUI_SHOW_CONTEXTMENU',                                  // Called when the GUI should show the context menu. Takes {mouseevent: PaperJS MouseEvent where associated click happened, items: [Object]}.
                                                                                                                                    // Objects in items should be:
                                                                                                                                    // {
                                                                                                                                    //      label: [string] // The text that should appear
                                                                                                                                    //      radiorequest: Events.?  // The Request to make. NOT A RADIO EVENT, rather a REQUEST.
                                                                                                                                    //      options: Object holding any options for Event
                                                                                                                                    // }
    REQUEST__WORKFLOWBUILDER_GUI_GET_SELECTED_WORKFLOWJOB_IDS: 'REQUEST__WORKFLOWBUILDER_GUI_GET_SELECTED_WORKFLOWJOB_IDS'         // Called when request list of all selected WorkflowJob IDs.
};

export default GUI_EVENTS;