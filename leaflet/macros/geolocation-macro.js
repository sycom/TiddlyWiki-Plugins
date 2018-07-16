/*\
title: macros/sycom/geolocation.js
type: application/javascript
module-type: macro

\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";
    
    exports.name = "geoLoc";
    exports.params = [
        { name: "text" },
        { name: "tiddler" },
        { name: "icon", default: "$:/core/images/globe" },
        { name: "accuracy", default: 1000 },
        { name: "type" , default: "point" }
        ]; // some not used for now. Will enable tiddler destination + point / line / polygon choice + accuracy (+geo format - json ...?)
    
    exports.run = function(text, tiddler, icon, accuracy, type) {
        if (!tiddler) {
            var tiddler = this.getVariable("currentTiddler");
        }
		/* create the button */
        var buttonContent;
		// if text parameter, will use it for the button
        if (text) {
            buttonContent = text;
        } else {
		// if not, looking for an icon
            buttonContent = $tw.wiki.getTiddler(icon).fields.text;
        }
        var geoButton = document.createElement("button");
        geoButton.innerHTML = buttonContent;
		geoButton.param = {"tiddler": tiddler};
        geoButton.addEventListener("click", function() {
			getLocation(tiddler, accuracy, type) 				
			}, false);
        this.parentDomNode.append(geoButton);
    }
    
    function getLocation(tiddler, accuracy, type) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
					setPosition(position, tiddler, accuracy, type);
				});
            } else { 
                /* !todo: ?question: replace by "modal" alert? */
				$tw.utils.error("geolocation access denied or not supported by browser :" + error);     
        }
    }
    
    function setPosition(position, tiddler, accuracy, type) {
    /* to replace by field populating (point(s) polyline(s) or polygon(s)) */
	/* default : if tiddler has point field, will create a points field to store new data;
		if tiddler has points field, will add a new point to the tiddler field;	*/
console.log( "Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude);
		var newPoint = position.coords.latitude + "," + position.coords.longitude;
	/* check if tiddler has a geofield */
		var track = "";
		var flds = $tw.wiki.getTiddler(tiddler).fields
console.log(flds);
		if(flds.points) {
			track = flds.points;
			$tw.wiki.setText(tiddler,"points",null,track + " " + newPoint,null);
		}
		else {
			if(flds.point && flds.point!== null) {
				track = flds.point;
				$tw.wiki.setText(tiddler,"points",null,track + " " + newPoint,null);
				$tw.wiki.setText(tiddler,"point",null,null,null);
			} else $tw.wiki.setText(tiddler,"point",null,newPoint,null);	
		}
	}
    
    })();