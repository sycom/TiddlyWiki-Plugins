/*\
title: $:/ext/modules/filters/eachyear.js
type: application/javascript
module-type: filteroperator

Filter operator that selects one tiddler for each unique year covered by the specified date field

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.eachyear = function(source,operator,options) {
	var results = [],
		values = [],
		fieldName = operator.operand || "modified";
	// Function to convert a date/time to a date integer
	var toDate = function(value) {
		value = (new Date(value)).getFullYear();
		return value+0;
	};
	source(function(tiddler,title) {
		if(tiddler && tiddler.fields[fieldName]) {
			var value = toDate($tw.utils.parseDate(tiddler.fields[fieldName]));
			if(values.indexOf(value) === -1) {
				values.push(value);
				results.push(title);
			}
		}
	});
	return results;
};

})();
