var flipkart = require('../../lib/flipkart/flipkart');
var flipkartProducts = require('../../lib/flipkart/flipkartProducts');
var db = require('../../db/db-config').db;
var orderDAO = require('../../db/order/orderDAO');
var productDAO = require('../../db/product/productDAO');
var commonDAO = require('../../db/common/commonDAO');
var util = require('../util/util');
var logger = require('../../lib/logger');
var orderService = require('../order/orderService');

var channel = 'FK';
var service = 'product';

exports.startCreateProduct = function (cb, data) {  
    console.log(data);
    orderService.getLastSync(channel, service, function(credentials, extra, lastSync){
        if(credentials.SellerID){
            console.log(credentials);
            try{
                createProduct(credentials.SellerID, lastSync, cb, data);
            }catch(e){
                logger.error(e);
            }
        }
    });
};
var createProduct = function (sellerId, createdAfter, cb, data) {
        flipkart.flipkartClient('54.175.140.196', sellerId);
        var createProduct = flipkartProducts.calls.CreateProduct();
        var postData = {
            "sellerId": "18248633143f46c8",
            "listingParams": [{
                "fsn": data.fsn,
                "skuId": data.skuId,
                "listingStatus": "ACTIVE",
                "localShippingCharge": 100,
                "mrp": parseInt(data.mrp),
                "nationalShippingCharge": 100,
                "zonalShippingCharge": 100,
                "stockCount": 0,
                "sellingPrice": parseInt(data.sellingPrice),
                "procurementSla": 3,
                "priceErrorCheck": "disable"
             }]
        };
        postData = JSON.stringify(postData);
        console.log(postData);
        flipkart.flipkartRequest(createProduct, flipkartRequestCallback, cb, postData);
    };

    var flipkartRequestCallback = function (result, cb) {
            console.log(result);
        /*{"statusCode":"200","status":"success","response":"Products have been listed successfully."}*/
        
        };