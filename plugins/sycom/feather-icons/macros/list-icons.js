/*\
title: $:/plugins/sycom/feather-icons/macros/list-icons.js
type: application/javascript
module-type: macro
Macro to output svg icons from feather-icons
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
*/

exports.name = "list-feather-icons";

exports.params = [
	{name: "filter"}
];

/*
Run the macro
*/
exports.run = function(filter) {
	var self = this,
		allIcons = document.getElementById("feather-icons").firstChild.childNodes,
		html = "<div class='presentation'>",
		regFilter = new RegExp("(" + filter + ")","g");
	for (var i in allIcons) {
		if (allIcons[i].id !== undefined && allIcons[i].id.match(regFilter)) {
			html +="<div class='block'><div><svg class='feather x2'><use href='#" + allIcons[i].id + "'/></svg><span class='name'>" + allIcons[i].id +"</span></div></div>";
		}
	}
	html += "</div>"
return html;
};

function quoteAndEscape(value) {
	return "\"" + value.replace(/"/mg,"\"\"") + "\"";
}

})();
