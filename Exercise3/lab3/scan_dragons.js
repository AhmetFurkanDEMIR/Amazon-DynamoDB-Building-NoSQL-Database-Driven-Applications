/*
* Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.
*/

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
            FilterExpression: "dragon_name = :dragon_name",
            TableName: "dragon_stats"
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
            TableName: "dragon_stats",
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
