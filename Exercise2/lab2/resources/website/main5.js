// requires API_ENDPOINT_URL_STR in window scope
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
	$dragon_name_select = $("[data-role='dragon_name_select']");
	$filter_type = $("[data-role='filter_type']"),
	$dragon_info = $("[data-role='dragon_info']"),
	CDN_STR = "  https://s3.amazonaws.com/awsu-hosting/edx_dynamo/s3/lab3"; 	

function g_ajaxer(url_str, params, ok_cb, fail_cb){
	$.ajax({
		url: url_str,
		type: "POST",
		data: JSON.stringify(params),
		crossDomain: true,
		contentType: "application/json",
		dataType: "json",
		success: ok_cb,
		error: fail_cb,
		timeout: 3000
	});
}
function clearFilter(){
	$dragon_name_select.val("All");
	$dragon_info.html("");
	$dragon_info
		.attr("data-showing", "not_showing")
	$filter_type.text("Showing all dragons");
	//do new search
	postRequest("all");
}
function handleFailure(fe){
	console.log("FAIL");
	if(fe.status === 405){
		$filter_type.text("No API to call");
	}else{
		$filter_type.text("Failed due to CORS");
	}
}
function handleSuccess(data_arr){
	var 
		filter_str = $dragon_name_select.val();
	if(data_arr.length === 0){
		$filter_type.text("No dragon found called " + filter_str.toLowerCase());
		$dragon_info
			.attr("data-showing", "not_showing")
	}
	showDragons(data_arr);
}
function postRequest(dragon_name_str){
	showSearching();
	var params = {
		dragon_name_str: dragon_name_str
	};
	g_ajaxer(window.API_ENDPOINT_URL_STR + "/single", params, handleSuccess, handleFailure);
}
function showDragons(data_arr){
	var 
		html_str = '',
		dragon_name_str = "",
		description_str = "",
		dragon_type_str = "",
		protection_str = "",
		filter_str = $dragon_name_select.val();
	for(var i_int = 0; i_int < data_arr.length; i_int += 1){
		dragon_name_str = data_arr[i_int].dragon_name.S || data_arr[i_int].dragon_name;
		family_str = data_arr[i_int].family.S || data_arr[i_int].family;
		protection_str = data_arr[i_int].protection.N || data_arr[i_int].protection;
		damage_str = data_arr[i_int].damage.N || data_arr[i_int].damage;
		description_str = data_arr[i_int].description.S || data_arr[i_int].description;
		// date_str = new Date(data_arr[i_int].data_found.S).toLocaleDateString();
		html_str += '<article data-family="'+ family_str + '">';
		html_str += 	'<section data-role="card_internals">';
		html_str += 		'<h4>' + dragon_name_str + '</h4>';
		html_str += 		'<span data-role="damage">' + damage_str + '</span>';
		html_str += 		'<span data-role="protection">' + protection_str + '</span>';
		html_str += 		'<figure>';
		html_str += 			'<img alt="This is a picture of ' +  dragon_name_str + ' " src="' + dragon_name_str + '.png" width="300" height="300" />'; 
		html_str += 			'<figcaption>' + description_str + '</figcaption>';
		html_str += 		'</figure>';
		html_str += 	'</section>';
		html_str += '</article>';
	}
	$filter_type.text("Showing " + filter_str);
	$dragon_info
		.attr("data-showing", "showing")
		.append(html_str);
	if(data_arr.length === 0){
		$dragon_info.html('<h6>No dragon called ' + filter_str  + ' found</h6>');
		$filter_type.text("Rut ro...");
	}

}
function showSearching(){
	var 
		filter_str = $dragon_name_select.val();
	$filter_type.text("Searching database for a dragon called " + filter_str);
	$dragon_info.attr("data-showing", "not_showing").html("");
}
function submitDragonName(se){
	se.preventDefault();
	postRequest($dragon_name_select.val());
}

// handlers
$(document).on("change", "[data-action='choose_dragon_by_name']", submitDragonName);


//onm load
postRequest("All");