var
    AWS = require("aws-sdk"),
    UUID4 = require("uuid/v4"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    });


var DRAGON_STATS_ARR = [],
    DRAGON_FAMILY_ARR = [],
    DRAGON_BONUS_ARR = [];

function getStats(){
    var 
        params = {
            TableName: "dragon_stats"
        };
    return DDB.scan(params).promise();
}
function getFamily(){
    var 
        params = {
            TableName: "dragon_family"
        };
    return DDB.scan(params).promise();
}
function getBonus(){
    var 
        params = {
            TableName: "dragon_bonus_attack"
        };
    return DDB.scan(params).promise();
}

async function build() {
    for(var i_int = 0; i_int < DRAGON_STATS_ARR.length; i_int += 1){
        var 
            dragon_uuid_str = UUID4(),
            dragon_stats = DRAGON_STATS_ARR[i_int],
            location_str =  dragon_stats.location_country.S + "#" + 
                            dragon_stats.location_state.S + "#" + 
                            dragon_stats.location_city.S + "#" + 
                            dragon_stats.location_neighborhood.S,
            dragon_family = {},
            dragon_bonus = {};
        
        dragon_stats.sk = {
            S: "stats"
        };
        // delete dragon_stats.pk; 
        dragon_stats.pk = {
            S: dragon_uuid_str
        };
        dragon_stats.location = {
            S: location_str
        };
        delete dragon_stats.location_country;
        delete dragon_stats.location_state;
        delete dragon_stats.location_neighborhood;
        delete dragon_stats.location_city;
        for(var j_int = 0; j_int < DRAGON_FAMILY_ARR.length; j_int += 1){
            if(DRAGON_FAMILY_ARR[j_int].family.S === dragon_stats.family.S){
                dragon_family.pk = {
                    S: dragon_uuid_str
                };
                dragon_family.sk = {
                    S: "family"
                };
                dragon_family.breath_attack = DRAGON_FAMILY_ARR[j_int].breath_attack;
                dragon_family.damage_modifier = DRAGON_FAMILY_ARR[j_int].damage_modifier;
                dragon_family.protection_modifier = DRAGON_FAMILY_ARR[j_int].protection_modifier;
                dragon_family.family_description = DRAGON_FAMILY_ARR[j_int].description;
                break;
            }
        }
        for(var k_int = 0; k_int < DRAGON_BONUS_ARR.length; k_int += 1){
            if(DRAGON_BONUS_ARR[k_int].breath_attack.S === dragon_family.breath_attack.S){
                dragon_bonus.pk = {
                    S: dragon_uuid_str
                };
                dragon_bonus.sk = {
                    S: "bonus"
                };
                dragon_bonus.range = DRAGON_BONUS_ARR[k_int].range;
                dragon_bonus.extra_damage = DRAGON_BONUS_ARR[k_int].extra_damage;
                dragon_bonus.bonus_description = DRAGON_BONUS_ARR[k_int].description;
                break;
            }
        }
        await runTransaction(dragon_stats, dragon_family, dragon_bonus);
    }
}
function runTransaction(dragon_stats, dragon_family, dragon_bonus){
    var 
        params = {
            TransactItems: [{
                Put: {
                    Item: dragon_stats,
                    TableName: "improved_single_dragon_table"
                }
            },{
                Put: {
                    Item: dragon_family,
                    TableName: "improved_single_dragon_table"
                }
            },{
                Put: {
                    Item: dragon_bonus,
                    TableName: "improved_single_dragon_table"
                }
            }]
        };
    return DDB.transactWriteItems(params).promise();
}
(async function seed(){
    var stats_response = await getStats();
    DRAGON_STATS_ARR = stats_response.Items;
    var family_response = await getFamily();
    DRAGON_FAMILY_ARR = family_response.Items;
    var bonus_response = await getBonus();
    DRAGON_BONUS_ARR = bonus_response.Items;
    build();
    console.log("seeded");
})();


