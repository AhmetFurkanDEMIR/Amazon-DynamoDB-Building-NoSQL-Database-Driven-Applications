exports.handler = function(event, context, callback){ 
   console.log("To run a Local test in Cloud 9 use `node scan_dragons.js test`");
   console.log("running in Lambda");
   if(event["dragon_name_str"] !== undefined && event["dragon_name_str"] !== "All"){
        justThisDragon(event["dragon_name_str"], callback);
   }else{
        scanTable(callback);
   }
};

var 
    AWS = require("aws-sdk"),                            
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });    

function justThisDragon(dragon_name_str, cb){
    var 
        params = {
            ExpressionAttributeValues: {
                ":dragon_name": {
                    S: dragon_name_str
                }
            },
            ExpressionAttributeNames: {
                "#family": "family"
            },
            FilterExpression: "dragon_name = :dragon_name",
            ProjectionExpression: "dragon_name, #family, protection, damage, description",
            TableName: "DragonStatsTable"
        };
     DDB.scan(params, function(err, data){
         if(err){
             throw err;
         }
         if(data.Items){
            cb(null, data.Items); 
         }else{
            cb(null,[]);
         }
     });
}
function scanTable(cb){
     var 
        params = {
            TableName: "DragonStatsTable",
            ExpressionAttributeNames: {
                "#family": "family"
            },
            ProjectionExpression: "dragon_name, #family, protection, damage, description"
        };
    console.log("Full scan all");
    DDB.scan(params, function(err, data){
        if(err){
            throw err;
        }
        cb(null, data.Items); 
    });
}

if(process.argv[2] === "test"){
    if(process.argv[3] && process.argv[3] !== "All"){
        console.log("Local test for a dragon called " + process.argv[3]);
        justThisDragon(process.argv[3], console.log);
    }else{
        console.log("Local test for all dragons");
        scanTable(console.log);
    }
}
