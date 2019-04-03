/*\
title: $:/plugins/sycom/f-awesome/macros/list-icons.js
type: application/javascript
module-type: macro
Macro to output svg icons from f-awesome
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
*/

exports.name = "list-f-awesome";

exports.params = [
	{name: "filter"}
];

/*
Run the macro
*/
exports.run = function(filter) {
	var self = this,
		allIcons = document.getElementById("f-awesome-icons").firstChild.childNodes,
		html = "<div class='presentation'>",
		regFilter = new RegExp("(" + filter + ")","g");
	for (var i in allIcons) {
		if (allIcons[i].id !== undefined && allIcons[i].id.match(regFilter)) {
			html +="<div class='block'><div><svg class='fa x2'><use href='#" + allIcons[i].id + "'/></svg><span class='name'>" + allIcons[i].id +"</span></div></div>";
		}
	}
	html += "</div>"
return html;
};

function quoteAndEscape(value) {
	return "\"" + value.replace(/"/mg,"\"\"") + "\"";
}

})();
