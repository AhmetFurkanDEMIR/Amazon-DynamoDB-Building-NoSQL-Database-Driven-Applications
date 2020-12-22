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
	$email_address = $("[data-role='email_address']"),
	$error_message = $("[data-role='error_message']"),
	$logout = $("[data-action='logout']"),
	$attempted_password = $("[data-role='attempted_password']"),
	CDN_STR = "https://s3.amazonaws.com/awsu-hosting/edx_dynamo/s3/lab3"; 	

function logout(){
	localStorage.clear();
	clearDragons();
}
function showLogoutButton(user_name_str){
	$logout.attr("data-showing", "showing").text("logout " + user_name_str)
}
function showErrorMessage(message_str){
	$error_message.text(message_str).attr("data-showing", "showing");
}
function hideErrorMessage(){
	$error_message.text("").attr("data-showing", "not_showing");
}
function hideLogInScreen(){
	$("[data-role='login_screen']").attr("data-showing", "not_showing");
}
function clearDragons(){
	location.reload();
}
function showLoginScreen(){
	logout();
}
function handleSuccessfulLogin(data){
	if(data.errorMessage){
		return handleFailedLogin(data);
	}
	localStorage.setItem("session_id_str", data.session_id_str);
	localStorage.setItem("user_name_str", data.user_name_str);
	postRequest("All");
	showLogoutButton(localStorage.getItem("user_name_str"));
	hideLogInScreen();
}
function handleFailedLogin(data){
	if(data.errorMessage === "password does not match email"){
		showErrorMessage("password does not match email");
	}else if(data.errorMessage === "credentials invalid"){
		showErrorMessage("credentials invalid");
	}else{
		showErrorMessage("unknown error");
	}
}
function submitLogin(se){
	se.preventDefault();
	hideErrorMessage();
	var 
		email_address_str = $email_address.val(),
		attempted_password_str = $attempted_password.val();
	if(email_address_str && attempted_password_str){
		login(email_address_str, attempted_password_str);
	}else{
		showErrorMessage("Password and email cannot be blank");
	}
}
function login(email_address_str, attempted_password_str){
	var 
		params = {
			attempted_password_str: attempted_password_str,
			email_address_str: email_address_str
		};
	g_ajaxer(window.API_ENDPOINT_URL_STR + "/login", params, handleSuccessfulLogin, handleFailedLogin, false);
}

function g_ajaxer(url_str, params, ok_cb, fail_cb, with_cred_boo){
	if(with_cred_boo === true){
		params.session_id_str = localStorage.getItem("session_id_str");
		params.user_name_str = localStorage.getItem("user_name_str");
		//no nee4d to pass admin falg this is validated at the server
	}else{

	}
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
	if(data_arr.errorMessage === "nope"){
		showErrorMessage("credentials invalid");
		setTimeout(function(){
			showLoginScreen();
		}, 1000* 1.65);
		return;
	}
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
	g_ajaxer(window.API_ENDPOINT_URL_STR, params, handleSuccess, handleFailure, true);
}
function showDragons(data_arr){
	var 
		html_str = '',
		dragon_name_str = "",
		description_str = "",
		dragon_type_str = "",
		protection_str = "",
		// date_str = "",



// 	damage: {N: "9"}
// dragon_name: {S: "Cassidiuma"}
// family: {S: "red"}
// protection: {N: "3"}

	
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
	//validate todo
	postRequest($dragon_name_select.val());
}

// handlers
$(document).on("change", "[data-action='choose_dragon_by_name']", submitDragonName);

$(document).on("submit", "[data-role='login_form']", submitLogin);

$(document).on("click", "[data-action='logout']", logout);
if(localStorage.getItem("user_name_str")){
	showLogoutButton(localStorage.getItem("user_name_str"));
	hideLogInScreen();
	postRequest("All");
}

//onm load
// postRequest("All");