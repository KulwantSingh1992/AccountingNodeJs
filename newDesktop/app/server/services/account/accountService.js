var productDB = require('../../db/product/productDAO');
var accountDB = require('../../db/account/accountDAO');
var tallyService = require('./tallyAccountService');
var logger = require('../../lib/logger');
var fs=require('fs.extra');
var formidable=require('formidable');
//var csvParser=require('./csvParser');
//var excelParser=require('./excelParser');

exports.getAccountingDetails = function(startDate, endDate, cb, err) {
    productDB.getTallyCredentials(invokeAccountingDetails);
    function invokeAccountingDetails(cred){
        console.log(cred);
        if(cred.URL) tallyService.getAccountingDetails(cred, startDate, endDate, cb, err);
    }
};
//Export Upload File code
function storePaymentSheetData(req,res) {
console.log('in fucntion');
	  var form = new formidable.IncomingForm();
	  form.parse(req, function(err, fields, files) {
		//  excel.excel(util.inspect(files['upload']['path']));
	 	 if(fields['format']=='csv'){
			fs.copy(files['upload']['path'], '../../..TempUploaded/file.csv', { replace: true },
		 		function (err) {
		        		if (err) {
		           			// i.e. file already exists or can't write to directory
						throw err;
				} else {
					csvParser.csvParse('../../..TempUploaded/file.csv');
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
					excelParser.excelParse('../../..TempUploaded/file.xlsx');
                 			fs.remove('../../..TempUploaded/file.xlsx'); //this line should come in each of parsing file .
                   		}
			 });
		}
	});
	res.writeHead(200, {'content-type': 'text/plain'});
	res.write('Received upload:\n\n');
	res.end('kulwanignh');
}

function createFlipkartPaymentSheet() {
	csv
	 .fromStream(stream)
	 .on("data", function(data){
	     db.serialize(function() {
		if(counter > 0) {
			//Check sheet's column count, sequence and name
			//Check if settlementId, date time, type is not empty
			//Check if settlementId exists in PaymentSummary entity
			var existingCount = refAlreadyExists(refId);
		}counter++;
	     });
	 })
	 .on("end", function(){
	     console.log("done");
	 });
}

function createAmazonPaymentSheet() {
	csv
	 .fromStream(stream)
	 .on("data", function(data){
	     db.serialize(function() {
		if(counter > 0) {
			//Check sheet's column count, sequence and name
			//Check if settlementId, date time, type is not empty
			//Check if settlementId exists in PaymentSummary entity
			var existingCount = refAlreadyExists(refId);
		}counter++;
	     });
	 })
	 .on("end", function(){
	     console.log("done");
	 });
}
exports.storePaymentSheetData=storePaymentSheetData;
exports.storeCSVData=storeCSVData;
exports.storexlsxData=storexlsxData;
