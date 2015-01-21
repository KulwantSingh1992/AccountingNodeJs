var commonDB = require('../../db/common/commonDAO');

var mustache = require('mustache');

exports.paytmOrderStatusEnum = {
        '2': 'NEW',
        '5': 'IN-PROGRESS',
        '23': 'IN-PROGRESS',
        '25': 'IN-PROGRESS',
        '13': 'IN-PROGRESS',
        '10': 'IN-PROGRESS',//handled
        '16': 'IN-PROGRESS',//handled
        '15': 'SHIPPED',
        '7': 'SHIPPED',
        '8': 'CANCELLED',
        '6': 'CANCELLED',
        '17': 'SHIPPED',
        '17': 'SHIPPED',
        '18': 'SHIPPED',
        '12': 'SHIPPED'
    };

exports.paytmOrderExternalStatusEnum = {
    '2' : 'Pending Acknowledgment (Order is Authorized to be Processed)',
    '5' : 'Pending Shipment ( Order has been acknowledged. AWB is to be assigned now)',
    '23' : 'Shipment Created (AWB has been assigned)',
    '25' : 'Manifest Requested ( Manifest has been created ready to be Picked from the Merchant)',
    '13' : 'Ready to Ship ( Shipment is packed )',
    '15' : 'Shipped',
    '7' : 'Delivered',
    '17' : 'Return Requested',
    '18' : 'Returned',
    '6' : 'Failure (Order has been cancelled by the merchant)',
    '8' : 'Cancelled (Order has been cancelled by the User)',
    '12' : 'Refunded',
    '10' : 'Unknown',//handled
    '16' : 'Unknown'//handled
};

exports.amazonOrderStatusEnum = {
        'Pending': 'NEW',
        'Unshipped': 'IN-PROGRESS',
        'PartiallyShipped': 'IN-PROGRESS',
        'Shipped': 'SHIPPED',
        'Canceled': 'CANCELLED',
        'Unfulfillable': 'UNFULFILLED'
};

exports.flipkartOrderStatusEnum = {
        'payment_approved': 'NEW',    
        'packed': 'IN-PROGRESS',
        'label_created': 'IN-PROGRESS',    
        'to_dispatch': 'IN-PROGRESS',
        'delivered': 'SHIPPED',
        'cancelled': 'CANCELLED',
        'shipped': 'SHIPPED'
};

exports.dateformat = function (dt) {

    function pad(number) {
        var r = String(number);
        if (r.length === 1) {
            r = '0' + r;
        }
        return r;
    }

    return dt.getUTCFullYear() + '-' + pad(dt.getUTCMonth() + 1) + '-' + pad(dt.getUTCDate()) + 'T' + pad(dt.getUTCHours()) + ':' + pad(dt.getUTCMinutes()) + ':' + pad(dt.getUTCSeconds()) + 'Z';
};

var Filter = exports.Filter = function (name, value) {
    this.name = name;
    this.value = value;
};

exports.prepareOrderFilter = function (input) {
    var channels = input.channels;
    var status = input.status;
    var createdDateRange = input.createdDateRange;
    var updatedDateRange = input.updatedDateRange;
    var shipDateRange = input.shipDateRange;
    var local = input.local;
    var external = input.external;
    var tag = input.tag;
    var filters = [];
    if (channels) {
        filters.push(new Filter('channels', channels));
    }
    if (status) {
        filters.push(new Filter('status', status));
    }
    if (createdDateRange) {
        filters.push(new Filter('createdDateRange', createdDateRange));
    }
    if (updatedDateRange) {
        filters.push(new Filter('updatedDateRange', updatedDateRange));
    }
    if (shipDateRange) {
        filters.push(new Filter('shipDateRange', shipDateRange));
    }
    if (local) {
        filters.push(new Filter('local', local));
    }
    if (external) {
        filters.push(new Filter('external', external));
    }
    if (tag) {
        filters.push(new Filter('tag', tag));
    }
    return filters;
};

exports.updateSync = function (channelName, service, syncTime) {
     console.log("updateSync " + channelName + " " + syncTime);
    commonDB.updateSync(channelName, service, syncTime);
};

/*This function returns edited template use mustache to edit 
@param jsonData is must contain key value for editing
@param sourceTemplate is the source xml file needs to be parsed with value on keys
@returns xml with kyed values on keys.
*/
exports.templateEditor =  function(sourceTemplate, jsonData) {
    return mustache.render(sourceTemplate, jsonData);
}

exports.validateChannelConfig =  function(credentials, channel) {
    switch(channel) {
    case 'AMAZON':
        break;
    case 'FK':
        validateFK(credentials.username, credentials.password);
        break;
    case 'PTM':
        break;
    }
}