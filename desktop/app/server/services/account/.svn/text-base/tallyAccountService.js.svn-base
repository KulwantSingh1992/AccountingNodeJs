var logger = require('../../lib/logger');
var util = require('../util/util');

var XMLPath = "./server/templates/tally/ratioAnalysisRequestFormat.xml";
var requestXml;
/**This function returns object with ratio analysis annual details*/
exports.getAccountingDetails = function (cred, startDate, endDate, cb, err) {
    logger.debug('Loading Accounting information from tally');

    var localStartDate = '';
    var localEndDate = '';

    if (!requestXml) {
        requestXml = getXmlTemplate(XMLPath);
    }
    if (startDate) {
        localStartDate = startDate.getDate() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getFullYear();
    }

    if (endDate) {
        localEndDate = startDate.getDate() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getFullYear();
    }

    var dateData = {
        companyName : cred.CompanyName,
        startDate: localStartDate,
        endDate: localEndDate
    }


    var modifiedXml = util.templateEditor(requestXml, dateData); // calling getTemplate function inside templateEditor


    //creating json object for mustache template value insertion 
    var postheaders = {
        'SOAPAction': null,
        'Content-Length': modifiedXml.length,
        'Content-Type': "text/plain;charset=UTF-8",
        'Accept': "*/*"
    };;
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
            var ratioObject;
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
                    if (err) {
                        logger.error('Parsing error ' + err);
                        cb(null);
                    }else if(result.ENVELOPE.BODY){
						logger.error("CRITICAL : Invalid Tally settings. Error  : "+result.ENVELOPE.BODY[0].DATA[0].LINEERROR);
						var errorObject = {
								STATUS : 'ERROR',
								MSG : 'Invalid Tally settings, caused by : '+result.ENVELOPE.BODY[0].DATA[0].LINEERROR
							}
						cb (errorObject);
					}else {
                        //logger.debug("tally response json : "+JSON.stringify(result));    
                        var j;
                        ratioObject = {};

                        if (result) {
                            //logger.debug("Tally Response :"+JSON.stringify(result));
                            for (j = 0; j <= result.ENVELOPE.RATIONAME.length; j++) {
                                var key = result.ENVELOPE.RATIONAME[j];
                                if (key) {
									var data = result.ENVELOPE.RATIOVALUE[j];
									if (data) {
										data = data.replace(/,/g, '');
										try {
											data = parseFloat(data).toFixed(2);
										} catch (err) {
											logger.error('Invalid data');
										}
									}else{
										data= "0.00";	
									}
									//logger.debug("key : "+key+"Data : " +data);
									if (key == 'Bank Accounts') {
										ratioObject['cib'] = data;
									}
									if (key == 'Sundry Debtors') {
										ratioObject['receivable'] = data;
									}
									if (key == 'Sundry Creditors') {
										ratioObject['payable'] = data;
									}
									if (key == 'Stock-in-hand') {
										ratioObject['inventoryValue'] = data;
									}
									if (key == 'Sales Accounts') {
										ratioObject['revenue'] = data;
									}
									if (key == 'Nett Profit') {
										ratioObject['profit'] = data;
									}
									if (key == 'Nett Profit %') {
										ratioObject['percentProfit'] = data;
									}

                            	}
							}
                            cb(ratioObject);
                        }else{
							logger.error("Data no recieved from tally, possible cause Tally server not running");
							var errorObject = {
								STATUS : 'ERROR',
								MSG : 'Data not recieved from tally, possible cause Tally server not running'
							}
							cb (errorObject);
						}
                    }
                });
            });
        });
        req.on('error', function (err) {
			var errorObject = {
								STATUS : 'ERROR',
								MSG : 'Data not recieved from tally, Caused by invalid Tally URL '+err
							}
			cb(errorObject);
            logger.error('Error getting data from tally ' + err);
        });
        req.end(modifiedXml, "utf-8");
    } catch (err) {
        logger.error(err);
    }
}

/*This function returns file content as sting*/
var getXmlTemplate = function (templatePath) {
    var fs = require('fs');
    var xmlData = fs.readFileSync(templatePath, 'ascii');
    return xmlData;
}

