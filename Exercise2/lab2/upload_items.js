//* Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//*
//* Licensed under the Apache License, Version 2.0 (the "License").
//* You may not use this file except in compliance with the License.
//* A copy of the License is located at
//*
//*  http://aws.amazon.com/apache2.0
//*
//* or in the "license" file accompanying this file. This file is distributed
//* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
//* express or implied. See the License for the specific language governing
//* permissions and limitations under the License.

var
    AWS = require("aws-sdk"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });

(function uploadItemstoDynamoDB(){
    var
        dragon_1 = {
            Item:{
                "dragon_name":{
                    S: "sparky"
                },
                "dragon_type":{
                    S: "green"
                },	
                "description":{
                    S: "breaths acid"
                },
                "attack":{
                    N: "10"
                },
                "defense":{
                    N: "7" 
                }
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "dragons"
        };
     DDB.putItem(dragon_1, function(err, data){
         console.log(err, data);
     });
     var
        dragon_2 = {
            Item:{
                "dragon_name":{
                    S: "tallie"
                },
                "dragon_type":{
                    S: "red"
                },
                "description":{
                    S: "breaths fire"
                },
                "attack":{
                    N: "7"
                },
                "defense":{
                    N: "10"
                } 
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "dragons"
        };
     DDB.putItem(dragon_2, function(err, data){
         console.log(err, data);
     });
})();
