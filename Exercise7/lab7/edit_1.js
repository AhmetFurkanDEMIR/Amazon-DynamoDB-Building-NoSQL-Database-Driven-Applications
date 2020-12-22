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
    console.log("To run a Local test in Cloud 9 see instructions");
    console.log("running in Lambda");
    if(event["user_name_str"] === undefined || event["session_id_str"] === undefined){
        return callback("nope", null);
    }else{
        confirmAdminLogin(event["user_name_str"], event["session_id_str"], function(err, success_boo){
            if(err){
                return callback("nope", null);
            }
            var 
                update_str = constructUpdate(event.updates),
                expression = constructExpressionObject(event.updates);
            if(update_str === "SE"){//truncated "SET "
                return console.log("nothing to update", null);
            }
            editCard(event.original_dragon_name_str, update_str, expression, callback);
            return callback("edit_1.js is not designed for lambda. edit_3.js should be used");
        });
    }
};

var 
    AWS = require("aws-sdk"),                            
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });    

function constructUpdate(payload){
    delete payload.session_id_str;
    delete payload.user_name_str;
    var update_str = "SET ";
    if(payload.dragon_name_str){
        update_str += "dragon_name = :dragon_name, ";
    }
    if(payload.damage_int){
        update_str += "damage = :damage, ";
    }
    if(payload.description_str){
        update_str += "description = :description, ";
    }
    if(payload.protection_int){
       update_str += "protection = :protection, ";
    }
    if(payload.family_str){
        update_str += "#family= :family, ";
    }
    console.log(update_str);
    
    return update_str.slice(0, -2);//remove trailing comma
}

function constructExpressionObject(payload){
    var 
        expression = {};
    if(payload.dragon_name_str){
        expression[":dragon_name"] = {
            S: payload.dragon_name_str
        };
    }
    if(payload.damage_int){
        expression[":damage"] = {
            N: payload.damage_int.toString()
        };
    }
    if(payload.description_str){
        expression[":description"] = {
            S: payload.description_str
        };
    }
    if(payload.protection_int){
        expression[":protection"] = {
            N: payload.protection_int.toString()
        };
    }
    if(payload.family_str){
        expression[":family"] = {
            N: payload.family_str
        };
    }
    
    return expression;
}

function confirmAdminLogin(user_name_str, session_id_str, cb){
    var 
        params = {
            ExpressionAttributeValues: {
                ":session_id": {
                    S: session_id_str
                },
                ":admin_boo": {
                    BOOL: true
                }
            },
            KeyConditionExpression: "session_id = :session_id",
            FilterExpression: "admin = :admin_boo",
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
            console.log("maybe a user but not admin, or just not a valid user");
            cb("nope", null);
        }
     });
}
function editCard(original_dragon_name_str, update_str, expression, cb){
    var 
        params = {
            Key: {
                "dragon_name": {
                    S: original_dragon_name_str
                }
            },
            ExpressionAttributeValues: expression,
            UpdateExpression: update_str,
            ReturnValues: "UPDATED_NEW",
            TableName: "dragon_stats"
        };
    if(expression[":family"]){
        params.ExpressionAttributeNames = {"#family": "family"};
    }
    console.log(params);
    // cb("stop here", null);
    DDB.updateItem(params, function(err, data){
        if(err){
            throw err;
        }
        console.log(data);
        if(data.Items){
            cb(null, data.Items); 
        }else{
            cb(null,[]);
        }
    });
}

function getUpdatedItemFromJson(dragon_name_to_edit_str){
    var 
        file_path_str = "/home/ec2-user/environment/lab7/resources/",
        file_name_str = "update_to_" + dragon_name_to_edit_str.toLowerCase() + ".json",
        updated_attributes = require(file_path_str + file_name_str);
    // console.log(updated_attributes);
    return updated_attributes;
}

if(process.argv[2] === "test"){
    confirmAdminLogin(process.argv[3], process.argv[4], function(err, success_boo){
        if(err){
            return console.log("nope", null);
        }
        var 
            updated_attributes = getUpdatedItemFromJson(process.argv[5]),
            update_str = constructUpdate(updated_attributes),
            original_dragon_name_str = process.argv[5],
            expression = constructExpressionObject(updated_attributes);
        if(update_str === "SE"){//truncated "SET "
            return console.log("nothing to update", null);
        }
        editCard(original_dragon_name_str, update_str, expression, console.log);
    });
}
