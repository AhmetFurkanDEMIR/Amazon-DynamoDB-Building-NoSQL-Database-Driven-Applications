
/*

    SOLUTION

    You cannot just copy and paste this because
    the bucket name will need to be your bucket name

    If you run it "as is" it will not work!

    You must replaace <FMI> with your bucket name

    e.g

    qls-137408-c11c1a21378cefb1-s3bucket-1po51sid5ipg4

    Keeo the quotes in there below, and literally just 
    replace the characters <FMI>

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
    S3API = new AWS.S3({
        apiVersion: "2006-03-01",
        region: "us-east-1"
    }),
    FS = require("fs"),
    bucket_name_str = "<FMI>";


function uploadItemAsBinary(key_name_str, content_type_str, bin){
    var params = {
        Bucket: bucket_name_str,
        Key: key_name_str,
        Body: bin,
        ContentType: content_type_str,
        CacheControl: "max-age=0"
    };
    S3API.putObject(params, function(error, data){
        console.log(error, data);
    });
}

(function init(){
    var config_bin = FS.readFileSync("website/config.js");
    uploadItemAsBinary("config.js", "application/javascript", config_bin);

    var jquery_js_bin = FS.readFileSync("website/jquery-3.4.0.min.js");
    uploadItemAsBinary("jquery-3.4.0.min.js", "application/javascript", jquery_js_bin);

    var sparky_bin = FS.readFileSync("website/images/sparky.png");
    uploadItemAsBinary("sparky.png", "image/png", sparky_bin);

    var tallie_bin = FS.readFileSync("website/images/tallie.png");
    uploadItemAsBinary("tallie.png", "image/png", tallie_bin);

    var index_html_bin = FS.readFileSync("website/index.html");
    uploadItemAsBinary("index.html", "text/html", index_html_bin);

    var main_css_bin = FS.readFileSync("website/main.css");
    uploadItemAsBinary("main.css", "text/css", main_css_bin);
        
    var main_js_bin = FS.readFileSync("website/main.js");
    uploadItemAsBinary("main.js", "application/javascript", main_js_bin);

    var index_2_html_bin = FS.readFileSync("website/index2.html");
    uploadItemAsBinary("index2.html", "text/html", index_2_html_bin);

    var main_2_css_bin = FS.readFileSync("website/main2.css");
    uploadItemAsBinary("main2.css", "text/css", main_2_css_bin);

    var main_2_js_bin = FS.readFileSync("website/main2.js");
    uploadItemAsBinary("main2.js", "application/javascript", main_2_js_bin);

    var index_3_html_bin = FS.readFileSync("website/index3.html");
    uploadItemAsBinary("index3.html", "text/html", index_3_html_bin);

    var main_3_js_bin = FS.readFileSync("website/main3.js");
    uploadItemAsBinary("main3.js", "application/javascript", main_3_js_bin);

    var main_3_css_bin = FS.readFileSync("website/main3.css");
    uploadItemAsBinary("main3.css", "text/css", main_3_css_bin);

    var index_4_html_bin = FS.readFileSync("website/index4.html");
    uploadItemAsBinary("index4.html", "text/html", index_4_html_bin);

    var main_4_js_bin = FS.readFileSync("website/main4.js");
    uploadItemAsBinary("main4.js", "application/javascript", main_4_js_bin);

    var main_4_css_bin = FS.readFileSync("website/main4.css");
    uploadItemAsBinary("main4.css", "text/css", main_4_css_bin);

    var index_5_html_bin = FS.readFileSync("website/index5.html");
    uploadItemAsBinary("index5.html", "text/html", index_5_html_bin);

    var main_5_js_bin = FS.readFileSync("website/main5.js");
    uploadItemAsBinary("main5.js", "application/javascript", main_5_js_bin);

    var main_5_css_bin = FS.readFileSync("website/main5.css");
    uploadItemAsBinary("main5.css", "text/css", main_5_css_bin);


    //Mary's dragins for a future lab

    var Amaron_bin = FS.readFileSync("website/images/Amaron.png");
    uploadItemAsBinary("Amaron.png", "image/png", Amaron_bin);

    var Atlas_bin = FS.readFileSync("website/images/Atlas.png");
    uploadItemAsBinary("Atlas.png", "image/png", Atlas_bin);

    var Bahamethut_bin = FS.readFileSync("website/images/Bahamethut.png");
    uploadItemAsBinary("Bahamethut.png", "image/png", Bahamethut_bin);

    var Blackhole_bin = FS.readFileSync("website/images/Blackhole.png");
    uploadItemAsBinary("Blackhole.png", "image/png", Blackhole_bin);

    var Cassidiuma_bin = FS.readFileSync("website/images/Cassidiuma.png");
    uploadItemAsBinary("Cassidiuma.png", "image/png", Cassidiuma_bin);

    var Castral_bin = FS.readFileSync("website/images/Castral.png");
    uploadItemAsBinary("Castral.png", "image/png", Castral_bin);

    var Crimson_bin = FS.readFileSync("website/images/Crimson.png");
    uploadItemAsBinary("Crimson.png", "image/png", Crimson_bin);

    var Dexler_bin = FS.readFileSync("website/images/Dexler.png");
    uploadItemAsBinary("Dexler.png", "image/png", Dexler_bin);
    
    var Eislex_bin = FS.readFileSync("website/images/Eislex.png");
    uploadItemAsBinary("Eislex.png", "image/png", Eislex_bin);

    var Fireball_bin = FS.readFileSync("website/images/Fireball.png");
    uploadItemAsBinary("Fireball.png", "image/png", Fireball_bin);

    var Firestorm_bin = FS.readFileSync("website/images/Firestorm.png");
    uploadItemAsBinary("Firestorm.png", "image/png", Firestorm_bin);

    var Frealu_bin = FS.readFileSync("website/images/Frealu.png");
    uploadItemAsBinary("Frealu.png", "image/png", Frealu_bin);

    var Frost_bin = FS.readFileSync("website/images/Frost.png");
    uploadItemAsBinary("Frost.png", "image/png", Frost_bin);

    var Galadi_bin = FS.readFileSync("website/images/Galadi.png");
    uploadItemAsBinary("Galadi.png", "image/png", Galadi_bin);

    var Havarth_bin = FS.readFileSync("website/images/Havarth.png");
    uploadItemAsBinary("Havarth.png", "image/png", Havarth_bin);

    var Herma_bin = FS.readFileSync("website/images/Herma.png");
    uploadItemAsBinary("Herma.png", "image/png", Herma_bin);

    var Hydraysha_bin = FS.readFileSync("website/images/Hydraysha.png");
    uploadItemAsBinary("Hydraysha.png", "image/png", Hydraysha_bin);

    var Isilier_bin = FS.readFileSync("website/images/Isilier.png");
    uploadItemAsBinary("Isilier.png", "image/png", Isilier_bin);

    var Jerichombur_bin = FS.readFileSync("website/images/Jerichombur.png");
    uploadItemAsBinary("Jerichombur.png", "image/png", Jerichombur_bin);

    var Languatha_bin = FS.readFileSync("website/images/Languatha.png");
    uploadItemAsBinary("Languatha.png", "image/png", Languatha_bin);

    var Longlu_bin = FS.readFileSync("website/images/Longlu.png");
    uploadItemAsBinary("Longlu.png", "image/png", Longlu_bin);
    
    var Lucian_bin = FS.readFileSync("website/images/Lucian.png");
    uploadItemAsBinary("Lucian.png", "image/png", Lucian_bin);

    var Magnum_bin = FS.readFileSync("website/images/Magnum.png");
    uploadItemAsBinary("Magnum.png", "image/png", Magnum_bin);

    var Midnight_bin = FS.readFileSync("website/images/Midnight.png");
    uploadItemAsBinary("Midnight.png", "image/png", Midnight_bin);

    var Mino_bin = FS.readFileSync("website/images/Mino.png");
    uploadItemAsBinary("Mino.png", "image/png", Mino_bin);

    var Nightingale_bin = FS.readFileSync("website/images/Nightingale.png");
    uploadItemAsBinary("Nightingale.png", "image/png", Nightingale_bin);

    var Norslo_bin = FS.readFileSync("website/images/Norslo.png");
    uploadItemAsBinary("Norslo.png", "image/png", Norslo_bin);

    var Omnitrek_bin = FS.readFileSync("website/images/Omnitrek.png");
    uploadItemAsBinary("Omnitrek.png", "image/png", Omnitrek_bin);
    
    var Pradumo_bin = FS.readFileSync("website/images/Pradumo.png");
    uploadItemAsBinary("Pradumo.png", "image/png", Pradumo_bin);

    var Protheus_bin = FS.readFileSync("website/images/Protheus.png");
    uploadItemAsBinary("Protheus.png", "image/png", Protheus_bin);

    var Prythus_bin = FS.readFileSync("website/images/Prythus.png");
    uploadItemAsBinary("Prythus.png", "image/png", Prythus_bin);

    var Ragnorl_bin = FS.readFileSync("website/images/Ragnorl.png");
    uploadItemAsBinary("Ragnorl.png", "image/png", Ragnorl_bin);

    var Restula_bin = FS.readFileSync("website/images/Restula.png");
    uploadItemAsBinary("Restula.png", "image/png", Restula_bin);

    var Ruby_bin = FS.readFileSync("website/images/Ruby.png");
    uploadItemAsBinary("Ruby.png", "image/png", Ruby_bin);

    var Samurilio_bin = FS.readFileSync("website/images/Samurilio.png");
    uploadItemAsBinary("Samurilio.png", "image/png", Samurilio_bin);

    var Shadow_bin = FS.readFileSync("website/images/Shadow.png");
    uploadItemAsBinary("Shadow.png", "image/png", Shadow_bin);

    var Sheblonguh_bin = FS.readFileSync("website/images/Sheblonguh.png");
    uploadItemAsBinary("Sheblonguh.png", "image/png", Sheblonguh_bin);

    var Shulmi_bin = FS.readFileSync("website/images/Shulmi.png");
    uploadItemAsBinary("Shulmi.png", "image/png", Shulmi_bin);
    
    var Smolder_bin = FS.readFileSync("website/images/Smolder.png");
    uploadItemAsBinary("Smolder.png", "image/png", Smolder_bin);

    var Sonic_bin = FS.readFileSync("website/images/Sonic.png");
    uploadItemAsBinary("Sonic.png", "image/png", Sonic_bin);

    var Sprinkles_bin = FS.readFileSync("website/images/Sprinkles.png");
    uploadItemAsBinary("Sprinkles.png", "image/png", Sprinkles_bin);

    var Sukola_bin = FS.readFileSync("website/images/Sukola.png");
    uploadItemAsBinary("Sukola.png", "image/png", Sukola_bin);
    
    var Tagnaurak_bin = FS.readFileSync("website/images/Tagnaurak.png");
    uploadItemAsBinary("Tagnaurak.png", "image/png", Tagnaurak_bin);

    var Tornado_bin = FS.readFileSync("website/images/Tornado.png");
    uploadItemAsBinary("Tornado.png", "image/png", Tornado_bin);

    var Treklor_bin = FS.readFileSync("website/images/Treklor.png");
    uploadItemAsBinary("Treklor.png", "image/png", Treklor_bin);

    var Warcumer_bin = FS.readFileSync("website/images/Warcumer.png");
    uploadItemAsBinary("Warcumer.png", "image/png", Warcumer_bin);

    var Xanya_bin = FS.readFileSync("website/images/Xanya.png");
    uploadItemAsBinary("Xanya.png", "image/png", Xanya_bin);

    var Yuxo_bin = FS.readFileSync("website/images/Yuxo.png");
    uploadItemAsBinary("Yuxo.png", "image/png", Yuxo_bin);
})();





