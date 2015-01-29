var fs = require("fs"),
    sqlite3 = require('sqlite3').verbose(),
    TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
var accountDao = require('./account/accountDAO');
if(/^lin/.test(process.platform)){
dbFolder ="/tmp/Paxcom",
dbFile = dbFolder + "/paxcom.db";}
else if(/^win/.test(process.platform)){
dbFolder = process.env.APPDATA + "\\Paxcom",
dbFile = dbFolder + "\\paxcom.db";}
exists = fs.existsSync(dbFolder);


if (!exists) {
    console.log("Creating DB folder " + dbFolder);
    fs.mkdir(dbFolder);
    fs.openSync(dbFile, "w");
}

var db = exports.db = new TransactionDatabase(new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE));

populateDatabase(db);

function populateDatabase(db) {
    db.run('CREATE TABLE IF NOT EXISTS orders (orders_id INTEGER PRIMARY KEY AUTOINCREMENT, orders_external_id TEXT, orders_channel_id TEXT, orders_order_date INTEGER, orders_status_id TEXT,orders_external_status_id TEXT, orders_grand_total REAL, orders_created_timestamp INTEGER, orders_last_updated_timestamp INTEGER)');

    db.run('CREATE TABLE IF NOT EXISTS order_item (order_item_id INTEGER PRIMARY KEY, order_item_order_id INTEGER, order_item_external_id TEXT, order_item_status TEXT, order_item_grand_total REAL, order_item_quantity INTEGER, order_item_unit_price REAL, order_item_product_id TEXT, order_item_external_product_id TEXT, order_item_name TEXT, order_item_estimated_ship_date INTEGER, order_item_estimated_delivery_date INTEGER, order_item_created_timestamp INTEGER, order_item_last_updated_timestamp INTEGER, product_id INTEGER, product_name TEXT, product_cost_price REAL )');

    db.run('CREATE TABLE IF NOT EXISTS order_status (order_status_order_id INTEGER, order_status_last_updated_timestamp INTEGER, order_status_old_status TEXT, order_status_old_external_status TEXT, order_status_extra TEXT)');

    db.run('CREATE TABLE IF NOT EXISTS product (id INTEGER PRIMARY KEY AUTOINCREMENT, TALLY_id INTEGER DEFAULT NULL, name TEXT DEFAULT NULL, category TEXT DEFAULT NULL, mrp REAL DEFAULT NULL, cost_price REAL DEFAULT NULL, available_quantity INTEGER DEFAULT NULL, sku TEXT DEFAULT NULL, min_price REAL DEFAULT NULL, max_price REAL DEFAULT NULL, FK_channel_sku TEXT DEFAULT NULL, FK_seller_sku TEXT DEFAULT NULL, FK_available_quantity INTEGER DEFAULT NULL, FK_listed_price REAL DEFAULT NULL, FK_additional_info TEXT DEFAULT "{}", AMAZON_channel_sku TEXT DEFAULT NULL, AMAZON_seller_sku TEXT DEFAULT NULL, AMAZON_available_quantity INTEGER DEFAULT NULL, AMAZON_listed_price REAL DEFAULT NULL, AMAZON_additional_info TEXT DEFAULT "{}", PTM_channel_sku TEXT DEFAULT NULL, PTM_seller_sku TEXT DEFAULT NULL, PTM_available_quantity INTEGER DEFAULT NULL, PTM_listed_price REAL DEFAULT NULL, PTM_additional_info TEXT DEFAULT "{}", pending_orders_AMAZON INTEGER DEFAULT NULL, pending_orders_FK INTEGER DEFAULT NULL, pending_orders_PTM INTEGER DEFAULT NULL, total_sold_quantity INTEGER DEFAULT NULL, sold_last_week INTEGER DEFAULT NULL, last_sold_at INTEGER DEFAULT NULL)');
    
    db.run('CREATE TABLE IF NOT EXISTS paytm_product_catalog (channel_product_id INTEGER PRIMARY KEY, product_title TEXT, paytm_sku TEXT, seller_old_sku TEXT, mrp REAL, selling_price REAL, status INTEGER, last_updated_time INTEGER, merchant_id TEXT, is_in_stock INTEGER, return_in_days INTEGER, max_dispatch_time INTEGER, brand TEXT, seller_sku TEXT, qty INTEGER)');

    db.run('CREATE TABLE IF NOT EXISTS setting_conf (serial_id INTEGER PRIMARY KEY, setting_channel TEXT, setting_details TEXT, is_active BOOLEAN,setting_conf_last_updated_timestamp INTEGER,setting_conf_created_timestamp INTEGER,app_name TEXT,app_version TEXT,app_lang TEXT, extra TEXT DEFAULT "{}")');
    
    db.run('CREATE TABLE IF NOT EXISTS sync (channel_name TEXT, service_name TEXT, sync_val INTEGER, cron_duration INTEGER, extra TEXT DEFAULT "{}",PRIMARY KEY(channel_name,service_name))');

//Create PaymentSheet specific tables
   db.run('CREATE TABLE IF NOT EXISTS payment_sheet_summary (settlement_ref_id TEXT, order_id TEXT, external_id TEXT, settlement_date TEXT, order_item_id TEXT, order_status TEXT, sku TEXT, description TEXT, quantity TEXT, invoice_id TEXT, marketPlace TEXT, order_city TEXT, order_state TEXT, order_postal TEXT, invoice_amount REAL,  shipping_credits REAL, promotional_rebate REAL, sales_tax REAL, selling_fee REAL, fba_fee REAL, other_transaction_fee REAL, other REAL, total REAL, settlement_value REAL, order_item_value REAL, refund REAL, hold REAL, performance_award REAL, protection_fund REAL, total_marketplace_fee REAL, comission_rate REAL, commission_fee REAL, fixed_fee REAL, emi_fee REAL, shipping_fee REAL, reverse_shipping_fee REAL, cancellation_fee REAL, fee_discount REAL, service_tax REAL, dispatch_date TEXT, delivery_date TEXT, cancellation_date TEXT, dispute_date TEXT, PRIMARY KEY(settlement_ref_id,order_id))'); 

   db.run('CREATE TABLE IF NOT EXISTS acctg_trans (acctg_trans_id TEXT, acctg_trans_type_id TEXT, description TEXT, transaction_date TEXT, is_posted TEXT,  voucher_ref TEXT, voucher_date TEXT, order_id TEXT, inventory_item_id TEXT, party_id TEXT,PRIMARY KEY(acctg_trans_id,order_id))');

   db.run('CREATE TABLE IF NOT EXISTS acctg_trans_entry (acctg_trans_id TEXT, acctg_trans_entry_seq_id TEXT, acctg_trans_entry_type_id TEXT,party_id TEXT, role_type_id TEXT, gl_account_type_id TEXT, gl_account_id, organization_party_id TEXT, amount REAL, currency_uom_id TEXT, debit_credit_flag TEXT, reconcile_status_id TEXT, gl_account_class TEXT,PRIMARY KEY(acctg_trans_id, acctg_trans_entry_seq_id))');

   db.run('CREATE TABLE IF NOT EXISTS gl_account_organisation_and_class (gl_account_id INTEGER,organisation_party_id TEXT,role_type_id TEXT,gl_account_type_id TEXT,gl_account_class_id TEXT,account_name TEXT)',function(){
	console.log("===called=====");
  	accountDao.glAccountsExists(db);
   });
}
