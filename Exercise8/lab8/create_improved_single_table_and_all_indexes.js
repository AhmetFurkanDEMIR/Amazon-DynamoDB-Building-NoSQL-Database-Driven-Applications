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

(function createImprovedTableAndAllIndexes(){
    var 
        params = {
            AttributeDefinitions: [{
                AttributeName: "pk", 
                AttributeType: "S"
            },{
                AttributeName: "sk", 
                AttributeType: "S"
            },{
                AttributeName: "range", 
                AttributeType: "N"
            },{
                AttributeName: "location", 
                AttributeType: "S"
            },{
                AttributeName: "dragon_name", 
                AttributeType: "S"
            },{
                AttributeName: "bonus_description", 
                AttributeType: "S"
            }], 
            KeySchema: [{
                AttributeName: "pk", 
                KeyType: "HASH"
            },{
                AttributeName: "sk", 
                KeyType: "RANGE"
            }],
            BillingMode: "PAY_PER_REQUEST",
            TableName: "improved_single_dragon_table",
            GlobalSecondaryIndexes: [{
                IndexName: "dragon_stats_index",
                KeySchema: [{
                    AttributeName: "dragon_name",
                    KeyType: "HASH"
                }],
                Projection: {
                    NonKeyAttributes: [
                        "protection",
                        "damage",
                        "description",
                        "family"
                    ],
                    ProjectionType: "INCLUDE"
                }
            },{
                IndexName: "bonus_description_index",
                KeySchema: [{
                    AttributeName: "bonus_description",
                    KeyType: "HASH"
                }],
                Projection: {
                    NonKeyAttributes: [
                        "pk"
                    ],
                    ProjectionType: "INCLUDE"
                }
            },{
                IndexName: "range_index",
                KeySchema: [{
                    AttributeName: "sk",
                    KeyType: "HASH"
                },{
                    AttributeName: "range",
                    KeyType: "RANGE"
                }],
                Projection: {
                    NonKeyAttributes: [
                        "pk"
                    ],
                    ProjectionType: "INCLUDE"
                }
            },{
                IndexName: "location_index",
                KeySchema: [{
                    AttributeName: "sk",
                    KeyType: "HASH"
                },{
                    AttributeName: "location",
                    KeyType: "RANGE"
                }],
                Projection: {
                    NonKeyAttributes: [
                        "dragon_name",
                        "protection",
                        "damage",
                        "description",
                        "family"
                    ],
                    ProjectionType: "INCLUDE"
                }
            }]
        };
     DDB.createTable(params, function(err, data){
         console.log(err, data);             
     });
})();
