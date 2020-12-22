/*

    SOLUTION

    You cannot just copy and paste this because
    the bucket name will need to be your bucket name

    If you run it "as is" it will not work!

    You must replaace <FMI> with your bucket name

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
    var 
        file_path_str = "/home/ec2-user/environment/lab2/resources/website/",
        file_name_str = "config.js",
        config_bin = FS.readFileSync(file_path_str + file_name_str);
    uploadItemAsBinary(file_name_str, "text/javascript", config_bin);
})();

