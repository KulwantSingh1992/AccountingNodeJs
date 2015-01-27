var productDB = require('../../db/product/productDAO');
var accountDB = require('../../db/account/accountDAO');
var tallyService = require('./tallyAccountService');
var logger = require('../../lib/logger');
var fs=require('fs.extra');
var formidable=require('formidable');
var csvParser=require('./csvParser');
var excelParser=require('./excelParser');
var HasMap=require('hashmap').HashMap;
var uuid = require('node-uuid');

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
				    console.log('hanji');
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

function createPaymentTransactions(orderMap) {
	console.log("=======orderMap====="+orderMap);
	orderMap.forEach(function(orderInfoMap, key) {
	
	
	//get gl account
	String bankStmGlAccountId = null;
	String txaccountGlAccountId=null;
	String cmexpGlAccountId=null;
	String shpexpGlAccountId=null;
	String cnexpGlAccountId=null;
	String bankGlAccountName = null;
	String accrcblGlAccountName=null;
	String serviceTaxGlAccountId = null;
	var rows=accountDB.getGlAccountInfo(orderInfoMap.get("salesRepPartyId"));
	for(var row : rows) {
		if(row["glAccountTypeId"] == "BANK_STLMNT_ACCOUNT") {
			bankStmGlAccountId = row["glAccountId"];
		}
		else if(row["glAccountTypeId"]=="TAX_ACCOUNT"){
		    txaccountGlAccountId=row["glAccountId"];
		}
		else if(row["glAccountTypeId"]=="COMISSION_EXPENSE"){
		    cmexpGlAccountId=row["glAccountId"];
		}
		else if(row["glAccountTypeId"]=="ACCOUNT_RECEIVABLE"){
		   accrcblGlAccountName=row["glAccountId"];
		}
		else if(row["glAccountId"]=="CANCELLATION_EXPENSE"){
		   cnexpGlAccountId=row["glAccountId"];
		}
		else if(row["glAccountId"]=="SHIPPING_EXPENSE"){
		   shpexpGlAccountId=row["glAccountId"];
		}
	}
	
	//
	var orderStatus=orderInfoMap.get("orderStatus").toString();
	console.log("======orderStatus======"+orderStatus);
	if(((orderStatus.indexOf("delivered") != -1) || (orderStatus.indexOf("shipped") != -1) || (orderStatus.indexOf("confirmed")!=-1) || 
	   (orderStatus.indexOf("dispute_resolved")!=-1) || (orderStatus.indexOf("Shipping Services")!=-1) || (orderStatus.indexOf("Order")!=-1)) && Number(orderInfoMap.get("totalMarketPlaceFee")) > 0) {
		var bankAmount = Number(orderInfoMap.get("invoiceAmount")) - Number(orderInfoMap.get("totalMarketPlaceFee"));
		var debitCreditFlag;
		if(bankAmount >= 0) {
			debitCreditFlag = "D";
		} else {
			debitCreditFlag = "C";
		}				
		//Get data from GlAccount entity
		  var acctg_trans_id = uuid.v4();
		  insertAcctgTrans(acctg_trans_id,"PAYMENT_ACCTG_TRANS","Payment", Date.now(),"Y",orderInfoMap.get("settlementRefNo"),
			 orderInfoMap.get("settlementDate"), orderInfoMap.get("externalOrderId"),null, null);
		//1st entry
			var acctg_trans_entry_id = uuid.v4();
			insertAcctgTransEntry(acctg_trans_id,acctg_trans_entry_id,"_NA_",orderInfoMap.get("settlementDate"),null,null,
			"BANK_STLMNT_ACCOUNT",bankStmGlAccountId,"PAXCOM",bankAmount,"INR", debitCreditFlag, "AES_NOT_RECONCILED", "ASSET");
		//2nd entry
		if(orderInfoMap.get("serviceTax") != null) {
			acctg_trans_entry_id = uuid.v4();
			insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_",orderInfoMap.get("settlementDate"),null,"SERVICE_TAX_AUTH",
			"TAX_ACCOUNT", txaccountGlAccountId,"PAXCOM",Number(orderInfoMap.get("serviceTax")),"INR", "D", "AES_NOT_RECONCILED", "ASSET");
		}
		//3rd entry
		if(orderInfoMap.get("cancellationFee") != null){
			acctg_trans_entry_id = uuid.v4();
			insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_",orderInfoMap.get("settlementDate"),null,"CNCL_AGENT",
			"CANCELLATION_EXPENSE", cnexpGlAccountId,"PAXCOM",Number(orderInfoMap.get("cancellationFee")),"INR", "D", "AES_NOT_RECONCILED", "ASSET");
		}
		//4rth entry
		if(orderInfoMap.get("shippingCharges") != null) {
			acctg_trans_entry_id = uuid.v4();
			insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_",orderInfoMap.get("settlementDate"),"carrierPartyId","CARRIER",
			 "SHIPPING_EXPENSE", shpexpGlAccountId,"PAXCOM",Number(orderInfoMap.get("shippingCharges")),"INR", "D", "AES_NOT_RECONCILED", 				"ASSET");
		}
		//5th entry
		if(orderInfoMap.get("commissionFee") != null){
			acctg_trans_entry_id = uuid.v4();
			insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_",orderInfoMap.get("settlementDate"),null,"COMSN_AGENT",
			"COMMISSION_EXPENSE", cmexpGlAccountId,"PAXCOM",Number(orderInfoMap.get("commissionFee")),
			"INR", "D", "AES_NOT_RECONCILED", "ASSET");
		}
		
		//6th entry
		// if(orderInfoMap["commissionFee"] != null){
			// acctg_trans_entry_id = uuid.v4();
			// insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_",orderInfoMap.get("settlementDate"), 
			// orderInfoMap.get("salesRepPartyId"),"SALES_REP", "ACCOUNTS_RECEIVABLE", "BANK_001","PAXCOM",
			// Number(orderInfoMap.get("invoiceAmount")),"INR", "C", "AES_NOT_RECONCILED", "ASSET");
		// }
		
		//2nd Transaction
		acctg_trans_id = uuid.v4();
		insertAcctgTrans(acctg_trans_id,"PAYMENT_ACCTG_TRANS","Payment", Date.now(),"Y",orderInfoMap["settlementRefNo"],
		orderInfoMap["settlementDate"], orderInfoMap["externalOrderId"],null, null, "BILL_TO_CUSTOMER");
		//1st entry
		acctg_trans_entry_id = uuid.v4();
		insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_",orderInfoMap.get("settlementDate"), orderInfoMap
			.get("salesRepPartyId"),"SALES_REP", "ACCOUNTS_RECEIVABLE", accrcblGlAccountName,"PAXCOM",Number(orderInfoMap.get("invoiceAmount")),"INR", 
			"D", "AES_NOT_RECONCILED", "ASSET");
		//2nd entry
		acctg_trans_entry_id = uuid.v4();
		insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_",orderInfoMap.get("settlementDate"), "custPartyId",
			"CUSTOMER",    "ACCOUNTS_RECEIVABLE", accrcblGlAccountName,"PAXCOM",Number(orderInfoMap.get("invoiceAmount")),"INR", "C", "AES_NOT_RECONCILED",    "ASSET");
		   //Add code to settle/unsettle transactions(Currently all are posted)
	} else if(orderStatus.indexOf( "cancelled")!=-1  && Number(orderInfoMap.get("totalMarketPlaceFee")) > 0) {
		//Get data from GlAccount entity
		//1st Transaction
		acctg_trans_id = uuid.v4();
		acctg_trans_entry_id = uuid.v4();
		insertAcctgTrans(acctg_trans_id ,"PAYMENT_ACCTG_TRANS","Payment", Date.now(),"Y",orderInfoMap.get("settlementRefNo"), 
			orderInfoMap.get("settlementDate"), orderInfoMap.get("externalOrderId"),null, null, "BILL_TO_CUSTOMER");
		 //1st entry
		insertAcctgTransEntry(acctg_trans_id,acctg_trans_entry_id,"_NA_",null,null,"BANK_STLMNT_ACCOUNT",
		   bankStmGlAccountId,"PAXCOM",bankAmount,"INR", "C", "AES_NOT_RECONCILED", "ASSET");
		  //2nd entry
		  if(orderInfoMap.get("serviceTax") != null) {
		  acctg_trans_entry_id = uuid.v4();
		
		   insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_",null,"SERVICE_TAX_AUTH",
		   "TAX_ACCOUNT", txaccountGlAccountId,"PAXCOM",Number(orderInfoMap.get("serviceTax")),"INR", "D", "AES_NOT_RECONCILED", "ASSET");
		  }
		  //3rd entry
		  if(orderInfoMap.get("commissionFee") != null){
		   acctg_trans_entry_id = uuid.v4();
		
		   insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_",null,"COMSN_AGENT",
		   "COMMISSION_EXPENSE", cmexpGlAccountId,"PAXCOM",Number(orderInfoMap.get("commissionFee")),"INR", "D", "AES_NOT_RECONCILED",     "ASSET");
		  }
		  //4rth entry
		  if(orderInfoMap.get("cancellationFee") != null){
		  acctg_trans_entry_id = uuid.v4();
		  insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_",null,"CNCL_AGENT",
		   "CANCELLATION_EXPENSE", cnexpGlAccountId,"PAXCOM",Number(orderInfoMap.get("cancellationFee")),"INR", "D", "AES_NOT_RECONCILED",     "ASSET");
		  }
	 } else if(orderStatus.indexOf( "Refund")!=-1) {
	  //Get returnId
	  //1st Transaction
	  acctg_trans_id = uuid.v4();
		acctg_trans_entry_id = uuid.v4();
		
		insertAcctgTrans(acctg_trans_id,acctg_trans_entry_id,"Payment", Date.now(),"Y",orderInfoMap.get("settlementRefNo"), 
			orderInfoMap.get("settlementDate"), orderInfoMap.get("externalOrderId"),null, null, "BILL_TO_CUSTOMER");
	  //1st entry
	  acctg_trans_entry_id = uuid.v4();
		
	  insertAcctgTransEntry(acctg_trans_id,acctg_trans_entry_id, "_NA_", orderInfoMap.get("salesRepPartyId"),
	  "SALES_REP", "ACCOUNTS_RECEIVABLE", accrcblGlAccountName,"PAXCOM",Number(orderInfoMap.get("invoiceAmount")),"INR", "D", "AES_NOT_RECONCILED", "ASSET");
	  //2nd entry
	  acctg_trans_entry_id = uuid.v4();
		
	  insertAcctgTransEntry(acctg_trans_id,acctg_trans_entry_id,"_NA_",null,null,"BANK_STLMNT_ACCOUNT",
	   bankStmGlAccountId,"PAXCOM",bankAmount,"INR", "C", "AES_NOT_RECONCILED", "ASSET");
	  //3rd entry
	  acctg_trans_entry_id = uuid.v4();
		
	  if(orderInfoMap.get("serviceTax") != null) {
	   insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_",null,"SERVICE_TAX_AUTH",
	   "TAX_ACCOUNT", txaccountGlAccountId,"PAXCOM",Number(orderInfoMap.get("serviceTax")),"INR", "D", "AES_NOT_RECONCILED", "ASSET");
	  }
	  //4rth entry
	  acctg_trans_entry_id = uuid.v4();
		
	  if(orderInfoMap.get("shippingCharges") != null) {
	   insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_",
			"carrierPartyId","CARRIER",     "SHIPPING_EXPENSE", shpexpGlAccountId,"PAXCOM",Number(orderInfoMap.get("shippingCharges")),
			  "INR", "D", "AES_NOT_RECONCILED",     "ASSET");
	  }
	  //5th entry
	    acctg_trans_entry_id = uuid.v4();
	
	  if(orderInfoMap.get("commissionFee") != null){
	   insertAcctgTransEntry(acctg_trans_id,acctg_trans_entry_id , "_NA_",null,"COMSN_AGENT",
	   "COMMISSION_EXPENSE", cmexpGlAccountId,"PAXCOM",Number(orderInfoMap.get("commissionFee")),"INR", "D", "AES_NOT_RECONCILED",     "ASSET");
	  }
	  //2nd Transaction
	   acctg_trans_id = uuid.v4();
		acctg_trans_entry_id = uuid.v4();
	
	  insertAcctgTrans(acctg_trans_id,acctg_trans_entry_id,"Payment", Date.now(),"Y",
		orderInfoMap.get("settlementRefNo"),    orderInfoMap.get("settlementDate"), orderInfoMap.get("externalOrderId"),null, null,
		"BILL_TO_CUSTOMER");
	  //1st entry
	  acctg_trans_entry_id = uuid.v4();
	
	  insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_", "custPartyId","CUSTOMER",
		"ACCOUNTS_RECEIVABLE", accrcblGlAccountName,"PAXCOM",Number(orderInfoMap.get("invoiceAmount")),"INR", "D", "AES_NOT_RECONCILED",    "ASSET");
	  //2nd entry
	  acctg_trans_entry_id = uuid.v4();
	
	  insertAcctgTransEntry(acctg_trans_id, acctg_trans_entry_id, "_NA_",orderInfoMap.get("settlementRefNo"), orderInfoMap.get("salesRepPartyId")
		,"SALES_REP", "ACCOUNTS_RECEIVABLE", accrcblGlAccountName,"PAXCOM",Number(orderInfoMap.get("invoiceAmount")),
		 "INR", "C", "AES_NOT_RECONCILED", "ASSET");
	 }
	 //Put transactionId in OrderHeader
	 //Mark transactions settle/unsettle
	});
}
exports.storePaymentSheetData=storePaymentSheetData;
exports.createAmazonPaymentSheet=createAmazonPaymentSheet;
exports.createFlipkartPaymentSheet=createFlipkartPaymentSheet;
exports.insertAcctgTrans=insertAcctgTrans;
exports.createPaymentTransactions=createPaymentTransactions;