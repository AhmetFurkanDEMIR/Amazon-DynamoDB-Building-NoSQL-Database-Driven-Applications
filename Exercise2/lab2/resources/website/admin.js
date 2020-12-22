//if known as admin session run this
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

console.log("find any dragon on the screen and add edit button");

var
	$dragon_info = $("[data-role='dragon_info']");

function showEditableCards(){
	$dragon_info.attr("data-editable", "editable");
}
function saveEditDragon(){
	var 
		$this = $(this),
		dragon_name_str = $this.parent().parent().find("[data-edit_dragon]").attr("data-edit_dragon");
		// debugger;
	//collect all changes
	console.log("Show working and saving, and save changes to " + dragon_name_str);
	//after the save wokred?
	setTimeout(function(){
		$this.parent().parent().attr("data-editing", "not_editing");
	}, 1000 * 1);
	//then hide edirt
}
function hideEditView(current_edit){
	console.log("hide dragon that was edited");
}
function cancelEditDragon(){
	var 
		$this = $(this),
		dragon_name_str = $this.parent().parent().find("[data-edit_dragon]").attr("data-edit_dragon");
	//clearAllFields
	$this.parent().parent().attr("data-editing", "not_editing");
	//collect all changes
	console.log("Cancel all changes to " + dragon_name_str);
}
function setUpEditHandlers(){
	$(document).on("click", "[data-edit_dragon]", editDragon);
	$(document).on("click", "[data-action='save']", saveEditDragon);
	$(document).on("click", "[data-action='cancel']", cancelEditDragon);
}
function editDragon(){
	var 
		$this = $(this),
		dragon_name_str = $this.attr("data-edit_dragon");
	console.log("You wish to edit " + dragon_name_str);
	$this.parent().parent().attr("data-editing", "editing");
}

(function init(){
	//check LS if claiming they are an admin
	setUpEditHandlers();
	showEditableCards();
})();