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
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });
function pushToDragonStatsTableOne(){
    var 
        dragon = {},
        dragon_formatted_arr = [],
        params = {};

    var DRAGON_DATA_ARR = require("/home/ec2-user/environment/lab3/resources/dragon_stats_one.json");

    for(var i_int = 0; i_int < DRAGON_DATA_ARR.length; i_int += 1){
        dragon = {
            PutRequest: {
                Item: {
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
                    location_city: {
                        "S": DRAGON_DATA_ARR[i_int].location_city_str
                    }, 
                    location_country: {
                        "S": DRAGON_DATA_ARR[i_int].location_country_str
                    },
                    location_neighborhood: {
                        "S": DRAGON_DATA_ARR[i_int].location_neighborhood_str
                    },
                    location_state: {
                        "S": DRAGON_DATA_ARR[i_int].location_state_str
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
            "dragon_stats": dragon_formatted_arr.reverse()
        }
    };
    return DDB.batchWriteItem(params).promise();
}
function pushToDragonStatsTableTwo(){
    var 
        dragon = {},
        dragon_formatted_arr = [],
        params = {};

    var DRAGON_DATA_ARR = require("/home/ec2-user/environment/lab3/resources/dragon_stats_two.json");

    for(var i_int = 0; i_int < DRAGON_DATA_ARR.length; i_int += 1){
        dragon = {
            PutRequest: {
                Item: {
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
                    location_city: {
                        "S": DRAGON_DATA_ARR[i_int].location_city_str
                    }, 
                    location_country: {
                        "S": DRAGON_DATA_ARR[i_int].location_country_str
                    },
                    location_neighborhood: {
                        "S": DRAGON_DATA_ARR[i_int].location_neighborhood_str
                    },
                    location_state: {
                        "S": DRAGON_DATA_ARR[i_int].location_state_str
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
            "dragon_stats": dragon_formatted_arr.reverse()
        }
    };
    return DDB.batchWriteItem(params).promise();
}
function pushToDragonCurrentPowerTable(){
    var 
        dragon = {},
        dragon_formatted_arr = [],
        params = {};

    var DRAGON_DATA_ARR = require("/home/ec2-user/environment/lab3/resources/dragon_current_power.json");

    for(var i_int = 0; i_int < DRAGON_DATA_ARR.length; i_int += 1){
        dragon = {
            PutRequest: {
                Item: {
                    current_endurance: {
                        "N": DRAGON_DATA_ARR[i_int].current_endurance_int.toString()
                    },
                    current_will_not_fight_credits: {
                        "N": DRAGON_DATA_ARR[i_int].current_will_not_fight_credits_int.toString()
                    },
                    dragon_name: {
                        "S": DRAGON_DATA_ARR[i_int].dragon_name_str
                    },
                    game_id: {
                        "S": DRAGON_DATA_ARR[i_int].game_id_str
                    }
                }
            }
        };
        dragon_formatted_arr.push(dragon);
    }
    params = {
        RequestItems: {
            "dragon_current_power": dragon_formatted_arr.reverse()
        }
    };
    return DDB.batchWriteItem(params).promise();
}
function pushToDragonBonusAttackTable(){
    var 
        dragon = {},
        dragon_formatted_arr = [],
        params = {};

    var DRAGON_DATA_ARR = require("/home/ec2-user/environment/lab3/resources/dragon_bonus_attack.json");

    for(var i_int = 0; i_int < DRAGON_DATA_ARR.length; i_int += 1){
        dragon = {
            PutRequest: {
                Item: {
                    breath_attack: {
                        "S": DRAGON_DATA_ARR[i_int].breath_attack_str
                    },
                    extra_damage: {
                        "N": DRAGON_DATA_ARR[i_int].extra_damage_int.toString()
                    },
                    description: {
                        "S": DRAGON_DATA_ARR[i_int].description_str
                    },
                    range: {
                        "N": DRAGON_DATA_ARR[i_int].range_int.toString()
                    }
                }
            }
        };
        dragon_formatted_arr.push(dragon);
    }
    params = {
        RequestItems: {
            "dragon_bonus_attack": dragon_formatted_arr.reverse()
        }
    };
    return DDB.batchWriteItem(params).promise();
}
function pushToDragonFamilyTable(){
    var 
        dragon = {},
        dragon_formatted_arr = [],
        params = {};

    var DRAGON_DATA_ARR = require("/home/ec2-user/environment/lab3/resources/dragon_family.json");


    for(var i_int = 0; i_int < DRAGON_DATA_ARR.length; i_int += 1){
        dragon = {
            PutRequest: {
                Item: {
                    breath_attack: {
                        "S": DRAGON_DATA_ARR[i_int].breath_attack_str
                    },
                    damage_modifer: {
                        "N": DRAGON_DATA_ARR[i_int].damage_modifier_int.toString()
                    },
                    description: {
                        "S": DRAGON_DATA_ARR[i_int].description_str
                    },
                    family: {
                        "S": DRAGON_DATA_ARR[i_int].family_str
                    },
                    protection_moodifier_int: {
                        "N": DRAGON_DATA_ARR[i_int].protection_modifier_int.toString()
                    }
                }
            }
        };
        dragon_formatted_arr.push(dragon);
    }
    params = {
        RequestItems: {
            "dragon_family": dragon_formatted_arr.reverse()
        }
    };
    return DDB.batchWriteItem(params).promise();
}

(async function seed(){
    console.time("HowFastWasThat");
    //async 2x speed
    console.log(await Promise.all([
            pushToDragonStatsTableOne(),
            pushToDragonStatsTableTwo(),  
            pushToDragonCurrentPowerTable(),
            pushToDragonBonusAttackTable(),
            pushToDragonFamilyTable()
     ]));
    console.timeEnd("HowFastWasThat");
})();
