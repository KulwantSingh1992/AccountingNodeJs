var CronJob = require('cron').CronJob;
var dashboardService = require('../services/dashboardService');
var orderService = require('../services/order/orderService');
var accountService = require('../services/account/accountService');
var ae = require('../analytics/analyticsengine');

var productService = require('../services/product/productService');
var amazonOrderService = require('../services/order/amazonOrderService');
var flipkartOrderService = require('../services/order/flipkartOrderService');
var paytmOrderService = require('../services/order/paytmOrderService');
var logger = require('../lib/logger');

var orderDashboardProcess = exports.orderDashboardProcess = new CronJob({
    cronTime: '10 * * * * *',
    onTick: function () {
        orderService.getDashboardOrderData(dashboardService.updateDashboardOrderData);
    },
    start: true,
    timeZone: "America/Los_Angeles"
});

var productDashboardProcess = exports.productDashboardProcess = new CronJob({
    cronTime: '10 * * * * *',
    onTick: function () {
        productService.getDashboardProductData(dashboardService.updateDashboardProductData, null);
    },
    start: true,
    timeZone: "America/Los_Angeles"
});


var accountDashboardProcess = exports.accountDashboardProcess = new CronJob({
  cronTime: '10 * * * * *',
  onTick: function() {
      var endDate = new Date();
      var startDate = new Date();
      startDate.setFullYear(startDate.getFullYear()-1);
      accountService.getAccountingDetails(startDate, endDate, dashboardService.updateDashboardAccountData, null);
  },
  start: false,
  timeZone: "America/Los_Angeles"
});

/*

var analyticsEngine = exports.analyticsEngine = new CronJob({
    cronTime: '10 * * * * *',
    onTick: function () {
        ae.run();
    },
    start: true,
    timeZone: "America/Los_Angeles"
});
*/



/*var tallyProductLoadService = exports.tallyProductLoadService = new CronJob({
    cronTime: '30 * * * * *',
    onTick: function () {
        productService.reloadProductLists(null, null);
    },
    start: false,
    timeZone: "America/Los_Angeles"
});*/

var amazonMWSProcess = exports.amazonMWSProcess = new CronJob({
  cronTime: '* 5 * * * *',
  onTick: function() {  
      amazonOrderService.startGetOrders(orderService.createOrUpdateOrder);
  },
  start: false,
  timeZone: "America/Los_Angeles"
});

var flipkartProcess = exports.flipkartProcess = new CronJob({
  cronTime: '* 5 * * * *',
  onTick: function() {  
      flipkartOrderService.startGetOrders(orderService.createOrUpdateOrder);
  },
  start: false,
  timeZone: "America/Los_Angeles"
});

/*var paytmProcess = exports.paytmProcess = new CronJob({
  cronTime: '* 5 * * * *',
  onTick: function() {  
      paytmOrderService.startGetOrders(orderService.createOrUpdateOrder);
  },
  start: false,
  timeZone: "America/Los_Angeles"
});*/

flipkartProcess.start();
amazonMWSProcess.start();
//paytmProcess.start();
accountDashboardProcess.start();
productDashboardProcess.start();
//analyticsEngine.start();
orderDashboardProcess.start();
//tallyProductLoadService.start();