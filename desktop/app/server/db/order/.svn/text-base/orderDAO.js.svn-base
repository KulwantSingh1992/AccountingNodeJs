var db = require('../db-config').db;
var logger = require('../../lib/logger');
var productService = require('../../services/product/productService');

var _ = require('underscore');

var selectQuery = "select * from orders INNER JOIN order_item ON orders.ORDERS_ID=order_item.order_item_order_id ";

var selectCountQuery = "select count(*) as cnt, orders_channel_id as channel from orders ";

var insertOrderQuery = "INSERT OR REPLACE INTO orders(orders_external_id, orders_channel_id, orders_order_date, orders_status_id, orders_external_status_id, orders_grand_total, orders_created_timestamp, orders_last_updated_timestamp) VALUES (?,?,?,?,?,?,?,?)";

var insertOrderItemQuery = "INSERT OR REPLACE INTO order_item(order_item_id, order_item_order_id,order_item_external_id, order_item_status, order_item_grand_total, order_item_quantity, order_item_unit_price, order_item_product_id,order_item_external_product_id, order_item_name, order_item_estimated_ship_date, order_item_estimated_delivery_date, order_item_created_timestamp, order_item_last_updated_timestamp, product_id, product_name, product_cost_price) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

var insertOrderStatusQuery = "INSERT OR REPLACE INTO order_status (order_status_order_id, order_status_last_updated_timestamp, order_status_old_status, order_status_old_external_status, order_status_extra) VALUES (?,?,?,?,?)";

var updateOrderQuery = "UPDATE orders set orders_order_date = ?, orders_status_id = ?, orders_external_status_id = ?, orders_grand_total = ?, orders_last_updated_timestamp = ? where orders_external_id = ?";

var updateItemQuery = "UPDATE order_item set order_item_status = ?, order_item_grand_total = ?, order_item_quantity = ?, order_item_unit_price = ?, order_item_product_id = ?, order_item_external_product_id = ?, order_item_name = ?, order_item_estimated_ship_date = ?, order_item_estimated_delivery_date = ?, order_item_last_updated_timestamp = ? where order_item_id = ?";

var cancelledCountQuery = "select COUNT(*) as cancelledCount, orders.orders_channel_id as channel from ORDERS where ORDERS_STATUS_ID = ? group by orders.orders_channel_id";

var pendingCountQuery = "select COUNT(*) as pendingCount, orders.orders_channel_id as channel from ORDERS where ORDERS_STATUS_ID NOT IN (?,?,?) group by orders.orders_channel_id";

var todaysOrderQuery = "select COUNT(*) as todaysOrder, orders.orders_channel_id as channel from ORDERS where orders_last_updated_timestamp >= ? and ORDERS_STATUS_ID IN (?,?) group by orders.orders_channel_id";

var dueTodayQuery = "SELECT COUNT(*) as dueToday, orders.orders_channel_id as channel FROM ORDERS INNER JOIN ORDER_ITEM ON ORDERS.ORDERS_ID = ORDER_ITEM.order_item_ORDER_ID WHERE ORDERS.ORDERS_STATUS_ID IN (?,?) AND ORDER_ITEM.order_item_ESTIMATED_SHIP_DATE BETWEEN ? AND ? group by orders.orders_channel_id";

var slaCountQuery = "SELECT COUNT(*) as slaCount, orders.orders_channel_id as channel FROM ORDERS INNER JOIN ORDER_ITEM ON ORDERS.ORDERS_ID = ORDER_ITEM.order_item_ORDER_ID WHERE ORDERS.ORDERS_STATUS_ID IN (?,?) AND ORDER_ITEM.order_item_ESTIMATED_SHIP_DATE < ? group by orders.orders_channel_id";

exports.getDashboardOrderData = function (cb) {
    var data = [];
    var midnightDate = new Date().setHours(0, 0, 0, 0);
    db.all(cancelledCountQuery, ['CANCELLED'], getPendingCount);

    function getPendingCount(err, rows) {
        var merger = {};
        rows.forEach(function (row) {
            merger[row.channel] = row.cancelledCount;
        });
        data.push({
            cancelled: merger
        });
        db.all(pendingCountQuery, ['CANCELLED', 'SHIPPED', 'DELIVERED'], getTodaysOrder);
    }

    function getTodaysOrder(err, rows) {
        var merger = {};
        rows.forEach(function (row) {
            merger[row.channel] = row.pendingCount;
        });
        data.push({
            pending: merger
        });
        db.all(todaysOrderQuery, [midnightDate, 'NEW', 'IN-PROGRESS'], getDueToday);
    }

    function getDueToday(err, rows) {
        var merger = {};
        rows.forEach(function (row) {
            merger[row.channel] = row.todaysOrder;
        });
        data.push({
            ordersToday: merger
        });
        db.all(dueTodayQuery, ['NEW', 'IN-PROGRESS', midnightDate, Date.now()], getSlaCount);
    }

    function getSlaCount(err, rows) {
        var merger = {};
        rows.forEach(function (row) {
            merger[row.channel] = row.dueToday;
        });
        data.push({
            dueToday: merger
        });
        db.all(slaCountQuery, ['NEW', 'IN-PROGRESS', midnightDate], pushSlaData);
    }

    function pushSlaData(err, rows) {
        var merger = {};
        rows.forEach(function (row) {
            merger[row.channel] = row.slaCount;
        });
        data.push({
            sla: merger
        });
        cb(data);
    }
}

exports.getOrders = function (filters, cb, err) {

    var wherecondition = prepareWhereCondition(filters);
    //logger.debug(wherecondition);
    db.all(selectQuery + wherecondition, function (err, rows) {
        var data = [];
        var orders = [];
        var orderIds = {};
        rows.forEach(function (row) {
            var order = {};

            if (row.orders_id in orderIds) {
                order = orderIds[row.orders_id];

            } else {
                order.orders_id = row.orders_id;
                order.orders_external_id = row.orders_external_id;
                order.orders_channel_id = row.orders_channel_id;
                order.orders_order_date = row.orders_order_date;
                order.orders_status_id = row.orders_status_id;
                order.orders_grand_total = row.orders_grand_total;
                order.orders_created_timestamp = row.orders_created_timestamp;
                order.orders_last_updated_timestamp = row.orders_last_updated_timestamp;
                orderIds[row.orders_id] = order;
                order['items'] = [];
                orders.push(order);
            }
            var item = {};
            orderIds[row.orders_id] = order;
            item.order_item_id = row.order_item_id;
            item.order_item_order_id = row.order_item_order_id;
            item.order_item_external_id = row.order_item_external_id;
            item.order_item_status = row.order_item_status;
            item.order_item_grand_total = row.order_item_grand_total;
            item.order_item_quantity = row.order_item_quantity;
            item.order_item_unit_price = row.order_item_unit_price;
            item.order_item_product_id = row.order_item_product_id;
            item.order_item_name = row.order_item_name;
            item.order_item_estimated_ship_date = row.order_item_estimated_ship_date;
            item.order_item_estimated_delivery_date = row.order_item_estimated_delivery_date;
            item.order_item_created_timestamp = row.order_item_created_timestamp;
            item.order_item_last_updated_timestamp = row.order_item_last_updated_timestamp;
            order['items'].push(item);
        });
        cb(orders);
    });

};

exports.getOrderItems = function (filters, cb, err) {

    var wherecondition = prepareWhereCondition(filters);
    //logger.debug(wherecondition);
    db.all(selectQuery + wherecondition, function (err, rows) {
        var orders = [];
        rows.forEach(function (row) {
            orders.push(row);
        });
        /*
        var output = _.sortBy(_.groupBy(orders, function (order) {
            //console.log('order' + JSON.stringify(order));
            return order.order_item_product_id;
        }), 'length').reverse();
*/
        cb(orders);
    });

};


exports.getCount = function (filters, cb, err) {
    var whereCondition = prepareWhereCondition(filters);
    db.all(selectCountQuery + whereCondition + ' group by orders_channel_id', function (err, rows) {
        var data = {};
        var count = 0;
        rows.forEach(function (row) {
            data[row.channel] = row.cnt;
            count += row.cnt;
        });
        data['COUNT'] = count;
        cb(data);
    });

};

var exists = exports.exists = function (orderID, channel, cb, err) {
    db.get('SELECT * FROM orders  where orders.orders_external_id = ? AND orders.orders_channel_id = ?', [orderID, channel], insertCheck);

    function insertCheck(err, rows) {
        console.log(err);
        var exist = null;
        if (rows) {
            exist = rows;
        }
        cb(exist);
    }
};

exports.createOrUpdateOrder = function (orderItem, channel, service, lastUpdateDateForSync, cb) {
    exists(orderItem[0][0].orders_external_id, channel, function (exist) {
        if (exist) {
            updateOrder(orderItem, exist, channel, service, lastUpdateDateForSync, cb);
        } else {
            createOrder(orderItem, channel, service, lastUpdateDateForSync, cb);
        }
    }, null);

}


var updateOrder = exports.updateOrder = function (orderItem, rows, channel, service, lastUpdateDateForSync, cb) {
    db.beginTransaction(function (err, transaction) {
        insertOrderStatus(rows, function () {
            transaction.run(updateOrderQuery, [new Date(orderItem[0][0].orders_order_date).getTime(), orderItem[0][0].orders_status_id, orderItem[0][0].orders_external_status_id, orderItem[0][0].orders_grand_total, new Date(orderItem[0][0].orders_last_updated_timestamp).getTime(), rows.orders_external_id], updateItem);
        });

        function updateItem() {
            for (var i in orderItem[1]) {
                transaction.run(updateItemQuery, [orderItem[1][i].order_item_status_id, orderItem[1][i].order_item_grand_total, orderItem[1][i].order_item_quantity, orderItem[1][i].order_item_unit_price, orderItem[1][i].order_item_product_id, orderItem[1][i].order_item_external_product_id, orderItem[1][i].order_item_name, new Date(orderItem[1][i].order_item_estimated_ship_date).getTime(), new Date(orderItem[1][i].order_item_estimated_delivery_date).getTime(), new Date(orderItem[1][i].order_item_last_updated_timestamp).getTime(), orderItem[1][i].order_item_id]);
            }
        }
        transaction.commit(function (err) {
            if (err) {
                console.error(err);
                transaction.rollback();
            }
            cb(channel, service, lastUpdateDateForSync);
        });
    });
};

var insertOrderStatus = function (rows, cb) {
    db.run(insertOrderStatusQuery, [rows.orders_id, rows.orders_last_updated_timestamp, rows.orders_status_id, rows.orders_external_status_id, ''], cb);
}

var createOrder = exports.createOrder = function (orderItem, channel, service, lastUpdateDateForSync, cb) {
    db.beginTransaction(function (err, transaction) {
        transaction.run(insertOrderQuery, [orderItem[0][0].orders_external_id, orderItem[0][0].orders_channel_id, new Date(orderItem[0][0].orders_order_date).getTime(), orderItem[0][0].orders_status_id, orderItem[0][0].orders_external_status_id, orderItem[0][0].orders_grand_total, new Date().getTime(), new Date(orderItem[0][0].orders_last_updated_timestamp).getTime()], insertItem);

        function insertItem(err) {
            var LastID = this.lastID;
            for (var i in orderItem[1]) {
                productService.getProductByChannelId(orderItem[0][0].orders_channel_id, orderItem[1][i].order_item_external_product_id, function (data) {
                    transaction.run(insertOrderItemQuery, [orderItem[1][i].order_item_id,
                                 LastID, orderItem[1][i].order_item_external_id,
                                 orderItem[1][i].order_item_status_id,
                                 orderItem[1][i].order_item_grand_total,
                                 orderItem[1][i].order_item_quantity,
                                 orderItem[1][i].order_item_unit_price,
                                 orderItem[1][i].order_item_product_id,
                                 orderItem[1][i].order_item_external_product_id,
                                 orderItem[1][i].order_item_name,
                                 new Date(orderItem[1][i].order_item_estimated_ship_date).getTime(),
                                 new Date(orderItem[1][i].order_item_estimated_delivery_date).getTime(),
                                 new Date().getTime(),
                                 new Date(orderItem[1][i].order_item_last_updated_timestamp).getTime(),
                                 data[0].orderItemProductId,
                                 data[0].orderItemChannelProductName,
                                 data[0].orderItemProductCostPrice]);
                    productService.updateInventory(orderItem[0][0].orders_channel_id, orderItem[1][i].order_item_quantity, data[0].orderItemProductId);

                });
            }
        }
        transaction.commit(function (err) {
            if (err) {
                console.error(err);
                transaction.rollback();
            }

            cb(channel, service, lastUpdateDateForSync);
        });
    });

}

function prepareWhereCondition(filters) {
    var condition = "";
    var AND = ' AND ';
    var midnightDate = new Date().setHours(0, 0, 0, 0);
    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (filter.name == 'channels') {
            if (condition.length > 0) {
                condition += AND;
            }
            condition += ' orders_channel_id in (' + filter.value + ') ';
        }
        if (filter.name == 'status') {
            if (condition.length > 0) {
                condition += AND;
            }
            condition += ' orders_status_id in (' + filter.value + ') ';
        }
        if (filter.name == 'createdDateRange') {
            if (condition.length > 0) {
                condition += AND;
            }
            var dateRange = filter.value.split(",");
            if (!dateRange[1]) {
                dateRange[1] = Date.now();
            }
            condition += ' orders_order_date between ' + dateRange[0] + ' AND ' + dateRange[1];
        }
        if (filter.name == 'updatedDateRange') {
            if (condition.length > 0) {
                condition += AND;
            }
            var dateRange = filter.value.split(",");
            if (!dateRange[1]) {
                dateRange[1] = Date.now();
            }
            condition += ' orders_last_updated_timestamp between ' + dateRange[0] + ' AND ' + dateRange[1];
        }
        if (filter.name == 'shipDateRange') {
            if (condition.length > 0) {
                condition += AND;
            }
            var dateRange = filter.value.split(",");
            if (!dateRange[1]) {
                dateRange[1] = Date.now();
            }
            condition += ' order_item_estimated_ship_date between ' + dateRange[0] + ' AND ' + dateRange[1];
        }
        if (filter.name == 'local') {
            if (condition.length > 0) {
                condition += AND;
            }
            condition += ' orders_id = ' + filter.value;
        }
        if (filter.name == 'external') {
            if (condition.length > 0) {
                condition += AND;
            }
            condition += ' orders_external_id = ' + filter.value;
        }
        if (filter.name == 'tag') {
            if (condition.length > 0) {
                condition += AND;
            }
            switch (filter.value) {
            case "sla":
                condition += " ORDERS_STATUS_ID IN ('NEW', 'IN-PROGRESS') AND order_item_ESTIMATED_SHIP_DATE < " + midnightDate;
                break;
            case "cancelled":
                condition += " ORDERS_STATUS_ID = 'CANCELLED' ";
                break;
            case "pending":
                condition += " ORDERS_STATUS_ID NOT IN ('CANCELLED', 'SHIPPED', 'DELIVERED') ";
                break;
            case "dueToday":
                condition += " ORDERS_STATUS_ID IN ('NEW', 'IN-PROGRESS') AND order_item_ESTIMATED_SHIP_DATE BETWEEN " + midnightDate + " AND " + Date.now();
                break;
            case "ordersToday":
                condition += " orders_last_updated_timestamp >= " + midnightDate + " and ORDERS_STATUS_ID IN ('NEW', 'IN-PROGRESS') ";
                break;
            }
        }

    }
    if (condition.length > 0) {
        return " where " + condition;
    }
    return condition;
}