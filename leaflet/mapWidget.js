/*\
title: $:/plugins/sycom/leaflet/mapWidget.tid
type: application/javascript
module-type: widget

A widget for displaying leaflet map in TiddlyWiki

\*/

(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget,
    L = require("$:/plugins/sycom/leaflet/lib/leaflet.js");

var mapWidget = function(parseTreeNode,options) {
    this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
mapWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
mapWidget.prototype.render = function(parent,nextSibling) {
	// Compute our attributes
	this.computeAttributes();
	// Get the base settings for rendering : width / height (default : 100% / 500px)
// !todo : make a settings tidller in order to let user set it for the whole wiki (may be inspired from roadtree)
	var width = this.getAttribute("width","100%"),
		height = this.getAttribute("height","500px");
	// creating the div container
	var div = this.document.createElement("div");
	div.setAttribute("id","lfltMap");
	div.setAttribute("style","width:"+width+";height:"+height);
	// Save the parent dom node
	this.parentDomNode = parent;
	// Compute our attributes
	this.computeAttributes();
	// Execute our logic
	this.execute();
	// create the container
	parent.insertBefore(div,nextSibling);
	this.domNodes.push(div);
	// Create the map
	this.createMap();
};

/*
Create the map for the widget
 */
mapWidget.prototype.createMap = function(parent,nextSibling) {
	// !todo : get some parameter for leaflet
	var setting={};
	// !todo : create default parameters for the whole wiki
		setting.lat=this.getAttribute("lat","49.5");
		setting.lg=this.getAttribute("long","1.1");
		setting.zoom=this.getAttribute("zoom","7");
	console.log(setting);
	// !todo : check if there is some data to display or just a map
		
	// create the leaflet and push it to #lfltMap
	var map = L.map('lfltMap').setView([setting.lat,setting.lg],setting.zoom);
	// Installation du fond par défaut (premier de la liste dans fonds.json)
	// get tilelayers from JSON
	var fonds=JSON.parse(this.wiki.getTiddlerText("$:/plugins/sycom/leaflet/lib/tileLayers.json"));
	// create tile layers list object from json list	
	var Tiles=new Array(); 	// leaflet tile layers
	var tiles={};    // tile identifier for control
	// look for tile parameter
		setting.tile=this.getAttribute("tile","osm");
	// remplissage de la liste
	for(var i in fonds) {
		if(i==setting.tile || fonds[i].id==setting.tile) setting.tile=fonds[i].id;
		var couche=new L.TileLayer(fonds[i].url, {
			attribution: fonds[i].attrib,
			minZoom : fonds[i].zMin,
			maxZoom : fonds[i].zMax,
			unloadInvisibleTiles:true
			});
		Tiles[fonds[i].id]=couche;
		tiles[fonds[i].nom]=couche;
		}
	Tiles[setting.tile].addTo(map);
	// install tile layer control if needed
		setting.tileControl=this.getAttribute("tileControl");
	if(setting.tileControl) {
		var tControl=L.control.layers(tiles);
		tControl.addTo(map);
		}
	};

/*
Compute the internal state of the widget
*/
mapWidget.prototype.execute = function() {
	// Get the parameters from the attributes
	this.leaflet = this.getAttribute("leaflet");
	this.data = this.getAttribute("data");
};

exports.leafmap = mapWidget;

})();
