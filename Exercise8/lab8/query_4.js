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

//Query 4: Give me all the dragons that live in Arizona, USA


var
    AWS = require("aws-sdk"),
    UUID4 = require("uuid/v4"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });


function stageOne(location_str, cb){
    var 
        params = {
            TableName: "improved_single_dragon_table",
            IndexName: "location_index",
            ExpressionAttributeValues: {
                ":location": {
                    S: location_str
                },
                ":stats": {
                    S: "stats"
                }
            },
            ExpressionAttributeNames: {
                "#location": "location"
            },
            KeyConditionExpression :"sk = :stats and begins_with(#location, :location)"
        };
    DDB.query(params, function (err, data) {
        if(err){
            return cb(err, null);
        }
        cb(null, data.Items);
    });
}

if(process.argv[2] === "test"){
    var location_str = process.argv[3];
    stageOne(location_str, function(err, dragon_arr){
        if(err){
            console.log(err, null);
        }
        if(dragon_arr.length === 0){
            console.log(null, []); //no dragons found
        }else{
            console.log(null, dragon_arr);
        }
    });
}
    
