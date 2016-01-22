/**
 * Backbone.Radio events use in the Workflow Builder GUI.
 */
var Events = 
{
///////////////////////////////////////////////////////////////////////////////////////
// WorkflowJobCoordinateSet
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__WORKFLOWJOBCOORDINATESETS_LOAD:        'REQUEST__WORKFLOWJOBCOORDINATESETS_LOAD',      // Instructs loading of WorkflowJobCoordinateSets. Takes object containing various query IDs.
    REQUEST__WORKFLOWJOBCOORDINATESET_COLLECTION:   'REQUEST__WORKFLOWJOBCOORDINATESET_COLLECTION', // Returns global WorkflowJobCoordinateSet collection.

///////////////////////////////////////////////////////////////////////////////////////
// WorkflowJobGroupCoordinateSet
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__WORKFLOWJOBGROUPCOORDINATESETS_LOAD:        'REQUEST__WORKFLOWJOBGROUPCOORDINATESETS_LOAD',        // Instructs loading of WorkflowJobGroupCoordinateSets. Takes object containing various query IDs.
    REQUEST__WORKFLOWJOBGROUPCOORDINATESET_COLLECTION:   'REQUEST__WORKFLOWJOBGROUPCOORDINATESET_COLLECTION'    // Returns global WorkflowJobGroupCoordinateSet collection.
};

export default Events;