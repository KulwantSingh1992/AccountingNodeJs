//Insert Query
var dbconfig=require('./../db-config');
db=dbconfig.db;
var insertPaymentSummaryQuery = "INSERT OR REPLACE INTO payment_sheet_summary(settlement_ref_id, order_id, external_id, settlement_date, order_item_id, order_status, sku, description, quantity, invoice_id, marketPlace, order_city, order_state, order_postal, invoice_amount,  shipping_credits, promotional_rebate, sales_tax, selling_fee, fba_fee, other_transaction_fee, other, total, settlement_value, order_item_value, refund, hold, performance_award, protection_fund, total_marketplace_fee, comission_rate, commission_fee, fixed_fee, emi_fee, shipping_fee, reverse_shipping_fee, cancellation_fee, fee_discount, service_tax, dispatch_date, delivery_date, cancellation_date, dispute_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

var insertAcctgTransQuery = "INSERT OR REPLACE INTO acctg_trans(acctg_trans_id, acctg_trans_type_id, description, transaction_date, is_posted,voucher_ref,voucher_date,order_id, inventory_item_id, party_id) VALUES (?,?,?,?,?,?,?,?,?,?)";

var insertAcctgTransEntryQuery = "INSERT OR REPLACE INTO acctg_trans_entry(acctg_trans_id, acctg_trans_entry_seq_id, acctg_trans_entry_type_id,  party_id, role_type_id, gl_account_type_id, gl_account_id,organization_party_id,amount,currency_uom_id,debit_credit_flag,reconcile_status_id,gl_account_class) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";



var refExistsCount = "select * from payment_sheet_summary where settlement_ref_id = ?  and order_status = ? ";

var getDataFromPaymentSummary="select * from payment_sheet_summary";

var glaccountinfo = "select * from gl_account_organisation_and_class where organisation_party_id = ?";

var acctTransViewQuery="select * from acctg_trans";

var acctgTransEntryViewQuery="select * from acctg_trans_entry";

var importAmazonPaymentSheet = exports.importAmazonPaymentSheet = function (record) {
    db.beginTransaction(function (err, transaction) {
	transaction.run(insertPaymentSummaryQuery, [record[1], null,record[3], record[0], null, record[2], record[4], record[5],record[6],null,record[7], record[9],record[10],record[11],record[12], record[13], record[14],record[15],record[16],
		record[17],record[18],record[19],record[20]]);
        transaction.commit(function (err) {
            if (err) {
                console.error(err);
                transaction.rollback();
            }
        });
    });

}

var importFlipkartPaymentSheet = exports.importFlipkartPaymentSheet = function (record) {
    db.beginTransaction(function (err, transaction) {
	transaction.run(insertPaymentSummaryQuery, [record[0], null,record[2], record[1], record[3], record[5], record[6],null, 		record[7],record[8],null,null,null,null,record[10],null,null,null,null,null,null,null,null, record[11],null,record[13],
		record[14],record[15],record[16],record[17],record[18],record[19],record[20],record[21],record[22],record[26],record[27],
		record[28],record[29],record[30],record[31],record[32],record[33]]);
        transaction.commit(function (err) {
            if (err) {
                console.error(err);
                transaction.rollback();
            }
        });
    });

}

function getGlAccountInfo(organisation_party_id,fun){

db.all(glaccountinfo,organisation_party_id,function(err,rows){fun(rows);});

}


function refAlreadyExistsAmazon(data,fun){

db.all(refExistsCount,data[1],data[2],function(err,rows){if(rows.length==0)fun(0);else fun(1);
//fun(count);return ;
}//,function(){fun(count);}
);

}

function refAlreadyExistsFlipkart(data,fun){

db.all(refExistsCount,data[0],data[5],function(err,rows){if(rows.length==0)fun(0);else fun(1);
//fun(count);return ;
}//,function(){fun(count);}
);

}

function insertAcctgTrans(acctg_trans_id, acctg_trans_type_id, description, transaction_date, is_posted,
       voucher_ref, voucher_date, order_id, inventory_item_id, party_id){
db.beginTransaction(function (err, transaction) {
	transaction.run(insertAcctgTransQuery, acctg_trans_id, acctg_trans_type_id, description, transaction_date, is_posted,
    	voucher_ref,voucher_date, order_id, inventory_item_id, party_id);
		transaction.commit(function (err) {
		    if (err) {
			console.error(err);
			transaction.rollback();
		    }
		});
	});
}
function insertAcctgTransEntry(acctg_trans_id,acctg_trans_entry_seq_id,acctg_trans_entry_type_id
    ,party_id,role_type_id,gl_account_type_id,gl_account_id,organization_party_id,amount,
	currency_uom_id,debit_credit_flag,reconcile_status_id,gl_account_class){
	
	db.beginTransaction(function (err, transaction) {
	transaction.run(insertAcctgTransEntryQuery, acctg_trans_id,acctg_trans_entry_seq_id,acctg_trans_entry_type_id,
        party_id,role_type_id,gl_account_type_id,gl_account_id,organization_party_id,amount,currency_uom_id,debit_credit_flag
		,reconcile_status_id,gl_account_class);
		transaction.commit(function (err) {
		    if (err) {
			console.error(err);
			transaction.rollback();
		    }
		});
	});
	//change kall leyo ehde vich
}

function acctTransView(view,fun){

db.all(acctTransViewQuery,function(err,rows){
                              
                               for(var i=0;i<rows.length;i++)
							   {
							 
							   view+='<tr>';
								  view+='<td>'+rows[i]["acctg_trans_id"]+'</td>'
								  view+='<td>'+rows[i]["acctg_trans_type_id"]+'</td>'
								  view+='<td>'+rows[i]["description"]+'</td>'
								  view+='<td>'+rows[i]["transaction_date"]+'</td>'
								  view+='<td>'+rows[i]["voucher_ref"]+'</td>'
								  view+='<td>'+rows[i]["voucher_date"]+'</td>'
								  view+='<td>'+rows[i]["order_id"]+'</td>'
								  view+='</tr>';
								 
							  }
								
							  view+="</table>";
							  fun(view);
                             });

}

function acctTransEntryView(){

db.all(acctgTransEntryViewQuery,function(err,rows){


               });
}

exports.acctTransView=acctTransView;
exports.refAlreadyExistsAmazon=refAlreadyExistsAmazon;
exports.refAlreadyExistsFlipkart=refAlreadyExistsFlipkart;
exports.getGlAccountInfo=getGlAccountInfo;
exports.insertAcctgTrans=insertAcctgTrans;
exports.insertAcctgTransEntry=insertAcctgTransEntry;