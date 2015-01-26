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
			fs.copy(files['upload']['path'], '../../../TempUploaded/file.csv', { replace: false },
		 		function (err) {
		        		if (err) {
		           			// i.e. file already exists or can't write to directory
						throw err;
				} else {
					csvParser.csvParse('../../../TempUploaded/file.csv',sheetType,res);
					fs.remove('../../../TempUploaded/file.csv');  //this line should come in each of parsing file .
			          }
	  
			});
	     	} else if(fields['format']=='xlsx'){
			fs.copy(files['upload']['path'], '../../../TempUploaded/file.xlsx', { replace: false },
        		function (err) {
                  		if (err) {
				    // i.e. file already exists or can't write to directory
				        throw err;
				} else {
					        excelParser.excelParse('../../../TempUploaded/file.xlsx',sheetType,res);
                 			fs.remove('../../../TempUploaded/file.xlsx'); //this line should come in each of parsing file .
                   		}
			 });
		}
	});

}

function createFlipkartPaymentSheet(data) {
	
			//Check sheet's column count, sequence and name
			//Check if settlementId, date time, type is not empty
			//Check if settlementId exists in PaymentSummary entity
			accountDB.refAlreadyExistsFlipkart(data,function(count){if(count==0){
			accountDB.importFlipkartPaymentSheet(data);
			}});
		     
}

function createAmazonPaymentSheet(data) {
	 
			//Check sheet's column count, sequence and name
			//Check if settlementId, date time, type is not empty
			//Check if settlementId exists in PaymentSummary entity
			 accountDB.refAlreadyExistsAmazon(data,function(count){if(count==0){
			 accountDB.importAmazonPaymentSheet(data);
			 }});
		    
}

function insertAcctgTrans(acctg_trans_id, acctg_trans_type_id, description, transaction_date, is_posted,  voucher_ref, voucher_date, order_id, 	inventory_item_id, party_id){
      accountDB.insertAcctgTrans(acctg_trans_id, acctg_trans_type_id, description, transaction_date, is_posted,  voucher_ref, voucher_date, order_id, inventory_item_id, party_id);
}

function insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_seq_id, acctg_trans_entry_type_id,party_id, role_type_id, gl_account_type_id , gl_account_id, organization_party_id, amount, currency_uom_idT, debit_credit_flag, reconcile_status_id, gl_account_class){
      accountDB.insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_seq_id, acctg_trans_entry_type_id,party_id, role_type_id, gl_account_type_id , gl_account_id, organization_party_id, amount, currency_uom_idT, debit_credit_flag, reconcile_status_id, gl_account_class);
}
exports.storePaymentSheetData=storePaymentSheetData;
exports.createAmazonPaymentSheet=createAmazonPaymentSheet;
exports.createFlipkartPaymentSheet=createFlipkartPaymentSheet;
exports.insertAcctgTrans=insertAcctgTrans;
