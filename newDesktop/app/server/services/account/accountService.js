var productDB = require('../../db/product/productDAO');
var accountDB = require('../../db/account/accountDAO');
var tallyService = require('./tallyAccountService');
var logger = require('../../lib/logger');
var fs=require('fs.extra');
var formidable=require('formidable');
var csvParser=require('./csvParser');
var excelParser=require('./excelParser');

exports.getAccountingDetails = function(startDate, endDate, cb, err) {
    productDB.getTallyCredentials(invokeAccountingDetails);
    function invokeAccountingDetails(cred){
        console.log(cred);
        if(cred.URL) tallyService.getAccountingDetails(cred, startDate, endDate, cb, err);
    }
};
//Export Upload File code
function storePaymentSheetData(req,res) {
      var sheetType;
	  var form = new formidable.IncomingForm();
	  form.parse(req, function(err, fields, files) {
		//  excel.excel(util.inspect(files['upload']['path']));
		  sheetType=fields['sheetType'];
	 	 if(fields['format']=='csv'){
			fs.copy(files['upload']['path'], '../../..TempUploaded/file.csv', { replace: true },
		 		function (err) {
		        		if (err) {
		           			// i.e. file already exists or can't write to directory
						throw err;
				} else {
					csvParser.csvParse('../../..TempUploaded/file.csv',sheetType);
					fs.remove('../../..TempUploaded/file.csv');  //this line should come in each of parsing file .
			          }
	  
			});
	     	} else if(fields['format']=='xlsx'){
			fs.copy(files['upload']['path'], '../../..TempUploaded/file.xlsx', { replace: false },
        		function (err) {
                  		if (err) {
				    // i.e. file already exists or can't write to directory
				        throw err;
				} else {
					excelParser.excelParse('../../..TempUploaded/file.xlsx',sheetType);
                 			fs.remove('../../..TempUploaded/file.xlsx'); //this line should come in each of parsing file .
                   		}
			 });
		}
	});
	res.writeHead(200, {'content-type': 'text/plain'});
	res.write('Received upload:\n\n');
	res.end('kulwanignh');
}

function createFlipkartPaymentSheet(data) {
	
			//Check sheet's column count, sequence and name
			//Check if settlementId, date time, type is not empty
			//Check if settlementId exists in PaymentSummary entity
			var existingCount = accountDB.refAlreadyExists(data[0]);
		     console.log(existingCount);
}

function createAmazonPaymentSheet(data) {
	 
			//Check sheet's column count, sequence and name
			//Check if settlementId, date time, type is not empty
			//Check if settlementId exists in PaymentSummary entity
			var existingCount = accountDB.refAlreadyExists(data[1]);
		     console.log(existingCount);
}
exports.storePaymentSheetData=storePaymentSheetData;
