var orderDB = require('../../db/order/orderDAO');
var commonDB = require('../../db/common/commonDAO');

var getOrders = exports.getOrders = function (filters, cb, err) {
    orderDB.getOrders(filters, cb, err);
};

exports.getOrderItems = function (filters, cb, err) {
    orderDB.getOrderItems(filters, cb, err);
};


exports.getCount = function (filters, cb, err) {
    orderDB.getCount(filters, cb, err);

};

exports.getDashboardOrderData = function (cb) {
    orderDB.getDashboardOrderData(cb);
};

/*
exports.getChannelConfig = function (channel, service, cb) {
    commonDB.getChannelConfig(channel, service, cb);
};
*/

exports.createOrUpdateOrder = function (orderItem, channel, service, lastUpdateDateForSync, cb) {
    orderDB.createOrUpdateOrder(orderItem, channel, service, lastUpdateDateForSync, cb);
};

/*var groupOrdersByProduct = function (orders) {
    return _.sortBy(_.groupBy(orders, function (order) {
        console.log('order' + JSON.stringify(order));
        return order.order_item_product_id;
    }), 'length').reverse();
}

var groupOrdersByOrderItems = function (orders) {
    var output = _.groupBy(orders, function (order) {
        return order.orders_id;
    });
    return output;
}



Get all orders (date ranged)
- Get order by status (New - Rececived today, Open, Cancelled, Shipped) 
- Get order status
- Get order by shipping due (o)
- Get out of stock order*/

/*
create same structure for 2 more services -
    inventory - 
        inventoryservice
            methods - 
                getProductDetailsByName(name);
                getProductDetailsById (id);
                getAllProducts();
                getProductWithInventoryLessThan (n)
                getProductWithInventoryGreaterThan (n)
            - tallyinventoryservice
            - paxcominventoryservice
            - localdbinventoryservice

    accounting -
        accountingservice
            methods -
                getProfitandLossDetails()
            - tallyaccountingservice
            - paxcomaccountingservice

In order service, please add localOrderService and tallyOrderService
Also, add other methods in orderservice mentioned earlier + gettotalorder(starttime, endtime)

Create configuration object for the application and create a variable in that with app_version


*/