//Insert Query
var insertPaymentSummaryQuery = "INSERT OR REPLACE INTO payment_sheet_summary(settlement_ref_id, order_id, external_id, settlement_date, order_item_id, order_status, sku, description, quantity, invoice_id, marketPlace, order_city, order_state, order_postal, invoice_amount,  shipping_credits, promotional_rebate, sales_tax, selling_fee, fba_fee, other_transaction_fee, other, total, settlement_value, order_item_value, refund, hold, performance_award, protection_fund, total_marketplace_fee, comission_rate, commission_fee, fixed_fee, emi_fee, shipping_fee, reverse_shipping_fee, cancellation_fee, fee_discount, service_tax, dispatch_date, delivery_date, cancellation_date, dispute_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

var insertAcctgTransQuery = "INSERT OR REPLACE INTO acctg_trans(acctg_trans_id, acctg_trans_type_id, description, transaction_date, is_posted,voucher_ref,voucher_date,order_id, inventory_item_id, party_id) VALUES (?,?,?,?,?,?,?,?,?,?)";

var insertAcctgTransEntryQuery = "INSERT OR REPLACE INTO acctg_trans_entry(acctg_trans_id, acctg_trans_entry_seq_id, acctg_trans_entry_type_id, voucher_ref, party_id, role_type_id, gl_account_type_id, gl_account_id,organization_party_id,amount,currency_uom_id,debit_credit_flag,reconcile_status_id,gl_account_class) VALUES (?,?,?,?,?,?,?,?)";

var refExistsCount = "select COUNT(*) as alreadyExist, from payment_sheet_summary where SETTLEMENT_REF_ID = ?";

var importAmazonPaymentSheet = exports.importAmazonPaymentSheet = function (record) {
    db.beginTransaction(function (err, transaction) {
	transaction.run(insertPaymentSummaryQuery, [record[1], null,record[3], record[0], null, record[2], record[4], record[5], 			record[6],null,record[7], record[9],record[10],record[11],record[12], record[13], record[14],record[15],record[16],
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
		record[28],record[29],record[30],record[31],record[32],record[33],record[34]]);
        transaction.commit(function (err) {
            if (err) {
                console.error(err);
                transaction.rollback();
            }
        });
    });

}

var refAlreadyExists = exports.refAlreadyExists = function (refId) {
	db.all(refExistsCount, refId);
}

