/*\
title: $:/ext/modules/filters/samemonth.js
type: application/javascript
module-type: filteroperator

Filter operator that selects tiddlers with a modified date field on the same month as the provided value.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.samemonth = function(source,operator,options) {
	var results = [],
		fieldName = operator.suffix || "modified",
		targetDate = (new Date($tw.utils.parseDate(operator.operand))).getMonth();
	// Function to convert a date/time to a date integer
	source(function(tiddler,title) {
		if(tiddler) {
			if((new Date($tw.utils.parseDate(tiddler.fields[fieldName]))).getMonth() === targetDate) {
				results.push(title);
			}
		}
	});
	return results;
};

})();
