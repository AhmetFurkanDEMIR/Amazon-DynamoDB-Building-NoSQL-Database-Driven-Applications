//requires Tables exist with PK defined
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
    UUID4 = require("uuid/v4"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });
function pushToDragonStatsOne(){
    var 
        dragon = {},
        dragon_formatted_arr = [],
        params = {},
        location_str = "";

    var DRAGON_DATA_ARR = require("/home/ec2-user/environment/lab3/resources/dragon_stats_one.json");

    for(var i_int = 0; i_int < DRAGON_DATA_ARR.length; i_int += 1){
        location_str =  DRAGON_DATA_ARR[i_int].location_country_str + "#" +
                        DRAGON_DATA_ARR[i_int].location_state_str + "#" +
                        DRAGON_DATA_ARR[i_int].location_city_str + "#" +
                        DRAGON_DATA_ARR[i_int].location_neighborhood_str;
        dragon = {
            PutRequest: {
                Item: {
                    pk : {
                        "S": UUID4()
                    },
                    damage: {
                        "N": DRAGON_DATA_ARR[i_int].damage_int.toString()
                    },
                    description: {
                        "S": DRAGON_DATA_ARR[i_int].description_str
                    },
                    dragon_name: {
                        "S": DRAGON_DATA_ARR[i_int].dragon_name_str
                    },
                    family: {
                        "S": DRAGON_DATA_ARR[i_int].family_str
                    },
                    location: {
                        "S": location_str
                    }, 
                    protection: {
                        "N": DRAGON_DATA_ARR[i_int].protection_int.toString()
                    },
                }
            }
        };
        dragon_formatted_arr.push(dragon);
    }
    params = {
        RequestItems: {
            "single_dragon_table": dragon_formatted_arr.reverse()
        }
    };
    return DDB.batchWriteItem(params).promise();
}
function pushToDragonStatsTwo(){
    var 
        dragon = {},
        dragon_formatted_arr = [],
        params = {},
        location_str = "";

    var DRAGON_DATA_ARR = require("/home/ec2-user/environment/lab3/resources/dragon_stats_two.json");

    for(var i_int = 0; i_int < DRAGON_DATA_ARR.length; i_int += 1){
        location_str =  DRAGON_DATA_ARR[i_int].location_country_str + "#" +
                        DRAGON_DATA_ARR[i_int].location_state_str + "#" +
                        DRAGON_DATA_ARR[i_int].location_city_str + "#" +
                        DRAGON_DATA_ARR[i_int].location_neighborhood_str;
        dragon = {
            PutRequest: {
                Item: {
                    pk : {
                        "S": UUID4()
                    },
                    damage: {
                        "N": DRAGON_DATA_ARR[i_int].damage_int.toString()
                    },
                    description: {
                        "S": DRAGON_DATA_ARR[i_int].description_str
                    },
                    dragon_name: {
                        "S": DRAGON_DATA_ARR[i_int].dragon_name_str
                    },
                    family: {
                        "S": DRAGON_DATA_ARR[i_int].family_str
                    },
                    location: {
                        "S": location_str
                    }, 
                    protection: {
                        "N": DRAGON_DATA_ARR[i_int].protection_int.toString()
                    },
                }
            }
        };
        dragon_formatted_arr.push(dragon);
    }
    params = {
        RequestItems: {
            "single_dragon_table": dragon_formatted_arr.reverse()
        }
    };
    return DDB.batchWriteItem(params).promise();
}

(async function seed(){
    console.time("HowFastWasThat");
    console.log(await Promise.all([
            pushToDragonStatsOne(),
            pushToDragonStatsTwo()
    ]));
    console.timeEnd("HowFastWasThat");
})();
