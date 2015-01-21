var logger = require('../../lib/logger');
var productService = require('./productService');
var util = require('../util/util');

var completed = true;
var requestXml;
var XMLPath = "./server/templates/tally/stockDetailsRequestFormat.xml";

/* This function returns file content as sting */
var getXmlTemplate = function (templatePath) {
    var fs = require('fs');
    var xmlData = fs.readFileSync(templatePath, 'ascii');
    //logger.debug("File '" + templatePath + "/ was read successfully. \n");
    return xmlData;
}


//exports.reloadProductLists = function (cred, cb, err) {
//    if (completed == 'false') {
//        return;
//    }
//    completed = false;
//    //logger.debug('Loading products from tally ');
//    var filePath = "./server/templates/tally/stockDetailsRequestFormat.xml";
//    if (!requestXml) {
//        requestXml = getXmlTemplate(filePath);
//    }
//     var templateData = {
//        companyName : cred.CompanyName
//    }
//
//
//    var modifiedXml = util.templateEditor(requestXml, templateData);
//    logger.debug("stock details xml with values :"+modifiedXml);
//    
//    var postheaders = {
//        'SOAPAction': null,
//        'Content-Length': requestXml.length,
//        'Content-Type': "text/plain;charset=UTF-8",
//        'Accept': "*/*"
//    };
//    var options = {
//    host: cred.URL.replace("http://", "").replace("https://", "").split(':')[0],
//        port: cred.URL.replace("http://", "").replace("https://", "").split(':')[1],
//        method: 'POST',
//        path: '/',
//        headers: postheaders
//    };
//
//    var buffer = "";
//    logger.debug("Headers : "+JSON.stringify(options));
//    try {
//        var http = require('http');
//        var req = http.request(options, function (res) {
//
//            var buffer = "";
//            res.on('data', function (data) {
//                buffer += data;
//            });
//            res.on('error', function (err) {
//                logger.error(err);
//            });
//            res.on('end', function () {
//               logger.debug("Tally XML response "+buffer);
//                var parseString = require('xml2js').parseString;
//                parseString(buffer, function (err, result) {
//                    var data;
//                    if (result) {
//                       // logger.debug("Tally response JSON :"+JSON.stringify(result));
//                        for (var i in result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM) {
//                            data = {
//                                product_name: result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM[i]["$"].NAME,
//                                product_category: result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM[i]["PARENT"][0]._,
//                                product_tally_id: result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM[i]["MASTERID"][0]._,
//                                product_cost_price: parseFloat(result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM[i]["OPENINGRATE"][0]._),
//                                product_available_quantity: parseInt(result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM[i]["CLOSINGBALANCE"][0]._),
//                                product_mrp: parseFloat(result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM[i]["OPENINGRATE"][0]._)
//                            };
//                            productService.createOrUpdateProduct(data, null, err);
//                        }
//                      //  logger.debug("create or update product form tally, product count: " + result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM.length);
//                    }
//                });
//                completed = true;
//            });
//        });
//        req.on('error', function (err) {
//            logger.error(err);
//            completed = true;
//        });
//        req.end(requestXml, "utf-8");
//
//    } catch (err) {
//        logger.error(err);
//        completed = true;
//    }
//}



exports.reloadProductLists = function (cred, cb, err) {
    if (!requestXml) {
        requestXml = getXmlTemplate(XMLPath);
    }
        
    var tmplData = {
        companyName : cred.CompanyName
    }


    var modifiedXml = util.templateEditor(requestXml, tmplData); // calling getTemplate function inside templateEditor
	//logger.debug("Request Xml" + modifiedXml);


    //creating json object for mustache template value insertion 
    var postheaders = {
        'SOAPAction': null,
        'Content-Length': modifiedXml.length,
        'Content-Type': "text/plain;charset=UTF-8",
        'Accept': "*/*"
    };
    var options = {
        host: cred.URL.replace("http://", "").replace("https://", "").split(':')[0],
        port: cred.URL.replace("http://", "").replace("https://", "").split(':')[1],
        method: 'POST',
        path: '/',
        headers: postheaders
    };
    try {
        var http = require('http');
        var req = http.request(options, function (res) {

            var buffer = "";
            res.on('data', function (data) {
                buffer += data;

            });
            res.on('error', function (err) {
                logger.error(err);
            });
            res.on('end', function () {
                var parseString = require('xml2js').parseString;
               parseString(buffer, function (err, result) {
                    var data;
                    if (result) {
                        for (var i in result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM) {
                            data = {
                                name: result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM[i]["$"].NAME,
                                category: result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM[i]["PARENT"][0]._,
                                TALLY_id: result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM[i]["MASTERID"][0]._,
                                cost_price: parseFloat(result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM[i]["OPENINGRATE"][0]._),
                                available_quantity: parseInt(result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM[i]["CLOSINGBALANCE"][0]._),
                                mrp: parseFloat(result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].STOCKITEM[i]["OPENINGRATE"][0]._)
                            };
                            productService.createOrUpdateProduct('TALLY',data, cb, err);
                        }

                    }
                });
            });
        });
        req.on('error', function (err) {
            logger.error('Error getting data from tally ' + err);
        });
        req.end(modifiedXml, "utf-8");
    } catch (err) {
        logger.error(err);
    }
}



exports.getProducts = function (cb, err) {};

exports.createProduct = function (prod, cb, err) {}

exports.updateProduct = function (prod, cb, err) {}


exports.createOrUpdateProduct = function (prod, cb, err) {}


exports.deleteProduct = function (prodid, cb, err) {}

exports.getProductById = function (id, cb, err) {}

exports.exists = function (existid, cb, err) {}