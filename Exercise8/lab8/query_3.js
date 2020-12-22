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

//Query 3: Return the dragons in range attack order (highest first)


var
    AWS = require("aws-sdk"),
    UUID4 = require("uuid/v4"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });

var g_range_arr = [];

function stageOne(cb){
    var 
        params = {
            TableName: "improved_single_dragon_table",
            IndexName: "range_index",
            ScanIndexForward: false,
            ExpressionAttributeValues: {
                ":bonus": {
                    S: "bonus"
                }
            },
            ExpressionAttributeNames: {
                 "#range": "range"
            },
            KeyConditionExpression: "sk = :bonus",
            ProjectionExpression: "pk, #range"
        };
    DDB.query(params, function (err, data) {
        if(err){
            return cb(err, null);
        }
        //store range to add later
        g_range_arr = data.Items;
        cb(null, data.Items);
    });
}

function _buildExpressionAttributes(dragon_id_arr){
    // console.log(dragon_id_arr);
    var 
        expression = {};
        
    for(var i_int = 0; i_int < dragon_id_arr.length; i_int += 1){
        var temp_key_str = ":uuid_" + i_int.toString();
        expression[temp_key_str] = {
            S: dragon_id_arr[i_int].pk.S
        };
    }
    // console.log("eerr", dragon_id_arr, expression);
    return expression;
}
function _buildFilterExpression(dragon_id_arr){
    var
        filter_str = "pk in (";
    for(var i_int = 0; i_int < dragon_id_arr.length; i_int += 1){
        // console.log(dragon_id_arr[i_int].pk.S);
        filter_str += ":uuid_" + i_int + ", ";
    }
    return filter_str.slice(0, -2) + ")"; // remove , and space and add close
}

function addRange(dragons_without_range_arr){
    // console.log(g_range_arr.length);
    // console.log(dragons_without_range_arr.length);
    for (var i_int = 0; i_int < g_range_arr.length; i_int +=1){
        for (var j_int = 0; j_int < dragons_without_range_arr.length; j_int +=1){
            if(dragons_without_range_arr[j_int].pk.S === g_range_arr[i_int].pk.S){
                g_range_arr[i_int].damage = dragons_without_range_arr[j_int].damage;
                g_range_arr[i_int].protection = dragons_without_range_arr[j_int].protection;
                g_range_arr[i_int].family = dragons_without_range_arr[j_int].family;
                g_range_arr[i_int].description = dragons_without_range_arr[j_int].description;
                g_range_arr[i_int].dragon_name = dragons_without_range_arr[j_int].dragon_name;
                
                //remove sk and leave pk as is
                delete g_range_arr[i_int].sk;
                break;
            }
        }
    }
    return g_range_arr;
}
//reuse :)
function stageTwo(dragon_id_arr, cb){
    var 
        params = {
            TableName: "improved_single_dragon_table",
            IndexName: "dragon_stats_index",
            FilterExpression: _buildFilterExpression(dragon_id_arr),
            ExpressionAttributeValues: _buildExpressionAttributes(dragon_id_arr)
        };
    DDB.scan(params, function (err, data) {
        if(err){
            return cb(err, null);
        }
        var dragons_arr = addRange(data.Items);
        cb(null, dragons_arr);
    });
}
if(process.argv[2] === "test"){
    stageOne(function(err, dragon_id_arr){
        if(err){
            console.log(err, null);
        }
        if(dragon_id_arr.length === 0){
            console.log(null, []); //no dragons found
        }else{
            stageTwo(dragon_id_arr, function(err, dragon_arr){
                if(err){
                    return console.log(err);
                }
                console.log(null, dragon_arr);
                console.log("Dragons in range order:");
            });
        }
    });
}
    
