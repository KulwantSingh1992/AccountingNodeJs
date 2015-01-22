
var connection;
var fs=require('fs');
var csv = require("fast-csv");

function csvParse(file){
var stream = fs.createReadStream(file);
var db=sql.open();
var csvStream = csv
    .parse()
    .on("data", function(data){
         queries.queryInsert(db,data,'csv');
    })
    .on("end", function(){
         sql.close();
    });

stream.pipe(csvStream);
}

exports.csvParse=csvParse;
