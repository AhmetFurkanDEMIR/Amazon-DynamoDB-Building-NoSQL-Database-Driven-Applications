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
	$dragon_name_select = $("[data-role='dragon_name_select']"),
	$filter_type = $("[data-role='filter_type']"),
	$dragon_info = $("[data-role='dragon_info']"),
	$email_address = $("[data-role='email_address']"),
	$error_message = $("[data-role='error_message']"),
	$logout = $("[data-action='logout']"),
	$attempted_password = $("[data-role='attempted_password']"),
	CDN_STR = "https://s3.amazonaws.com/awsu-hosting/edx_dynamo/s3/lab3",
	$body = $("body");


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
	if(data.admin_boo){
		localStorage.setItem("admin_boo_str", data.admin_boo.toString());
		$body.attr("data-editable", "editable");
	}else{
		$body.removeAttr("data-editable");
	}
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
	// if(window.NEW_API_ENDPOINT_URL_STR === undefined){
	// 	handleFailure({status: 405});
	// }
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
		dragon_name_str = data_arr[i_int].dragon_name.S || data_arr[i_int].dragon_name; //needed if we user ruby sdk
		family_str = data_arr[i_int].family.S || data_arr[i_int].family;
		protection_int = data_arr[i_int].protection.N || data_arr[i_int].protection;
		damage_int = data_arr[i_int].damage.N || data_arr[i_int].damage;
		description_str = data_arr[i_int].description.S || data_arr[i_int].description;
		// date_str = new Date(data_arr[i_int].data_found.S).toLocaleDateString();
		html_str += '<section data-role="card_wrapper">';
		html_str += 	'<article data-face="back">';
		html_str += 		'<span data-action="save">';
		html_str += 			'<i class="material-icons">save</i>';
		html_str += 		'</span>';
		html_str +=			'<span data-action="cancel">';
		html_str += 			'<i class="material-icons">cancel</i>';
		html_str += 		'</span>';
		html_str += 		'<h3 data-original_dragon_name="' + dragon_name_str + '" contenteditable="true">' + dragon_name_str + '</h3>';
		html_str += 		'<p data-original_description="' + description_str + '" contenteditable="true">' + description_str + '</p>';
		html_str += 		'<label>damage</label>';
		html_str += 		'<input data-original_damage="' + damage_int.toString() + '" type="range" min="1" max="10" value="' + damage_int.toString() + '">';
		html_str += 		'<label>protection</label>';
		html_str += 		'<input data-original_protection="' + protection_int.toString() + '" type="range" min="1" max="10" value="' + protection_int.toString() + '">';
		html_str += 	'</article>';
		html_str += 	'<article data-face="front" data-family="'+ family_str + '">';
		html_str += 		'<span data-edit_dragon="' + dragon_name_str + '">';
		html_str += 			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
		html_str += 		'</span>';
		html_str += 		'<section data-role="card_internals">';
		html_str += 			'<h4 data-role="dragon_name">' + dragon_name_str + '</h4>';
		html_str += 			'<span data-role="damage">' + damage_int.toString() + '</span>';
		html_str += 			'<span data-role="protection">' + protection_int.toString() + '</span>';
		html_str += 			'<figure>';
									//we do not change the picture the original data is hard coded to the pngs name
									//in prod you would trigger lambda to rename the image in s3
									//as we are using a CDN for the images that we host (to save the student uploading files), we can;t ddo this.
		html_str += 			'<img alt="This is a picture of ' +  dragon_name_str + ' " src="' + dragon_name_str + '.png" width="300" height="300" />'; 
		
		html_str += 				'<figcaption data-role="description">' + description_str + '</figcaption>';
		html_str += 			'</figure>';
		html_str += 		'</section>';
		html_str += 	'</article>';
		html_str += '</section>';
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
function saveEditDragon(){
	// debugger;
	var 
		$this = $(this),
		// $other = $this.parent().parent().find("[data-face='front']"),
		// $dragon_article = $this.parent().parent().children();
		$dragon_article = $this.parent().parent().find("[data-face='back']"),
		params = constructEditPayload($dragon_article);
	console.log(params);
	g_ajaxer(window.API_ENDPOINT_URL_STR + "/edit", params, function(data){
		successfulEdit($this, data);
	}, failEdit);
}

function failEdit(err){
	console.log("error:", err);
}
function successfulEdit($this, data){
	var
		$dragon_article = $this.parent().parent().find("[data-face='back']"),
		$other = $this.parent().parent().find("[data-face='front']");

	if(data.protection){
		$dragon_article.children("[data-original_protection]")
				.attr("data-original_protection", data.protection.N.toString())
				.val(data.protection.N.toString());
		$other.find("[data-role='protection']").text(data.protection.N.toString());
	}
	if(data.damage){
		$dragon_article.children("[data-original_damage]")
				.attr("data-original_damage", data.damage.N.toString())
				.val(data.damage.N.toString());
		$other.find("[data-role='damage']").text(data.damage.N.toString());
	}
	if(data.description){
		$dragon_article.children("[data-original_description]")
				.attr("data-original_description", data.description.S)
				.text(data.description.S);
		$other.find("[data-role='description']").text(data.description.S);
	}
	if(data.dragon_name){
		var old_name_str = $dragon_article.children("[data-original_dragon_name]")
				.attr("data-original_dragon_name");
		$dragon_article.children("[data-original_dragon_name]")
				.attr("data-original_dragon_name", data.dragon_name.S)
				.text(data.dragon_name.S);
		//debugger;
		$other.find("[data-edit_dragon]").attr("data-edit_dragon", data.dragon_name.S);
		$other.find("[data-role='dragon_name']").text(data.dragon_name.S);
		//remove from drop down
		dropDownDragonSwap(old_name_str, data.dragon_name.S);
	}
	//editt card front
	$this.parent().parent().attr("data-editing", "not_editing");
		
}

function dropDownDragonSwap(old_str, new_str){
	$dragon_name_select.find('[value="' + old_str + '"]').val(new_str).text(new_str);
}

function constructEditPayload($dragon_article){

	var
		params = {},
		new_protection_int = Number($dragon_article.children("[data-original_protection]").val()),
		new_damage_int = Number($dragon_article.children("[data-original_damage]").val()),
		new_description_str = $dragon_article.children("[data-original_description]").text(),
		new_dragon_name_str = $dragon_article.children("[data-original_dragon_name]").text(),
		original_protection_int = Number($dragon_article.children("[data-original_protection]").attr("data-original_protection")),
		original_damage_int = Number($dragon_article.children("[data-original_damage]").attr("data-original_damage")),
		original_description_str = $dragon_article.children("[data-original_description]").attr("data-original_description"),
		original_dragon_name_str = $dragon_article.children("[data-original_dragon_name]").attr("data-original_dragon_name");

	params.updates = {};

	if(original_dragon_name_str !== new_dragon_name_str){
		params.updates.dragon_name_str = new_dragon_name_str;
	}

	if(original_description_str !== new_description_str){
		params.updates.description_str = new_description_str;
	}

	if(original_damage_int !== new_damage_int){
		params.updates.damage_int = new_damage_int;
	}
	if(original_protection_int !== new_protection_int){
		params.updates.protection_int = new_protection_int;
	}

	params.user_name_str = localStorage.getItem("user_name_str");
	params.session_id_str = localStorage.getItem("session_id_str");
	params.original_dragon_name_str = original_dragon_name_str;


	return params;
	// body...
}
// function hideEditView(current_edit){
// 	console.log("hide dragon that was edited");
// }
function cancelEditDragon(){
	var 
		$this = $(this),
		dragon_name_str = $this.parent().parent().find("[data-edit_dragon]").attr("data-edit_dragon");
	//clearAllFields
	$this.parent().parent().attr("data-editing", "not_editing");
	//collect all changes
	console.log("Cancel all changes to " + dragon_name_str);
	//maybe refill with data?
}
function editDragon(){
	var 
		$this = $(this),
		dragon_name_str = $this.attr("data-edit_dragon");
	console.log("You wish to edit " + dragon_name_str);
	$this.parent().parent().attr("data-editing", "editing");
}





// handlers
$(document).on("change", "[data-action='choose_dragon_by_name']", submitDragonName);

$(document).on("submit", "[data-role='login_form']", submitLogin);

$(document).on("click", "[data-action='logout']", logout);

$(document).on("click", "[data-edit_dragon]", editDragon);
$(document).on("click", "[data-action='save']", saveEditDragon);
$(document).on("click", "[data-action='cancel']", cancelEditDragon);

if(localStorage.getItem("user_name_str") !== null){
	showLogoutButton(localStorage.getItem("user_name_str"));
	if(localStorage.getItem("admin_boo_str") !== null){
		$body.attr("data-editable", "editable");
	}
	hideLogInScreen();
	postRequest("All");
}

//onm load
// postRequest("All");