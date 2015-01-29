var express = require("express");
    path = require("path");
	var logger = require('./server/lib/logger');   //kulwant singh put this line here
var app = express();
var formidable=require('formidable');

process.on('uncaughtException', function(err) {
  logger.debug(err);
    if (err.stack){
        logger.debug(err.stack);
    }
});



app.configure(function () {
    //app.set('port', process.env.PORT || 3000);
	app.listen(3000);
    //app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'client')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

//var amazonOrderService = require('./server/services/order/amazonOrderService');
var analyticsEngine = require('./server/analytics/analyticsengine');
//var flipkartOrderService = require('./server/services/order/flipkartOrderService');
var flipkartProductService = require('./server/services/product/flipkartProductService');
//var orderService = require('./server/services/order/orderService');
var paytmOrderService = require('./server/services/order/paytmOrderService');
var paytmProductService = require('./server/services/product/paytmProductService');
var productService = require('./server/services/product/productService');
var dashboardService = require('./server/services/dashboardService');
var accountService = require('./server/services/account/accountService');
var bkg = require('./server/processes/dashboardBackgroundProcess');

var util = require('./server/services/util/util');
var configService = require('./server/services/config/configService');
//var updater = require('./server/updater');

app.get('/initializeAmazon', function (req, res) {
    amazonOrderService.startGetOrders();
    orderService.getDashboardOrderData(dashboardService.updateDashboardOrderData);
});



app.get('/order/local/:id', function (req, res) {
     orderService.getOrders(util.prepareOrderFilter({local : req.params.id}), function (orders) {
        res.send(orders);
    }, null);
});


app.get('/order/external/:id', function (req, res) {
    orderService.getOrders(util.prepareOrderFilter({external : req.params.id}), function (orders) {
        res.send(orders);
    }, null);
});

app.post('/order/count',function (req, res) {
    var channel = req.body.channel;
    var Filter = orderService.Filter;
    var filters = [];
    if (channel) {
        filters.push(new Filter('channel', channel));
    }
    orderService.getCount(filters, function (result) {
        res.send(JSON.stringify(result));
    }, null);
});

app.post('/orderitem', function (req, res) {
    logger.debug(req.body);
    orderService.getOrderItems(util.prepareOrderFilter(req.body), function (result) {
        res.send(result);
    }, null);
});



app.get('/order/dashboard/detail', function (req, res) {
    res.send(dashboardService.getOrderDetails());

});

app.get('/dashboard/detail', function (req, res) {
    res.send({dashboaddetails: dashboardService.getDashboardDetails()});
});

app.get('/product', function (req, res) {
    productService.getProducts(function (result) {
        res.send(result);
    }, null);
});

app.get('/product/:name', function (req, res) {
    productService.getProductLikeName (req.params.name, function (result) {
        res.send(result);
    }, null);
});


app.post('/product', function (req, res) {
    logger.debug(req.body);
	productService.updateProduct('localdb',req.body, function (result) {
		logger.debug(result);
        res.send(result);
    }, function (){});
});


app.post('/order', function (req, res) {
    logger.debug(req.body);
    orderService.getOrders(util.prepareOrderFilter(req.body), function (orders) {
        res.send(orders);
    }, null);
});

app.get('/account/dashboard/detail', function(req, res){
    res.send(dashboardService.getAccountingDetails());
});

app.get('/product/dashboard/detail', function(req, res){
    res.send(dashboardService.getProductDashboardDetails());
});

app.post('/setting', function (req, res) {
    var params = req.body;
    configService.setConfiguration(params, function(result){
        res.send(result);
    }, null);
});

app.get('/setting', function (req, res) {
    configService.getConfiguration(function(result) {
        res.send(result);
    }, null);
});

app.get('/paytm', function (req, res) {
    paytmOrderService.startGetOrders(orderService.createOrUpdateOrder);
});

app.get('/paytmprod', function (req, res) {
    paytmProductService.startGetProducts();
});

var topMostOrdersDays = 30;
app.get('/topSellingProducts', function (req, res) {
    analyticsEngine.topSellingProducts (topMostOrdersDays,  5, function (result) {
        res.send(result);
    }, null);
});

var lessSoldProductDays = 7;
app.get('/notSoldProducts', function (req, res) {
    analyticsEngine.notSoldProducts (lessSoldProductDays, 5, function (result) {
        res.send(result);
    }, null);
});

var mostCancelledDays = 30;
app.get('/mostCancelledProducts', function (req, res) {
    analyticsEngine.mostCancelledProducts (mostCancelledDays, 5, function (result) {
        res.send(result);
    }, null);
});

app.get('/analytics', function (req, res) {

});

app.get('/product/analytics', function (req, res) {

});

app.get('/getSalesData', function (req, res) {
    analyticsEngine.getSalesData (function (result) {
        res.send(result);
    }, null);
});

app.get('/getSalesAndRevenueData', function (req, res) {
    analyticsEngine.getSalesAndRevenueData (function (result) {
        res.send(result);
    }, null);
});

app.get('/notification/first', function (req, res) {

});

app.get('/fk', function (req, res) {
    flipkartOrderService.startGetOrders(orderService.createOrUpdateOrder);
});

/*app.post('/fkprod', function (req, res) {
    flipkartProductService.startCreateProduct(res.send, req.body);
});

app.post('/test', function (req, res) {
    res.send(req.body);
});
*/
/* by karam as on 22-dec-2014*/

//app.get('/account/ratio', function(req,res){
//    var startDate = "1-11-2014";
//    var endDate = "2-12-2014";    
//    accountService.getAccountingDetails(startDate, endDate, function(result){
//		res.send(result);
//   });
//});
//this code is done in dashboardBackgroundProcess.
/* ends by karam */

app.get('/notification/all', function (req, res) {});

app.get('/api', function (req, res) {
    res.send('API is running');
});

app.get('/checkNewVersion', function (req, res) {
    updater.checkNewVersion(function(result) {
        res.send(result);
    });
});

app.get('/products/tally/load', function (req, res) {
    productService.reloadProductLists(function(destination, prod){
        res.send(destination);
    }, null);
});

app.get('/updateNewVersion', function (req, res) {
    updater.updateNewVersion();
    res.end();
    process.kill();
});



/** product listing calls urls*/


app.post('/product/publish', function (req, res) {
    productService.createOrUpdateProduct(req.body , function(result){
        res.send(result);
    }, null);  
});

app.post('/product/publish/:channel', function (req, res) {
    var product = {
        channel : req.params.channel,
        product : req.body
    }
    productService.createOrUpdateProduct(product.channel, product.product, productService.createProduct, null);
});

/*appp.post({
    productService.createOrUpdateProd(prod, cb(){
                   productService.createProduct(destinaqtion, prod);                   
         res.s                             
                                      }
}*/

app.post('/product/:id/publish', function (req, res) {
        productService.getProductById(req.params.id, function(prod){
            productService.listProduct(prod,function(cb){
                console.log(cb); 
                console.log(cb);
                res.send(cb);
                res.end();
            });
            
        }, function(){            
                res.send('error');
            res.end();
        });
});

app.post('/product/:id/publish/:channel', function (req, res) {
        productService.getProductById(req.params.id, function(prod){
            productService.listProduct(prod,function(cb){
                console.log(cb); 
                console.log(cb);
                res.send(cb);
                res.end();
            });
            
        }, function(){            
                res.send('error');
            res.end();
        });
});



app.post('/product/:id/sell', function (req, res) {
    productService.getProductById(req.params.id, function(prod){
        productService.updateProduct(prod, function(cb){
            console.log(cb);
            res.send(cb);
            res.end();

        },'null');
    }, function(){            
            res.send('error');
        res.end();
    });
});

app.post('/product/:id/sell/:channel', function (req, res) {
    productService.getProductById(req.params.id, function(prod){
        productService.updateProduct(prod, function(cb){
            console.log(cb);
            res.send(cb);
            res.end();
        },'null');
    }, function(){            
            res.send('error');
        res.end();
    });
});

//Upload Sheet Code
app.post('/showSheetUploadForm', function (req, res) {
    //SendForm to browser
	accountService.storePaymentSheetData(req,res);
	//accountService.insertAcctgTrans();
});

app.get('/viewDataTrans', function (req, res) {
    //use Formidable to parse
    //Get Format
    accountService.tableViewTransResponse(res);
});

app.get('/viewDataTransEntry', function (req, res) {
    //use Formidable to parse
    //Get Format
    accountService.tableViewTransEntryResponse(res);
});






