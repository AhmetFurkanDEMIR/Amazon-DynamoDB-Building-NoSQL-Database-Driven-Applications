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

//Query 1: "Return dragons that can X 
//Step 1: Get all dragon uuids of the dragins that X
//Step 2: Return details (stats) of each dragon

var
    AWS = require("aws-sdk"),
    UUID4 = require("uuid/v4"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });
function stageOne(bonus_description_str, cb){
    var params = {
        TableName: "improved_single_dragon_table",
        IndexName: "bonus_description_index",
        ExpressionAttributeValues: {
            ":bonus_description": {
                S: bonus_description_str
            }
        },
        KeyConditionExpression: "bonus_description = :bonus_description",
        ProjectionExpression: "pk"
    };
    DDB.query(params, function (err, data) {
        if(err){
            return cb(err, null);
        }
        cb(null, data.Items);
    });
}
function _buildExpressionAttributes(dragon_id_arr){
    var 
        expression = {};
    for(var i_int = 0; i_int < dragon_id_arr.length; i_int += 1){
        var eval_str = ":uuid_" + i_int;
        expression[eval_str] = {
            S: dragon_id_arr[i_int].pk.S
        };
    }
    return expression;
}
function _buildFilterExpression(dragon_id_arr){
    var
        filter_str = "pk in (";
    for(var i_int = 0; i_int < dragon_id_arr.length; i_int += 1){
        filter_str += ":uuid_" + i_int + ", ";
    }
    var return_me_str = filter_str.slice(0, -2) + ")";
    return return_me_str;
}
function stageTwo(dragon_id_arr, cb){
    var 
        params = {
            TableName: "improved_single_dragon_table",
            IndexName: "dragon_stats_index",
            FilterExpression: _buildFilterExpression(dragon_id_arr),
            ExpressionAttributeValues: _buildExpressionAttributes(dragon_id_arr),
            ProjectionExpression: "dragon_name"
        };
    DDB.scan(params, function (err, data) {
        if(err){
            return cb(err, null);
        }
        cb(null, data.Items);
    });
}
if(process.argv[2] === "test"){
    if(process.argv[3]){
        var bonus_description_str = process.argv[3];
        stageOne(bonus_description_str, function(err, dragon_id_arr){
            if(err){
                throw err;
            }
            if(dragon_id_arr.length === 0){
                console.log(null, []);
            }else{
                stageTwo(dragon_id_arr, function(err, dragon_arr){
                    if(err){
                        throw err;
                    }
                    console.log(dragon_arr.length + " dragons found that " + process.argv[3]);
                    console.log(null, dragon_arr);
                });
            }
        });
    }
}
