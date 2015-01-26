
var fs=require('fs');
var csv = require("fast-csv");
var accountService=require('./accountService');
var fs=require('fs.extra');

function csvParse(file, sheetType,res){
	var stream = fs.createReadStream(file);
	var csvStream;
	var count=0;
	var validated=false;
	if(sheetType == "amazon") {
		csvStream = csv.parse()
		    .on("data", function(data){
			if(count<8){
			if(count==7){
			if(data.length==21){ if(false&&!sequenceCheck(data,sheetType)){resss(res,'csv sheet seqence problem');count++;return;}
			else {validated=true;resss(res,'all done');}
			}
			else {resss(res,'csv sheet row count not correct');count++;return;}
			}
			
			count++;}
			else //console.log(data);
			{
			  if(validated)	{		
				var bankAmount = Number(data[12]) - (Number(data[16]) + Number(data[18]) + Number(data[19])) + Number(data[15]);
				var debitCreditFlag;
				if(bankAmount >= 0) {
					debitCreditFlag = "D";
				} else {
					debitCreditFlag = "C";
				}				
				if(data[0]!=''&&data[1]!=''&&data[2]!='')
			  	accountService.createAmazonPaymentSheet(data);
				
			  	//Get data from GlAccount entity
			  	accountService.insertAcctgTrans("ACTG_001","PAYMENT_ACCTG_TRANS","Payment", Date.now(),"Y",data[1],data[0],
				,data[3],null, null);
								
				//1st entry
					accountService.insertAcctgTransEntry("ACTG_001","ACTG_ENTRY_001","_NA_",data[1],null,null,"BANK_STLMNT_ACCOUNT",
      				"BANK_001","PAXCOM",bankAmount,"INR", debitCreditFlag, "AES_NOT_RECONCILED", "ASSET");
				//2nd entry
				if(Number(data[16]) >0) {
				accountService.insertAcctgTransEntry("ACTG_002", "ACTG_ENTRY_002", "_NA_",data[1],null,"SERVICE_TAX_AUTH", "TAX_ACCOUNT",
				   "BANK_001","PAXCOM",bankAmount,"INR", "D", "AES_NOT_RECONCILED", "ASSET");
				}
				//3rd entry
				if(Number(data[])>0){
				accountService.insertAcctgTransEntry("ACTG_003", "ACTG_ENTRY_003", "_NA_",data[1],null,"CNCL_AGENT", "CANCELLATION_EXPENSE", 
				  "BANK_001","PAXCOM",bankAmount,"INR", "D", "AES_NOT_RECONCILED", "ASSET");
					
				}
				
				if(Number(data[14]) > 0) {
				accountService.insertAcctgTransEntry("ACTG_004", "ACTG_ENTRY_004", "_NA_",data[1],"carrierPartyId","CARRIER", "SHIPPING_EXPENSE", 
				  "BANK_001","PAXCOM",bankAmount,"INR", "D", "AES_NOT_RECONCILED", "ASSET");
				}
				
				if(Number(data[])>0){
				accountService.insertAcctgTransEntry("ACTG_005", "ACTG_ENTRY_005", "_NA_",data[1],null,"COMSN_AGENT", "COMMISSION_EXPENSE", 
				  "BANK_001","PAXCOM",bankAmount,"INR", "D", "AES_NOT_RECONCILED", "ASSET");
				
				}
				
			 }
			  else ;//reponse for if one of entity is not present;
			  
			 }
			//Check Column's name and length 
			//Call queries from accountDAO, SAve
		    
//console.log(data.length);
})
		    .on("end", function(){
			//fs.remove('../../../TempUploaded/file.csv');
		    });
	} else if (sheetType == "flipkart") {
		csvStream = csv.parse()
		    .on("data", function(data){
			
			 //queries.queryInsert(db,data,'csv');
            if(count==0){
			//console.log(data);
			if(data.length==39){ if(false&&!sequenceCheck(data,sheetType)){resss(res,'csv sheetseqence problem not correct');count++;return;}
			else {validated=true;resss(res,'all done');}
			}
			else {resss(res,'csv sheet row count not correct');return;}
			count++;}
			else {
            if(validated){	
			
			if(data[0]!=''&&data[4]!=''&&data[5]!='')
			accountService.createFlipkartPaymentSheet(data);
			else ;
			
			}
			else ;
			}
			//Check Column's name and length
			//Call queries from accountDAO, SAve
		    })
		    .on("end", function(){
			 //fs.remove('../../../TempUploaded/file.csv');
		    });
	}
	stream.pipe(csvStream); // Need to be tested if required
}

function resss(res,code){
	res.writeHead(200, {'content-type': 'text/plain'});
	res.write(code);
	res.end('kulwanignh');
}

function sequenceCheck(data,sheetType){

if(sheetType=='amazon'){
if(data[0]=='date/time'&&data[1]=='settlement id'&&data[2]=='type'&&data[3]=='order id'&&
   data[4]=='sku'&&data[5]=='description'&&data[6]=='quantity'&&data[7]=='marketplace'&&data[8]=='fulfillment'
   &&data[9]=='order city'&&data[10]=='order state'
   &&data[11]=='order postal'&&data[12]=='product sales'&&data[13]=='shipping credits'&&data[14]=='promotional rebates'
   &&data[15]=='sales tax collected'&&data[16]=='selling fees'&&data[17]=='fba fees'
   &&data[18]=='other transaction fees'&&data[19]=='other'&&data[20]=='total'   )
   return true;
   else false;}
else if(sheetType='flipkart'){
if(data[0]=='Settlement Ref No.'&&data[1]=='Settlement Date'&&data[2]=='Order ID/FSN'&&data[3]=='Order Item ID'&&
   data[4]=='Order Date'&&data[5]=='Order Status'&&data[6]=='Seller SKU'&&data[7]=='Quantity'&&data[8]=='Invoice ID (Invoice to Buyer)'
   &&data[9]=='Invoice Date (Invoice to Buyer)'&&data[10]=='Invoice Amount (Invoice to Buyer)'
   &&data[11]=='Settlement Value (Rs.)'&&data[12]=='Order Item Value (Rs.)'&&data[13]=='Refund (Rs.)'&&data[14]=='Hold (Rs.)'
   &&data[15]=='Performance Reward (Rs.)'
   &&data[16]=='Protection Fund (Rs.)'&&data[17]=='Total Marketplace Fee (Rs.)'&&data[18]=='Sub Category'&&data[19]=='Commission Rate'&&data[20]=='Commission (Rs.)'
   &&data[21]=='Fixed Fee (Rs.)'&&data[22]=='EMI Fee (Rs.)'&&data[23]=='Total Weight/Slab'&&data[24]=='Shipping Zone'
   &&data[25]=='Shipping Fee(per 500 gms)'&&data[26]=='Shipping Fee (Rs.)'
   &&data[27]=='Reverse Shipping Fee(per 500 gms)'&&data[28]=='Reverse Shipping Fee (Rs.)'&&data[29]=='Cancellation Fee (Rs.)'&&data[30]=='Fee Discount (Rs.)'&&data[31]=='Service Tax (Rs.)'&&data[32]=='Dispatch Date'&&data[33]=='Delivery Date'&&data[34]=='Cancellation Date'
   &&data[35]=='Dispute Date'&&data[36]=='Total Offer Amount'&&data[37]=='My Offer Share'&&data[38]=='Flipkart Offer Share'  )
   return true;
   else false;
}

}

exports.csvParse=csvParse;
