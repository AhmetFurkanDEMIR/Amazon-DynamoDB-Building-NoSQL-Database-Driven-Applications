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

var
    AWS = require("aws-sdk"),
    BCRYPT = require("bcrypt"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });


function pushToUsersTable(){
    var 
        user = {},
        user_formatted_arr = [],
        params = {},
        password_str = "";

    var USER_DATA_ARR = require("/home/ec2-user/environment/lab5/resources/users.json");

    for(var i_int = 0; i_int < USER_DATA_ARR.length; i_int += 1){
        //only a very small list of users so no need for async optimization here.
        password_str = BCRYPT.hashSync(USER_DATA_ARR[i_int].temp_password_str, 10);
        user = {
            PutRequest: {
                Item: {
                    user_name: {
                        "S": USER_DATA_ARR[i_int].user_name_str
                    },
                    password: {
                        "S": password_str
                    },
                    email_address: {
                        "S": USER_DATA_ARR[i_int].email_address_str
                    },
                    first_name: {
                        "S": USER_DATA_ARR[i_int].first_name_str
                    }
                }
            }
        };
        user_formatted_arr.push(user);
    }
    params = {
        RequestItems: {
            "users": user_formatted_arr.reverse()
        }
    };
    return DDB.batchWriteItem(params).promise();
}

(async function seed(){
    console.time("HowFastWasThat");
    //async 2x speed
    console.log(await Promise.all([
        pushToUsersTable() 
     ]));
    console.timeEnd("HowFastWasThat");
})();
