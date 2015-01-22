
var fs=require('fs');
var csv = require("fast-csv");
var accountService=require('./accountService');

function csvParse(file, sheetType){
	var stream = fs.createReadStream(file);
	var csvStream;
	var count=0;
	if(sheetType == "amazon") {
		csvStream = csv.parse()
		    .on("data", function(data){
			if(count==0){count++;}
			else 
			 accountService.createAmazonPaymentSheet(data);
			//Check Column's name and length
			//Call queries from accountDAO, SAve
		    })
		    .on("end", function(){
			
		    });
	} else if (sheetType == "flipkart") {
		csvStream = csv.parse()
		    .on("data", function(data){
			
			 //queries.queryInsert(db,data,'csv');
            if(count==0){count++;}
			else 			
			accountService.createFlipkartPaymentSheet(data);
			//Check Column's name and length
			//Call queries from accountDAO, SAve
		    })
		    .on("end", function(){
			 
		    });
	}
	stream.pipe(csvStream); // Need to be tested if required
}
exports.csvParse=csvParse;
