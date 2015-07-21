import _ from 'underscore';

function mapFromJsonObject(JsonObject)
{
    'use strict';
    var keyvals = _.pairs(JsonObject);
    var map = new Map(keyvals);
    return map;
}

export { mapFromJsonObject };
