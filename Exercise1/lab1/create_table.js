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

(function createADataBaseTable(){
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
            TableName: "dragons"
        };
     DDB.createTable(params, function(err, data){
         console.log(err, data);             
     });
})();
