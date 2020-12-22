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

exports.handler = function (event, context, callback) {
    if (event["dragon_name_str"] !== undefined && event["dragon_name_str"] !== "All") {
        justThisDragon(event["dragon_name_str"], callback);
    } else {
        scanIndex(callback);
    }
};

var
    AWS = require("aws-sdk"),
    DDB = new AWS.DynamoDB({
        region: "us-east-1",
        apiVersion: "2012-08-10"
    });

function justThisDragon(dragon_name_str, cb) {
    var
        params = {
            ExpressionAttributeValues: {
                ":dragon_name": {
                    S: dragon_name_str
                }
            },
            KeyConditionExpression: "dragon_name = :dragon_name",
            TableName: "single_dragon_table",
            IndexName: "dragon_stats_index"
        };
    DDB.query(params, function (err, data) {
        if(err) {
            cb(err, null);
        }else if(data.Items){
            cb(null, data.Items);
        }else{
            cb(null, []);
        }
    });
}
function scanIndex(cb) {
    var
        params = {
            TableName: "single_dragon_table",
            IndexName: "dragon_stats_index"
        },
        items = [];
    DDB.scan(params, function scanUntilDone(err, data){
        if(err){
            cb(err, null);
        }else if(data.LastEvaluatedKey){
            items = items.concat(data.Items);
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            DDB.scan(params, scanUntilDone);
        }else{
            items = items.concat(data.Items);
            
            cb(null, items);
            console.log("Total items scanned: " + items.length);
        }
    });
}
if(process.argv[2] === "test"){
    if(process.argv[3] && process.argv[3] !== "All"){
        console.log("Local test for a dragon called " + process.argv[3]);
        justThisDragon(process.argv[3], console.log);
    }else{
        console.log("Local test for all dragons");
        scanIndex(console.log);
    }
}

