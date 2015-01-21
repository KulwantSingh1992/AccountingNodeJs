var productDB = require('../../db/product/productDAO');
var logger = require('../../lib/logger');
var tallyProductService = require('./tallyProductservice');
var flipkartProductService = require('./flipkartProductService');

// provide filters for this as well

exports.getProducts = function (cb, err) {
    productDB.getProducts(cb, err);
};

exports.getProductLikeName = function (prod, cb, err) {
    productDB.getProductLikeName(prod, cb, err);
}; 

exports.createProduct = function (destination, prod, cb, err) {
    switch(destination){
        case 'FK':
            flipkartProductService.startCreateProduct(null, prod);
            break;
        case 'AMAZON':
            break;
        case 'TALLY':
            break;
    }
}

exports.updateProduct = function (destination, prod, cb, err) {
    productDB.updateProduct(destination, prod, cb, err);
}


exports.createOrUpdateProduct = function (destination, prod, cb, err) {
    productDB.createOrUpdateProduct(destination, prod, cb, err);
}


exports.deleteProduct = function (prodid, cb, err) {
    productDB.deleteProduct(prodid, cb, err);
}

exports.getProductById = function (id, cb, err) {
    productDB.getProductById(id, cb, err);
}

exports.exists = function (existid, cb, err) {
    productDB.exists(existid, cb, err);
}

exports.getDashboardProductData = function (cb, err){    
    //productDB.getProducts
    
}

exports.reloadProductLists = function(cb, err) {
    productDB.getTallyCredentials(invokeAccountingDetails);
    function invokeAccountingDetails(cred){
        if(cred.URL) tallyProductService.reloadProductLists(cred, cb, err);
    }
};

exports.getLastSync = function (channel, service, cb) {
    commonDB.getLastSync(channel, service, cb);
};

/*code added by karam as on 15 jan 15*/

exports.listProduct = function(prod, cb, err){
    //add code here
    var result = {
        transactionId : 00,
        product : prod
    }
    cb(result);
}

exports.getProductByChannelId = function(channelName, productId, cb) {
    productDB.getProductByChannelId(channelName,productId,cb, 'null');
}

exports.updateInventory = function( channelName, orderItemQuantity, orderItemProductId) {
    productDB.updateInventory(channelName, orderItemQuantity, orderItemProductId);
}