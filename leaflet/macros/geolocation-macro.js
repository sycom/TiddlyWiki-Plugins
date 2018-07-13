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
            var tiddler = this.getVariable("currentTiddler")
        }
        var buttonContent;
        if (text) {
            buttonContent = text;
        } else {
            buttonContent = this.wiki.getTiddler(icon).fields.text;
        }
        var geoButton = document.createElement("button");
        geoButton.innerHTML = buttonContent;
        geoButton.addEventListener("click",getLocation);
        this.parentDomNode.append(geoButton);
    }
    
    function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(setPosition);
            } else { 
                /* replace by "modal" alert?
    x.innerHTML = "Geolocation is not supported by this browser.";*/
                console.log("geolocation access denied or not supported by browser");        
        }
    }
    
    function setPosition(position) {
    /* to replace by field populating (point(s) polyline(s) or polygon(s)) */
           console.log( "Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude);
    }
    
    })();