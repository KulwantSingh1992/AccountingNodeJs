
var xlsxx = require('../../../excel');

function excelParse(file){
 
var db=sql.open();
/*
function convertToJSON(array) {
  var first = array[0].join()
  var headers = first.split(',');
  
  var jsonData = [];
  for ( var i = 1, length = array.length; i < length; i++ )
  {
   
    var myRow = array[i].join();
    var row = myRow.split(',');
    
    var data = {};
    for ( var x = 0; x < row.length; x++ )
    {
      data[headers[x]] = row[x];
    }
    jsonData.push(data);

  }
  return jsonData;
}*/

xlsxx(file, function(err,data) {
    if(err) throw err;
    //console.log(jsonDataArray(data));
	//console.log(file);
	//console.log(data);
    queries.queryInsert(db,data,'xlsx');
   sql.close();
   //console.log(data.length);
    //console.log(data);
});

}
//excel('F:\\paxcel\\node\\sample1.xlsx');
exports.excelParse=excelParse;