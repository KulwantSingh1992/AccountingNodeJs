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
	  res.writeHead(200, {'content-type': 'text/plain'});
	  res.write('Received upload:\n\n');
	  res.end('kulwanignh');
		//  excel.excel(util.inspect(files['upload']['path']));
	  
	  if(fields['format']=='csv'){
		fs.copy(files['upload']['path'], '../../..TempUploaded/file.csv', { replace: false },
         		function (err) 
				{
                if (err) {
                   // i.e. file already exists or can't write to directory
						throw err;}
           	    else {
				console.log('csv parser clll');
	                //  csvParser.csvParse('../../..TempUploaded/file.csv');
	                 // fs.remove('../../..TempUploaded/file.csv');  //this line should come in each of parsing file .
	                  }
  
			    });
		//	 
	     }
			
	  else if(fields['format']=='xlsx'){
		fs.copy(files['upload']['path'], '../../..TempUploaded/file.xlsx', { replace: false },
        		function (err) 
				{
                  if (err) {
                    // i.e. file already exists or can't write to directory
                        throw err;}
	             else  
				   {
                      console.log('csv parser clll');				   
				//       excelParser.excelParse('../../..TempUploaded/file.xlsx');
                 //      fs.remove('../../..TempUploaded/file.xlsx'); //this line should come in each of parsing file .
                   }
			 });
		}
			
		
	    });
	

}

function storeCSVData(filePath, response) {
	//Implement FastCSV for Csv parsing
	//Call queries from accountDAO, SAve
}
function storexlsxData(filePath, response) {
	//Implement excel(dependency on visualstudio) for Csv parsing
	//Call queries from accountDAO, SAve
}

exports.storePaymentSheetData=storePaymentSheetData;
exports.storeCSVData=storeCSVData;
exports.storexlsxData=storexlsxData;