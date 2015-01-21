var flipkart = require('../../lib/flipkart/flipkart');
var flipkartOrders = require('../../lib/flipkart/flipkartOrders');
var db = require('../../db/db-config').db;
var orderDAO = require('../../db/order/orderDAO');
var productDAO = require('../../db/product/productDAO');
var commonDAO = require('../../db/common/commonDAO');
var util = require('../util/util');
var logger = require('../../lib/logger');
var orderService = require('./orderService');

var channel = 'FK';
var service = 'orders';

exports.startGetOrders = function (cb) {  
    orderService.getLastSync(channel, service, function(credentials, extra, lastSync){
        if(credentials.SellerID){
            if(!lastSync){
                lastSync = 1417066000;
            }
            try{
                getOrders(credentials.SellerID, lastSync, cb);
            }catch(e){
                logger.error(e);
            }
        }
    });
};

var getOrders = function (sellerId, createdAfter, cb) {
        flipkart.flipkartClient('54.175.140.196', sellerId);
        var listOrders = flipkartOrders.calls.ListOrders();
        postData = 'sellerId=' + sellerId;
        flipkart.flipkartRequest(listOrders, flipkartRequestCallback, cb, postData);
    };

    var flipkartRequestCallback = function (result, cb) {
        result = JSON.parse(result);
        for(var i in result){
            var order = [];
            var items = [];
            order.push([{
                orders_external_id : result[i].orderId,
                orders_channel_id : channel,
                orders_order_date : result[i].orderDate,
                orders_status_id : util.flipkartOrderStatusEnum[result[i].status], //todo
                orders_external_status_id : result[i].statusLabel, //todo
                orders_grand_total : result[i].totalPrice,
                orders_created_timestamp : Date.now(),
                orders_last_updated_timestamp : result[i].lastUpdated
            }]);
            items.push({
                order_item_id : result[i].orderItemId,
                order_item_external_id : result[i].orderId,
                order_item_status_id : util.flipkartOrderStatusEnum[result[i].status],
                order_item_grand_total :result[i].totalPrice,
                order_item_quantity : result[i].quantity,
                order_item_unit_price : result[i].listPrice, 
                order_item_product_id : result[i].sellerSKU,
                order_item_external_product_id : result[i].channelSKU,
                order_item_name : result[i].productName,
                order_item_estimated_ship_date : result[i].slaDate,
                order_item_estimated_delivery_date : '',
                order_item_created_timestamp : Date.now(),
                order_item_last_updated_timestamp : result[i].lastUpdated
            });
            var lastUpdateDateForSync = Date.now();
            order.push(items);
            cb(order, channel, service, lastUpdateDateForSync, util.updateSync);
        }
    };