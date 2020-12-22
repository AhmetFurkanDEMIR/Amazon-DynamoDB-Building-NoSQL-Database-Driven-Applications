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
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });                                              

function createTheDragonStatsTable(){
    var 
        params = {
            AttributeDefinitions: [{
                AttributeName: "dragon_name", 
                AttributeType: "S"
            }], 
            KeySchema: [{
                AttributeName: "dragon_name", 
                KeyType: "HASH"
            }],
            BillingMode: "PAY_PER_REQUEST",
            TableName: "dragon_stats"
        };
     return DDB.createTable(params).promise();
}
function createTheDragonCurrentPowerTable(){
    var 
        params = {
            AttributeDefinitions: [{
                AttributeName: "game_id", 
                AttributeType: "S"
            }], 
            KeySchema: [{
                AttributeName: "game_id", 
                KeyType: "HASH"
            }],
            BillingMode: "PAY_PER_REQUEST",
            TableName: "dragon_current_power"
        };
    return DDB.createTable(params).promise();
}
function createTheDragonBonusAttackTable(){
    var 
        params = {
            AttributeDefinitions: [{
                AttributeName: "breath_attack", 
                AttributeType: "S"
            },{
                AttributeName: "range", 
                AttributeType: "N"
            }], 
            KeySchema: [{
                AttributeName: "breath_attack", 
                KeyType: "HASH"
            },{
                AttributeName: "range", 
                KeyType: "RANGE"
            }],
            BillingMode: "PAY_PER_REQUEST",
            TableName: "dragon_bonus_attack"
        };
    return DDB.createTable(params).promise();
}
function createTheDragonFamilyTable(){
    var 
        params = {
            AttributeDefinitions: [{
                AttributeName: "family", 
                AttributeType: "S"
            }], 
            KeySchema: [{
                AttributeName: "family", 
                KeyType: "HASH"
            }],
            BillingMode: "PAY_PER_REQUEST",
            TableName: "dragon_family"
        };
    return DDB.createTable(params).promise();
}


(async function createAllTables(){
    console.time("HowFastWasThat");
    console.log(await Promise.all([
        createTheDragonStatsTable(),
        createTheDragonCurrentPowerTable(),
        createTheDragonBonusAttackTable(),
        createTheDragonFamilyTable()
    ]));
    console.timeEnd("HowFastWasThat");
})();


