var db = require('../db-config').db;
var logger = require('../../lib/logger');
var productService = require('../../services/product/productService');
var _ = require('underscore');
var matchingProductQuery = "SELECT * FROM product WHERE name LIKE ?";
var getProductsByCategoryQuery = 'SELECT * FROM product where category = ?';

exports.getProducts = function (cb, err) {
    var selectQuery = "select * from product "
    db.all(selectQuery, function (err, rows) {
        var data = [];
        if (rows) {
            rows.forEach(function (row) {
                data.push(row);
            });
            cb(data);
        }
    });
};

exports.topSellingProducts = function (daysSince, limit, cb, err) {
    var days = 1000 * 60 * 60 * 24 * daysSince;
    var d = new Date();
    var past = new Date (d-days);
    var pastdays = past.getTime();
    var selectQuery = "select order_item.order_item_name,sum(order_item.order_item_quantity) as total_quantity,product.available_quantity from order_item inner join product on order_item.order_item_product_id = product.id where order_item.order_item_status in ('APPROVED', 'SHIPPED', 'IN-PROGRESS') AND order_item.order_item_created_timestamp > '"+pastdays+"' group by order_item.order_item_external_product_id order by total_quantity desc limit " + limit;

/*
    var selectQuery = "select order_item.order_item_name,sum(order_item.order_item_quantity) as total_quantity from order_item where order_item.order_item_status in ('APPROVED', 'SHIPPED') AND order_item.order_item_created_timestamp > '"+pastdays+"' group by order_item.order_item_external_product_id order by total_quantity desc limit 5";
*/
    db.all(selectQuery, function (dbErr, rows) {
        var data = [];
        rows.forEach(function (row) {
            var item ={};
			item.order_item = row.order_item_name;
			item.total_quantity = row.total_quantity;
			data.push(item);
		});
        cb(data);
    });
};


exports.notSoldProducts = function (daysSince, limit, cb, err) {
    
    var days = 1000 * 60 * 60 * 24 * daysSince;
    var d = new Date();
    var past = new Date (d-days);
    var pastdays = past.getTime();
    var selectQuery = "select order_item.order_item_name, order_item.order_item_created_timestamp, sum(order_item.order_item_quantity) as total_quantity,product.available_quantity, product.last_sold_at from order_item inner join product on order_item.order_item_product_id = product.id where order_item.order_item_status in ('APPROVED','SHIPPED') AND order_item.order_date < '"+pastdays+"' group by order_item.order_item_product_id order by total_quantity limit " + limit;
    /*
    var selectQuery = "select order_item.order_item_name, order_item.order_item_created_timestamp, sum(order_item.order_item_quantity) as total_quantity ,max (order_item.order_item_created_timestamp) as  product_last_sold_at from order_item where order_item.order_item_status in ('APPROVED','SHIPPED') AND order_item.order_item_created_timestamp < '"+pastdays+"' group by order_item.order_item_name order by total_quantity limit 5";*/
    db.all(selectQuery, function (dbErr, rows) {
        var data = [];
        rows.forEach(function (row) {
            data.push(row);
        });
        cb(data);
    });
};


exports.mostCancelledProducts = function (daysSince, limit, cb, err) {
    var days = 1000 * 60 * 60 * 24 * daysSince ;
    var d = new Date();
    var past = new Date (d-days);
    var pastdays = past.getTime();
    var selectQuery = "select product.name , count(order_item.order_item_name) as cancelled from order_item inner join product on order_item.order_item_product_id = product.id  where order_item.order_item_status = 'CANCELLED' AND order_item.order_item_created_timestamp > '"+pastdays+"' group by product.name order by cancelled desc limit  " + limit;
    db.all(selectQuery, function (dbErr, rows) {
        var data = [];
        rows.forEach(function (row) {
            var item ={};
			item.order_item = row.name;
			item.total_quantity = row.cancelled;
			data.push(item);
        });
		cb(data);
    });
};

exports.getSalesData = function (cb, err) {
    var dt = new Date();
    var timestamp = dt.getTime();
    var selectQuery = "Select strftime('%Y-%m-%d', orders.orders_order_date / 1000, 'unixepoch') as orderdate, orders.orders_channel_id,  SUM(orders.orders_grand_total) AS total from orders where orders.orders_status_id in ('IN-PROGRESS', 'SHIPPED', 'NEW') GROUP BY orderdate, orders.orders_channel_id";
    db.all(selectQuery, function (err, rows) {
        var data = [];
        rows.forEach(function (row) {
            data.push(row);
        });
        cb(data);
    });
};


exports.getSalesAndRevenueData = function (cb, err) {
    logger.debug('Sale Revenue');
    //var selectQuery = "Select strftime('%Y-%m-%d', orders.orders_created_timestamp / 1000, 'unixepoch') as date, orders.orders_channel_id,SUM(orders.orders_grand_total) AS grand_total,SUM(order_pro.total_cost) as total_cost from orders INNER JOIN  (Select order_item_order_id,order_item_quantity, order_item_product_id, product_cost_price, SUM((order_item_quantity*product_cost_price)) as total_cost from product INNER JOIN order_item ON product.product_id = order_item.order_item_product_id GROUP BY order_item_order_id) as order_pro ON orders.orders_id = order_pro.order_item_order_id where orders.orders_status_id in ('IN-PROGRESS', 'SHIPPED', 'NEW') GROUP BY date,orders.orders_channel_id";
    var selectQuery = "Select strftime('%Y-%m-%d', orders.orders_order_date / 1000, 'unixepoch') as orderdate, SUM(orders.orders_grand_total*100) AS Revenue,SUM(order_pro.total_cost) as Cost from orders INNER JOIN  (Select order_item_order_id,order_item_quantity, order_item_product_id, product.cost_price, SUM((order_item_quantity*product.cost_price)) as total_cost from product INNER JOIN order_item ON product.id = order_item.order_item_product_id GROUP BY order_item_order_id) as order_pro ON orders.orders_id = order_pro.order_item_order_id where orders.orders_status_id in ('IN-PROGRESS', 'SHIPPED', 'NEW') GROUP BY orderdate";
    logger.debug(selectQuery);
	db.all(selectQuery, function (err, rows) {
        var data = [];
        rows.forEach(function (row) {
            data.push(row);
		});
        logger.debug(data);
		cb(data);
    });
};

exports.getTallyCredentials = function (cb) {
    db.get('Select setting_details from setting_conf where setting_channel = "TALLY"', [], function (err, rows) {
        if (rows) {
            cb(JSON.parse(rows.setting_details));
        } else {
            cb({});
        }
    });
};

/*
exports.createOrUpdateCatalog = function (product, channel, service, lastUpdateValForSync, cb) {
    checkExists(product[0].channel_product_id, function (exist) {
        if (exist) {
            updateCatalog(product, channel, service, lastUpdateValForSync, cb);
        } else {
            createCatalog(product, channel, service, lastUpdateValForSync, cb);
        }
    }, null);
}

var checkExists = function (channelProductId, cb, err) {
    db.get('SELECT * FROM paytm_product_catalog where channel_product_id = ?', [channelProductId], insertCheck);

    function insertCheck(err, rows) {
        console.log(err);
        var exist = 0;
        if (rows) {
            exist = 1;
        }
        console.log(exist);
        cb(exist);
    }
};


var updateCatalog = exports.updateCatalog = function (product, channel, service, lastUpdateDateForSync, cb) {
    db.beginTransaction(function (err, transaction) {
        db.run('update paytm_product_catalog set product_title = ?, paytm_sku = ?, seller_old_sku = ?, mrp = ?, selling_price = ?, status = ?, last_updated_time = ?, merchant_id = ?, is_in_stock = ?, return_in_days = ?, max_dispatch_time = ?, brand = ? where channel_product_id =?', [product[0].product_title, product[0].paytm_sku, product[0].seller_old_sku, product[0].mrp, product[0].selling_price, product[0].status, product[0].last_updated_time, product[0].merchant_id, product[0].is_in_stock, product[0].return_in_days, product[0].max_dispatch_time, product[0].brand, product[0].channel_product_id]);

        transaction.commit(function (err) {
            if (err) {
                console.error(err);
                transaction.rollback();
            }
            cb(channel, service, lastUpdateDateForSync);
        });
    });
};

var createCatalog = exports.createCatalog = function (product, channel, service, lastUpdateDateForSync, cb) {
    console.log('insert');
    db.beginTransaction(function (err, transaction) {
        db.run('insert or replace into paytm_product_catalog (channel_product_id, product_title, paytm_sku, seller_old_sku, mrp, selling_price, status, last_updated_time, merchant_id, is_in_stock, return_in_days, max_dispatch_time, brand) values (?,?,?,?,?,?,?,?,?,?,?,?,?)', [product[0].channel_product_id, product[0].product_title, product[0].paytm_sku, product[0].seller_old_sku, product[0].mrp, product[0].selling_price, product[0].status, product[0].last_updated_time, product[0].merchant_id, product[0].is_in_stock, product[0].return_in_days, product[0].max_dispatch_time, product[0].brand]);

        transaction.commit(function (err) {
            if (err) {
                console.error(err);
                transaction.rollback();
            }
            cb(channel, service, lastUpdateDateForSync);
        });
    });
};
*/

exports.createOrUpdateProduct = function (destination, prod, cb, err) {
    exists('tally_id', prod.tally_id, function (result) {
        if (!result || result == 'false') {
            createProduct(destination, prod, cb, null);
        } else {
            updateProduct(destination, prod, cb, null);
        }
    }, null);



}
/*
var replaceUndefinedWithNull = function (value) {
    if (value == undefined) {
        return '';
    }
    return value;
}*/

var createProduct = exports.createProduct = function (destination, prod, cb, err) {
    db.beginTransaction(function (err, transaction) {
        var query = "INSERT INTO product ( ";
        var values = " VALUES ( ";
        for (var prop in prod) {
            if (prod[prop]) {
                query = query + prop + " , ";
                values = values + " '" + prod[prop] + "', " ;
            }
        }
        query = query.substring(0, query.length - 2) + " ) " + values.substring(0, values.length - 2) + " ) ";
        transaction.exec(query);
        transaction.commit(function (err) {
            if (err) {
                console.error(err);
                transaction.rollback();
            }
            cb(destination, prod);
        });
    });
};
    /*db.beginTransaction(function (err, transaction) {
        transaction.run("INSERT INTO product (sku, tally_id, name, category, flipkart_id, flipkart_quantity, flipkart_listed_price, min_price , max_price, amazon_id, amazon_quantity, amazon_listed_price, cost_price, mrp, available_quantity, total_sold_quantity, sold_last_week, last_sold_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [replaceUndefinedWithNull(prod.product_sku), replaceUndefinedWithNull(prod.product_tally_id), replaceUndefinedWithNull(prod.product_name), replaceUndefinedWithNull(prod.product_category), replaceUndefinedWithNull(prod.product_flipkart_id), replaceUndefinedWithNull(prod.product_flipkart_quantity), replaceUndefinedWithNull(prod.product_flipkart_listed_price), replaceUndefinedWithNull(prod.product_min_price), replaceUndefinedWithNull(prod.product_max_price), replaceUndefinedWithNull(prod.product_amazon_id), replaceUndefinedWithNull(prod.product_amazon_quantity), replaceUndefinedWithNull(prod.product_amazon_listed_price), replaceUndefinedWithNull(prod.product_cost_price), replaceUndefinedWithNull(prod.product_mrp), replaceUndefinedWithNull(prod.product_available_quantity), replaceUndefinedWithNull(prod.product_total_sold_quantity), replaceUndefinedWithNull(prod.product_sold_last_week), replaceUndefinedWithNull(prod.product_last_sold_at)]);
        transaction.commit(function (err) {
            if (err) {
                console.error(err);
                transaction.rollback();
            }
            cb(destination, prod);
        });
    });
};
*/
var updateProduct = exports.updateProduct = function (destination, prod, cb, err) {
    db.beginTransaction(function (err, transaction) {
        var query = "UPDATE product SET ";
        for (var prop in prod) {
            if (prod[prop]) {
                if(prop!='sellingPrice' && prop!='mrp' && prop!='skuId' && prop!='fsn') {
                query = query + prop + " = '" + prod[prop] + "' , ";
                }
            }
        }
        query = query.substring(0, query.length - 2) + " WHERE tally_id = " + prod.tally_id;
        transaction.exec(query);
        transaction.commit(function (err) {
            if (err) {
                console.error(err);
                transaction.rollback();
            }
            cb(destination, prod);
        });
    });
};

exports.deleteProduct = function (prodid, cb, err) {
    var deleteQuery = "DELETE FROM product WHERE id='" + prodid + "'";
    db.all(deleteQuery, function (err, rows) {
        var products = [];
        if (rows) {
            rows.forEach(function (row) {
                products.push(row);
            });
            cb(products);
        }
    });
};


var exists = exports.exists = function (column_name, prodid, cb, err) {
    var selectQuery = "select count(*) as cnt from product WHERE " + column_name + "='" + prodid + "'";
    db.get(selectQuery, function (err, row) {
        if (row.cnt > 0) {
            cb(true);
        } else {
            cb(false);
        }
    });
};


exports.getProductById = function (id, cb, err) {
    var getProductByIdQuery = "SELECT * FROM product WHERE products_id = ?";
    db.all(getProductByIdQuery, [id], function (err, rows) {
        var data = [];
        if (rows) {
            rows.forEach(function (row) {
                data.push(row);
            });
            cb(data);
        }
    });
};

exports.getProductLikeName = function (id, cb, err) {
    db.all(matchingProductQuery, ['%' + id + '%'], function (er, rows) {
        if (er) {
            err(er);
        } else {
            var data = [];
            if (rows) {
                rows.forEach(function (row) {
                    data.push(row);
                });
                cb(data);
            }
        }
    });
};

exports.getProductsByCategory = function (category, cb, err) {
    db.all(getProductsByCategoryQuery, [category], function (err, rows) {
        var data = [];
        if (rows) {
            rows.forEach(function (row) {
                data.push(row);
            });
            cb(data);
        }
    });
};

/*exports.fetchData = function (sku, cb, err) {
    db.get('select mrp, selling_price, qty, max_dispatch_time, status, product_title, return_in_days from paytm_product_catalog where seller_old_sku = ?', [sku], function (err, rows) {
        if (rows) {
            var data = {
                "data": [{
                    "sku": rows.sku,
                    "mrp": rows.mrp,
                    "price": rows.selling_price,
                    "max_dispatch_time": rows.max_dispatch_time,
                    "qty": rows.qty,
                    "status": rows.status,
                    "name": rows.product_title,
                    "return_in_days": rows.return_in_days
                }]
            };
            cb(data);
        }
    });
};*/

exports.getProductByChannelId = function (channelName, productId, cb, err) {
    //console.log("inside product dao with "+ channelName +"__"+ productId );
    /*var colName ;
    if(channelName == 'FK'){
        colName = 'flipkart';
    }else if(channelName == 'PTM'){
        colName = 'paytm';
    }else if(channelName == 'AMAZON'){
        colName = 'amazon';
    }*/

var getProductByChanneIdQuery = "select id,name, cost_price from product where "+channelName+"_channel_sku = ?";
      db.get(getProductByChanneIdQuery, [productId], function (err, rows) {
        var data = [];           
        var orderItemProductId = 'unmapped';
        var orderItemChannelProductName = 'unmapped';
        var orderItemProductCostPrice = 'unmapped';
        if(rows){
                data.push({
                    orderItemProductId :  rows.product_id,
                    orderItemChannelProductName : rows.product_name,
                    orderItemProductCostPrice : rows.product_cost_price
                });
            }else{
                data.push({
                    orderItemProductId :  orderItemProductId,
                    orderItemChannelProductName : orderItemChannelProductName,
                    orderItemProductCostPrice : orderItemProductCostPrice
                });
            } 
            cb(data);
        });
}
     
exports.updateInventory = function (channelName, orderItemQuantity, orderItemProductId) {
  /*  var colName ;
    if(channelName == 'FK'){
        colName = 'flipkart';
    }else if(channelName == 'PTM'){
        colName = 'paytm';
    }else if(channelName == 'AMAZON'){
        colName = 'amazon';
    }*/
    var updateInventoryQuery = "update product set "+channelName+"_available_quantity =  ("+channelName+"_available_quantity - ?) where id = ?";
    db.run(updateInventoryQuery, [orderItemQuantity, orderItemProductId]);
      
}