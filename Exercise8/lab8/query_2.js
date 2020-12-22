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

//Query 2: Return all dragons that are X
//Step 2: Return name (stats) of each dragon

var
    AWS = require("aws-sdk"),
    UUID4 = require("uuid/v4"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });
function stageOne(family_str, cb){
    var params = {
        TableName: "improved_single_dragon_table",
        IndexName: "dragon_stats_index",
        ExpressionAttributeValues: {
            ":family": {
                S: family_str
            }
        },
        ExpressionAttributeNames: {
            "#family": "family"
        },
        FilterExpression: "#family = :family",
        ProjectionExpression: "dragon_name"
    };
    
    DDB.scan(params, function (err, data){
        if(err){
            return cb(err, null);
        }
        cb(null, data.Items);
    });
}

if(process.argv[2] === "test"){
    if(process.argv[3]){
        var family_str = process.argv[3];
        stageOne(family_str, function(err, dragon_id_arr){
            if(err){
                throw err;
            }
            console.log(null, dragon_id_arr);
        });
    }
}
