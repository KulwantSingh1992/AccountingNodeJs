var productDB = require('../../db/product/productDAO');
var accountDB = require('../../db/account/accountDAO');
var tallyService = require('./tallyAccountService');
var logger = require('../../lib/logger');

exports.getAccountingDetails = function(startDate, endDate, cb, err) {
    productDB.getTallyCredentials(invokeAccountingDetails);
    function invokeAccountingDetails(cred){
        console.log(cred);
        if(cred.URL) tallyService.getAccountingDetails(cred, startDate, endDate, cb, err);
    }
};
//Export Upload File code
exports.storePaymentSheetData = function(filePath, format, response) {
	if(format == "csv") {
		//store CSV data
		storeCSVData(filePath, response)
	} else if(format == "xlsx") {
		//store xlsx data
		storexlsxData(filePath, response)
	}
};

function storeCSVData(filePath, response) {
	//Implement FastCSV for Csv parsing
	//Call queries from accountDAO, SAve
}
function storexlsxData(filePath, response) {
	//Implement excel(dependency on visualstudio) for Csv parsing
	//Call queries from accountDAO, SAve
}
