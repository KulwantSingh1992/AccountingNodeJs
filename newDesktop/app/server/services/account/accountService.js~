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

function createPaymentTransactions(orderInfoMap) {
	var bankAmount = Number(orderInfoMap["invoiceAmount"] - (Number(orderInfoMap["totalMarketPlaceFee"]);
	var debitCreditFlag;
	if(bankAmount >= 0) {
		debitCreditFlag = "D";
	} else {
		debitCreditFlag = "C";
	}				
	if(data[0]!=''&&data[1]!=''&&data[2]!='') {
		accountService.createAmazonPaymentSheet(data);
	}
  	//Get data from GlAccount entity
  	accountService.insertAcctgTrans("ACTG_001","PAYMENT_ACCTG_TRANS","Payment", Date.now(),"Y",orderInfoMap["settlementRefNo"], 			orderInfoMap["settlementDate"], orderInfoMap["externalOrderId"],null, null);
	//1st entry
	accountService.insertAcctgTransEntry("ACTG_001","ACTG_ENTRY_001","_NA_",data[1],null,null,"BANK_STLMNT_ACCOUNT",
		"BANK_001","PAXCOM",bankAmount,"INR", debitCreditFlag, "AES_NOT_RECONCILED", "ASSET");
	//2nd entry
	if(orderInfoMap["serviceTax"] != null) {
		accountService.insertAcctgTransEntry("ACTG_002", "ACTG_ENTRY_002", "_NA_",data[1],null,"SERVICE_TAX_AUTH",
		"TAX_ACCOUNT", "BANK_001","PAXCOM",Number(orderInfoMap["serviceTax"]),"INR", "D", "AES_NOT_RECONCILED", "ASSET");
	}
	//3rd entry
	if(orderInfoMap["cancellationFee"] != null){
		accountService.insertAcctgTransEntry("ACTG_003", "ACTG_ENTRY_003", "_NA_",data[1],null,"CNCL_AGENT",
		"CANCELLATION_EXPENSE", "BANK_001","PAXCOM",Number(orderInfoMap["cancellationFee"]),"INR", "D", "AES_NOT_RECONCILED", "ASSET");
	}
	if(orderInfoMap["shippingCharges"] != null) {
		accountService.insertAcctgTransEntry("ACTG_004", "ACTG_ENTRY_004", "_NA_",data[1],"carrierPartyId","CARRIER", 				"SHIPPING_EXPENSE", "BANK_001","PAXCOM",Number(orderInfoMap["shippingCharges"),"INR", "D", "AES_NOT_RECONCILED", 				"ASSET");
	}
	if(orderInfoMap["commissionFee"] != null){
		accountService.insertAcctgTransEntry("ACTG_005", "ACTG_ENTRY_005", "_NA_",data[1],null,"COMSN_AGENT",
		"COMMISSION_EXPENSE", "BANK_001","PAXCOM",Number(orderInfoMap["commissionFee"]),"INR", "D", "AES_NOT_RECONCILED", "ASSET");
	}
}
exports.storePaymentSheetData=storePaymentSheetData;
exports.createAmazonPaymentSheet=createAmazonPaymentSheet;
exports.createFlipkartPaymentSheet=createFlipkartPaymentSheet;
exports.insertAcctgTrans=insertAcctgTrans;
