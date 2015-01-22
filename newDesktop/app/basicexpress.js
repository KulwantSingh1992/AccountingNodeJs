var express = require('express')
var app = express();
path = require("path");
var logger = require('./server/lib/logger');   //kulwant singh put this line here

process.on('uncaughtException', function(err) {
  logger.debug(err);
    if (err.stack){
        logger.debug(err.stack);
    }
});

app.configure(function () {
    //app.set('port', process.env.PORT || 3000);
	app.listen(3000);
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, '.')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

var amazonOrderService = require('./server/services/order/amazonOrderService');
var analyticsEngine = require('./server/analytics/analyticsengine');
var flipkartOrderService = require('./server/services/order/flipkartOrderService');
var flipkartProductService = require('./server/services/product/flipkartProductService');
var orderService = require('./server/services/order/orderService');
var paytmOrderService = require('./server/services/order/paytmOrderService');
var paytmProductService = require('./server/services/product/paytmProductService');
var productService = require('./server/services/product/productService');
var dashboardService = require('./server/services/dashboardService');
var accountService = require('./server/services/account/accountService');
var bkg = require('./server/processes/dashboardBackgroundProcess');

var util = require('./server/services/util/util');
var configService = require('./server/services/config/configService');
//var updater = require('./server/updater');



app.post('/showSheetUploadForm',function(req,res){
console.log('kulwsnigji');
res.send('kuwlantsingh');
})


