//Insert Query
var insertPaymentSummaryQuery = "INSERT OR REPLACE INTO payment_sheet_summary(settlement_ref_id, order_id, external_id, settlement_date, order_item_id, order_status, sku, description, quantity, invoice_id, marketPlace, order_city, order_state, order_postal, invoice_amount,  shopping_credits, promotional_rebate, sales_tax, selling_fee, fba_fee, other_transaction_fee, other, total, settlement_value, order_item_value, refund, hold, reformance_award, protection_fund, total_marketplace_fee, comission_rate, commission_fee, fixed_fee, emi_fee, shipping_fee, reverse_shipping_fee, cancellation_fee, fee_discount, service_tax, dispatch_date, delivery_date, cancellation_date, dispute_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

var insertAcctgTransQuery = "INSERT OR REPLACE INTO orders(orders_external_id, orders_channel_id, orders_order_date, orders_status_id, orders_external_status_id, orders_grand_total, orders_created_timestamp, orders_last_updated_timestamp) VALUES (?,?,?,?,?,?,?,?)";

var insertAcctgTransEntryQuery = "INSERT OR REPLACE INTO orders(orders_external_id, orders_channel_id, orders_order_date, orders_status_id, orders_external_status_id, orders_grand_total, orders_created_timestamp, orders_last_updated_timestamp) VALUES (?,?,?,?,?,?,?,?)";

//Select Query
