//var db = require('../db/db-config').db;
var productDB = require('../db/product/productDAO');
var logger = require('../lib/logger');

exports.topSellingProducts = function (daysSince, limit, cb, err){
    productDB.topSellingProducts(daysSince, limit, cb, err);
}

exports.notSoldProducts = function (daysSince, limit, cb, err){    
    productDB.notSoldProducts(daysSince, limit, cb, err);
}

exports.mostCancelledProducts = function (daysSince, limit, cb, err) {
    productDB.mostCancelledProducts(daysSince, limit, cb, err);
}

exports.getSalesData = function (cb, err) {
    productDB.getSalesData(cb, err);
}

exports.getSalesAndRevenueData = function (cb, err) {
    productDB.getSalesAndRevenueData(cb, err);
}