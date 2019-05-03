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
	var allIcons = document.querySelectorAll('#feather-icons > defs symbol, #feather-icons-ext > defs symbol'),
		html = "<div class='presentation'>",
		regFilter = new RegExp("(" + filter + ")","g"),
		iCount = 0;
	for (var i in allIcons) {
		if (allIcons[i].id !== undefined && allIcons[i].id.match(regFilter)) {
			let cls = allIcons[i].parentNode.parentNode.id;
			html +="<div class='" + cls + " block'><div><svg class='feather x2'><use href='#" + allIcons[i].id + "'/></svg><span class='name'>" + allIcons[i].id +"</span></div></div>";
			iCount++;
		}
	}
	var pluriel = ""; if(iCount>1) pluriel ="s";
	html += "</div>";
  html = "<div class='count'>" + iCount + " icon" + pluriel + "</div>" + html;
return html;
};

})();
