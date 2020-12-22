/*
* Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
/* Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

var 
    AWSXRay = null,
    AWS = null;

exports.handler = function (event, contexts, callback) {
        AWSXRay = require("aws-xray-sdk-core"),
        AWS = AWSXRay.captureAWS(require("aws-sdk"));
   if(event["user_name_str"] === undefined || event["session_id_str"] === undefined){
        return callback("not allowed", null);
   }else{
        confirmLogin(event["user_name_str"], event["session_id_str"], function(err, success_boo){
            if(err){
                return callback("nope", null);
            }
            if(event["dragon_name_str"] !== undefined && event["dragon_name_str"] !== "All"){
                justThisDragon(event["dragon_name_str"], callback);
            }else{
                scanTable(callback);
            }
        });
   }
};

if(AWSXRay === null){
    AWS = require("aws-sdk");
}

var DDB = new AWS.DynamoDB({
    apiVersion: "2012-08-10",
    region: "us-east-1"
});

function confirmLogin(user_name_str, session_id_str, cb){
    var 
        params = {
            ExpressionAttributeValues: {
                ":session_id": {
                    S: session_id_str
                }
            },
            KeyConditionExpression: "session_id = :session_id",
            TableName: "sessions"
        };
     console.log(user_name_str, session_id_str);
     DDB.query(params, function(err, data){
         if(err){
            console.log(err);
             return cb("nope", null);
         }
        if(data.Items && data.Items[0] && data.Items[0].user_name && data.Items[0].user_name.S === user_name_str){
            console.log("match");
            cb(null, true);
         }else{
            cb("not allowed", null);
         }
     });
}
function justThisDragon(dragon_name_str, cb) {
    var
        params = {
            ExpressionAttributeValues: {
                ":dragon_name": {
                    S: dragon_name_str
                }
            },
            KeyConditionExpression: "dragon_name = :dragon_name",
            ExpressionAttributeNames: {
                "#family": "family"
            },
            ProjectionExpression: "dragon_name, #family, protection, damage, description",
            TableName: "dragon_stats"
        };
    DDB.query(params, function (err, data) {
        if (err) {
            cb(err);
        } else if (data.Items) {
            cb(null, data.Items);
        } else {
            cb(null, []);
        }
    });
}
function scanTable(cb) {
    var
        params = {
            TableName: "dragon_stats",
            ExpressionAttributeNames: {
                "#family": "family"
            },
            ProjectionExpression: "dragon_name, #family, protection, damage, description"
        };
    let items = [];
    DDB.scan(params, function scanUntilDone(err, data) {
        if (err) {
            cb(err);
        } else if (data.LastEvaluatedKey) {
            
            items = items.concat(data.Items);
            
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            
            DDB.scan(params, scanUntilDone);
        } else {
            items = items.concat(data.Items);
            cb(null, items);
        }
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


