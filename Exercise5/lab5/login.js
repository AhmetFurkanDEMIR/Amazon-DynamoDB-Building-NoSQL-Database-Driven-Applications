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
   console.log("To run a Local test in Cloud 9 use `node login.js test 'email_address_str` 'attempted_password_str'");
   console.log("Running in Lambda");
   if(event["email_address_str"] && event["attempted_password_str"]){
        logMeIn(event["email_address_str"], event["attempted_password_str"], callback);
   }else{
        callback("no credentials passed", null);
   }
};

var 
    AWS = require("aws-sdk"),   
    BCRYPT = require("bcrypt"),  
    UUID4 = require("uuid/v4"),                     
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    }),
    SESSION_TIMEOUT_IN_MINUTES_INT = 1;

async function createSession(user_name_str, new_session_id_str){
    var 
        params = {
            Item: {
                "session_id": {
                    S: new_session_id_str
                }, 
                "user_name": {
                     S: user_name_str
                }, 
                "expiration_time": {
                    N: (Math.floor((new Date).getTime()/1000) + (60 * SESSION_TIMEOUT_IN_MINUTES_INT)).toString()
                }
            }, 
            ReturnConsumedCapacity: "TOTAL", 
            TableName: "sessions"
     };
     return DDB.putItem(params).promise();
}

function logMeIn(email_address_str, attempted_password_str, cb){
    var 
        params = {
            ExpressionAttributeValues: {
                ":email_address": {
                    S: email_address_str
                }
            },
            KeyConditionExpression: "email_address = :email_address",
            TableName: "users",
            IndexName: "email_index"
        };
     DDB.query(params, async function(err, data){
         var 
            new_session_id_str = UUID4(),
            return_me = {};
         if(err){
             throw err;
         }
         if(data.Items && data.Items[0]){
            console.log(data.Items[0].password.S, attempted_password_str);
            if(BCRYPT.compareSync(attempted_password_str, data.Items[0].password.S) === true){
                console.log("Password is correct");
                console.log(await createSession(data.Items[0].user_name.S, new_session_id_str));
                console.log("AWAITED", new_session_id_str);
                return_me = {
                    user_name_str: data.Items[0].user_name.S,
                    session_id_str: new_session_id_str
                };
                cb(null, return_me);
            }else{
                return cb("password does not match email", null);
            }
         }else{
            cb("credentials invalid", null);
         }

     });
}
if(process.argv[2] === "test"){
    if(process.argv[3] && process.argv[4]){
        console.log("Local test to log in a user with email of " + process.argv[3]);
        logMeIn(process.argv[3], process.argv[4], console.log);
    }else{
        console.log("Pass in email address and password");
    }
}
