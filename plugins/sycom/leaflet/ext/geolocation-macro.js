/*\
title: macros/sycom/geolocation.js
type: application/javascript
module-type: macro

\*/
(function () {
    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";
console.log(this);
    exports.name = "geoLoc";
    exports.params = [
        { name: "text" },
        { name: "tiddler" },
        { name: "icon", default: "$:/core/images/globe" },
        { name: "accuracy", default: 1000 },
        { name: "type" , default: "point" }
        ]; // some not used for now. Will enable tiddler destination + point / line / polygon choice + accuracy (+geo format - json ...?)
    
    exports.run = function(text, tiddler, icon, accuracy, type) {
        var this_tiddler = this.getVariable("currentTiddler");
        tiddler = tiddler || this_tiddler;
        // if tiddler parameter is not given, current tiddler is the target
//        if (tiddler == "" || tiddler == null || tiddler === undefined) tiddler = this_tiddler;
		/* create the button */
        var buttonContent;
		// if text parameter, will use it for the button
        if (text) {
            buttonContent = text;
        } else {
        // if not, looking for an icon
        /* !todo: ?question: should the icon depend on "type" parameter? */
            buttonContent = $tw.wiki.getTiddler(icon).fields.text;
        }
        var geoButton = document.createElement("button");
        geoButton.innerHTML = buttonContent;
		geoButton.param = {"tiddler": tiddler};
        geoButton.addEventListener("click", function() {
			getLocation(tiddler, accuracy, type) 				
            }, false);
        //if(this.parentDomNode.childNodes) this.parentDomNode(geoButton);
    }
    
    function getLocation(tiddler, accuracy, type) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    // success callback
                    function(position) {
                        setPosition(position, tiddler, accuracy, type);
                    },
                    // error callback
                    function(error) {
                        noLocation(error.message + ". You may not are connected via httpS://")
                    } 
				);
            } else {
				noLocation("position disabled or not supported by your browser");     
        }
    }

    function noLocation(message) {
        /* !todo: ?question: replace by "modal" alert? */
        // create or update a temporary message tiddler 
        $tw.wiki.setText("$:/temp/noLocationMessage","text",null,"geolocation access denied: " + message,null);
        // displays it in modal
        $tw.modal.display("$:/temp/noLocationMessage");
    }
    
    function setPosition(position, tiddler, accuracy, type) {
    /* to replace by field populating (point(s) polyline(s) or polygon(s)) */
	/* default : if tiddler has point field, will create a points field to store new data;
		if tiddler has points field, will add a new point to the tiddler field;	*/
console.log( "Lat: " + position.coords.latitude + " - Long: " + position.coords.longitude);
		var newPoint = position.coords.latitude + "," + position.coords.longitude;
	/* check if tiddler has a geofield */
		var track = "";
		var flds = $tw.wiki.getTiddler(tiddler).fields
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
        /* !todo: tells the user the point "x,y" has been added to "type" in "tiddler" */
	}
    
    })();