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

            if(event.updates.dragon_name_str){
                handleSpecialCase(event.original_dragon_name_str, event.updates, callback);
            }else{
                if(update_str === "SE"){//truncated "SET "
                    return console.log("nothing to update", null);
                }
                editCard(event.original_dragon_name_str, update_str, expression, callback);
            }
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
    //in case was event lambda
    // console.log(payload);
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
     //code to protect damage going out of bounds
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
     //code to protect protectiongoing out of bounds
    if(payload.protection_int){
        expression[":protection"] = {
            N: payload.protection_int.toString()
        };
    }
    if(payload.family_str){
        expression[":family"] = {
            S: payload.family_str
        };
    }
    
    return expression;
}

function confirmAdminLogin(user_name_str, session_id_str, cb){
    // throw "STOP";
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

//helper function added
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

//extra param passed in conditions_str
function editCard(original_dragon_name_str, update_str, expression, cb){
    if(isEmpty(expression)){
        return cb(null,[]);
    }
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
    DDB.updateItem(params, function(err, data){
        if(err){
            throw err;
        }
        console.log(data);
        if(data.Attributes){
            cb(null, data.Attributes); 
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

async function handleSpecialCase(original_dragon_name_str, updated_attributes, cb){
    console.log("special case we need a transaction here");
    var query_response = await getOldDragonItem(original_dragon_name_str);
    if(query_response.Items.length === 0){
        return cb("no dragon found called " + original_dragon_name_str, null);
    }
    var dragon = query_response.Items[0];
    // var condition_str = constructCondition(updated_attributes);
    // console.log(condition_str);

    //clone but update with a new name and new attribute changes
    dragon.dragon_name = {
        S: updated_attributes.dragon_name_str
    };
    if(updated_attributes.damage_int){
        dragon.damage = {
            N: updated_attributes.damage_int.toString()
        };
    }
    if(updated_attributes.description_str){
        dragon.description = {
            S: updated_attributes.description_str
        };
    }
    if(updated_attributes.protection_int){
        dragon.protection = {
            N: updated_attributes.protection_int.toString()
        };
    }
    if(updated_attributes.family_str){
        dragon.family = {
            S: updated_attributes.family_str
        };
    }
    
    //START TRANSACTION
    //2 create a brand new item with the name changed

    
    runTransaction(dragon, original_dragon_name_str, function(err, new_dragon){
        if(err){
            return cb(err, null);
        }
        return cb(null, new_dragon);
    });
}

async function runTransaction(dragon, original_dragon_name_str, callback){
    var 
        params = {
            TransactItems: [{
                Delete: {
                    Key: {
                        "dragon_name": {
                            S: original_dragon_name_str
                        }
                    },
                    TableName: "dragon_stats"
                }
            },{
                Put: {
                    Item: dragon,
                    TableName: "dragon_stats",
                    ConditionExpression: "attribute_not_exists(dragon_name)"
                }
            }]
        };
        
    DDB.transactWriteItems(params, function(err, success_boo){
        if(err){
            return callback(err, null);
        }
        callback(null, dragon);
    });
}
function getOldDragonItem(original_dragon_name_str){
    var 
        params = {
            ExpressionAttributeValues: {
                ":dragon_name": {
                    S: original_dragon_name_str
                }
            },
            KeyConditionExpression: "dragon_name = :dragon_name",
            TableName: "dragon_stats",
        };
     return DDB.query(params).promise();
}


if(process.argv[2] === "test"){
    confirmAdminLogin(process.argv[3], process.argv[4], function(err, success_boo){
        if(err){
            return console.log("nope", null);
        }
        var 
            updated_attributes = getUpdatedItemFromJson(process.argv[5]),
            original_dragon_name_str = process.argv[5];
        
        if(updated_attributes.dragon_name_str){
            handleSpecialCase(original_dragon_name_str, updated_attributes, console.log);
        }else{
            var 
                update_str = constructUpdate(updated_attributes),
                expression = constructExpressionObject(updated_attributes);
            if(update_str === "SE"){//truncated "SET "
                return console.log("nothing to update", null);
            }
            editCard(original_dragon_name_str, update_str, expression, console.log);
        }
    });
}
