/*\
title: $:/plugins/sycom/leaflet/mapWidget.tid
type: application/javascript
module-type: widget

A widget for displaying leaflet map in TiddlyWiki

\*/

(function() {
    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";
    var Widget = require("$:/core/modules/widgets/widget.js").widget,
        L = require("$:/plugins/sycom/leaflet/lib/leaflet.js");

    var mapWidget = function(parseTreeNode, options) {
        this.initialise(parseTreeNode, options);
    };

    // global vars
    var Map = [], // map collection
        map = 0, // map order number
        lfltDefBounds = [[52.75,-2.55],[52.85,-2.65]], // default bounds when nothing given
        lfltIcon, bounds, setting = {};


    /*
Inherit from the base widget class
*/
    mapWidget.prototype = new Widget();

    /*
Render this widget into the DOM
*/
    mapWidget.prototype.render = function(parent, nextSibling) {
        bounds = null;
        // Compute our attributes
        this.computeAttributes();
        // Get the base settings for rendering : width / height (default : 100% / 500px)
        // !todo : make a settings tidller in order to let user set it for the whole wiki (may be inspired from roadtree)
        var width = this.getAttribute("width", "100%"),
            height = this.getAttribute("height", "420px");
        // creating the div container
        var div = this.document.createElement("div");
        div.setAttribute("id", "lfltMap-"+map);
        div.setAttribute("style", "width:" + width + ";height:" + height);
        // Save the parent dom node
        this.parentDomNode = parent;
        // Compute our attributes
        this.computeAttributes();
        // create the container
        parent.insertBefore(div, nextSibling);
        this.domNodes.push(div);
        // Create the map
        this.createMap();
        // Execute our logic
        this.execute();
        // increment map number indicator
        map += 1;
    };

    /*
Create the map for the widget
 */
    mapWidget.prototype.createMap = function(parent, nextSibling) {
        // create the leaflet and push it to #lfltMap
        Map[map] = L.map('lfltMap-'+map);
        // Install base tile layer (if none provided, default is "osm")
        // get tilelayers from JSON
        var fonds = JSON.parse(this.wiki.getTiddlerText("$:/plugins/sycom/leaflet/lib/tileLayers.json"));
        // create tile layers list object from json list
        var Tiles = []; // leaflet tile layers
        var tiles = {}; // tile identifier for control
        // look for tile parameter
        setting.tile = this.getAttribute("tile", "osm");
        // create tile layer list
        for (var i in fonds) {
            if (i == setting.tile || fonds[i].id == setting.tile) {
                setting.tile = fonds[i].id;
            }
            var couche = new L.TileLayer(fonds[i].url, {
                attribution: fonds[i].attrib,
                minZoom: fonds[i].zMin,
                maxZoom: fonds[i].zMax,
                unloadInvisibleTiles: true
            });
            Tiles[fonds[i].id] = couche;
            tiles[fonds[i].nom] = couche;
        }
        // if user entered a wrong tile id
        if(Tiles[setting.tile] == undefined) {
            setting.tile = "osm";
            $tw.utils.error("Seems you entered a wrong tile id, displayed osm instead. Please refer to plugin documentation to avoid this.");
        }
        Tiles[setting.tile].addTo(Map[map]);
        // install tile layer control if needed
        setting.tileControl = this.getAttribute("tileControl");
        if (setting.tileControl) {
            var tControl = L.control.layers(tiles);
            tControl.addTo(Map[map]);
        }
/* !todo to come next (will have to implement leaflet.draw extension)
		// look for draw parameter
		setting.drawControl = this.getAttribute("drawControl");
		if (setting.drawControl) {
			// Initialize the FeatureGroup to store editable layers
			var drawnItems = new L.FeatureGroup();
			Map[map].addLayer(drawnItems);
			// Initialize the draw control and pass it the FeatureGroup of editable layers
			var drawControl = new L.Control.Draw({
				edit: {
					featureGroup: drawnItems
					}
				}
			);
		Map[map].addControl(drawControl);
		}
*/
    };

    /*
Compute the internal state of the widget
*/
    mapWidget.prototype.execute = function() {
        var icone = escape(this.wiki.getTiddlerText("pin.svg"));
        var shadow = escape(this.wiki.getTiddlerText("pinshadow.svg"));
        var iconUrl = 'data:image/svg+xml;charset=UTF-8,'+icone;
        var shadowUrl = 'data:image/svg+xml;charset=UTF-8,'+shadow;
        // create icon !todo only if there are points to display;
        lfltIcon = L.icon({
            iconUrl: iconUrl,
            iconRetinaUrl: iconUrl,
            iconSize: [30.5, 43],
            iconAnchor: [15.25, 43],
            popupAnchor: [0, -43],
            shadowUrl: shadowUrl,
            shadowRetinaUrl: shadowUrl,
            shadowSize: [101, 45],
            shadowAnchor: [15.25, 45]
        });
        L.icon.default = lfltIcon;
		// Get the declared places from the attributes
        var places = this.getAttribute("places", undefined);
        if (places) {
            //console.log(places);
            var plcs = JSON.parse(places);
            // case 1 : data in a tiddler
            if (plcs.tiddler) {
console.log("leafmap (" + map + ") > displays a tiddler : " + plcs.tiddler);
            // if no tiddler is given (single space) map current Tiddler
// !todo would be much better if so when no attribute at all...
                if (plcs.tiddler==" ") {
                    mapTiddler(this,this.getVariable("currentTiddler"));
                }
                // else, map the given tiddler
                else {
                    // get data fields in the tiddler, let's seek for geo data
                    mapTiddler(this,plcs.tiddler);
                }
            }
            // case 2 : data in multiple tiddlers
            if (plcs.tiddlers) {
				mapTiddlers(this,plcs.tiddlers);
			}
            // case 3 : data in tiddlers following a filter
            if (plcs.filter) {
                mapFilter(this,plcs.filter);
            }
            // case 4 : data are directly listed in places (point(s) - polygon - polyline)
			// for each we will
			// - create a containing feature
			// - use dedicated function to populate feature
			// - add feature to map
			// - adjust bounds to new object
            if (plcs.point) {
console.log("leafmap (" + map + ") : display a point at : " + plcs.point);
                // create a containing feature
                var pointFeat = L.featureGroup();
                // add the point to the feature
                mapPoint(plcs.point,pointFeat);
				// add the feature to map
				pointFeat.addTo(Map[map]);
				// set bounds
				extBounds(pointFeat);
            }
			if (plcs.points) {
console.log("leafmap (" + map + ") : display a points serie at : " + plcs.points);
                var pointsFeat = L.featureGroup();
                mapPoints(plcs.points,pointsFeat);
				pointsFeat.addTo(Map[map]);
				extBounds(pointsFeat);
            }
			if (plcs.polygon) {
console.log("leafmap (" + map + ") : display a polygon at : " + plcs.polygon);
                var polygFeat = L.featureGroup();
                mapPolyg(plcs.polygone,polygFeat);
				polygFeat.addTo(Map[map]);
				extBounds(polygFeat);
            }
			if (plcs.polygons) {
console.log("leafmap (" + map + ") : display a polygons set at : " + plcs.polygons);
                var polygsFeat = L.featureGroup();
                mapPolygs(plcs.polygons,polygsFeat);
				polygsFeat.addTo(Map[map]);
				extBounds(polygsFeat);
            }
			if (plcs.polyline) {
console.log("leafmap (" + map + ") : display a polyline at : " + plcs.polyline);
                var polylFeat = L.featureGroup();
                mapPolyl(plcs.polyline,polylFeat);
				polylFeat.addTo(Map[map]);
				extBounds(polylFeat);
            }
			if (plcs.polylines) {
console.log("leafmap (" + map + ") : display a polylines set at : " + plcs.polylines);
                var polylsFeat = L.featureGroup();
                mapPolyls(plcs.polylines,polylsFeat);
				polylsFeat.addTo(Map[map]);
				extBounds(polylsFeat);
            }
            if (plcs.geojson) {
console.log("leafmap (" + map + ") : display a geojson data set : " + plcs.geojson);
                var geojsonFeat = L.featureGroup();
                mapGeoJson(plcs.geojson,geojsonFeat);
				geojsonFeat.addTo(Map[map]);
				extBounds(geojsonFeat);
            }
        }
        // set map to objects bounds
        if (bounds) {
            Map[map].fitBounds(bounds);
        }
        else {
            bounds = lfltDefBounds;
            Map[map].fitBounds(bounds);
        }
        // if lat long zoom settings, overwrite bounds
        setting.lat = this.getAttribute("lat");
        setting.lg = this.getAttribute("long");
        setting.zoom = this.getAttribute("zoom");
        // overwrite lat and long center
        if (setting.lat && setting.long) {
            Map[map].setView([setting.lat, setting.lg]);
        }
        // overwrite zoom
        if (setting.zoom) {
            Map[map].setZoom(setting.zoom);
        }
    };

    // add a marker for a point
    function mapPoint (coord,feat) {
        try {
            var location = eval("[" + coord + "]");
        }
        catch(err) {
            displayError("point",err);
        }
        try{
            var marker = L.marker(location, {
                icon: lfltIcon
                })
            marker.addTo(feat);
        }
        catch(err) {
            displayError("point",err);
        }
    }
    // add a marker serie for a points list
    function mapPoints (list,feat) {
        var Points = list.split(" ");
        for (var pt in Points) {
            mapPoint(Points[pt],feat);
        }
    }
    // add a polygon
    function mapPolyg (list,feat) {
        var Coords = list.split(" ");
        var Shape = [];
        try {
            for (var nd in Coords) {
                var location = eval("[" + Coords[nd] + "]");
                Shape.push(location);
            }
        }
        catch(err) {
            displayError("polygone",err);
        }
        try {
            var polygon = L.polygon(Shape);
            polygon.addTo(feat);
        }
        catch(err) {
            displayError("polygone",err);
        }
    }
	// add a polygons collection
	function mapPolygs (collec,feat) {
        var Polys = collec.split("|");
		for (var pg in Polys) {
			mapPolyg(Polys[pg],feat);
		}
    }
    // add a polyline
    function mapPolyl (list,feat) {
        var Coords = list.split(" ");
        var Line = [];
        try {
            for (var nd in Coords) {
                var location = eval("[" + Coords[nd] + "]");
                Line.push(location);
            }
        }
        catch(err) {
            displayError("polyline",err);
        }
        try {
            var polyline = L.polyline(Line);
            // add polyline class in order to make fill transparent
            polyline.setStyle({"className":"polyline"}).addTo(feat);
        }
        catch(err) {
            displayError("polyline",err);
        }
    }
	// add a polylines collection
	function mapPolyls (collec,feat) {
        var Lines = collec.split("|");
		for (var ln in Lines) {
			mapPolyl(Lines[ln],feat);
		}
    }
    // add a geojson set
    function mapGeoJson (geojson,feat) {
        try{
            var data = JSON.parse(geojson);
            var geoJson = L.geoJSON(data, {
                    // adding points
                    pointToLayer: function(geoJsonPoint, latlng) {
                        // binding default icon
                        var jsonPoint = L.marker(latlng, {icon: lfltIcon});
                        // extracting data to create popup (all non-null data!)
                        var Prop=geoJsonPoint.properties,
                            jsontitle="",
                            jsonhtml="";
                        // testing if properties title or name exists
                        if (Prop["name"]) jsontitle += Prop["name"]+" ";
                        if (Prop["title"]) jsontitle += Prop["title"]+" ";
                        // populating other data
                        // if we got a title
                        if (jsontitle != "") {
                            jsonhtml += "<h4>" + jsontitle + "</h4><ul>";
                            for (var p in Prop) {
                                if(Prop[p] !== null && Prop[p] !== "" && p !="name" && p !="title") jsonhtml += "<li>" + p + " : " + Prop[p] +"</li>";
                                }
                            jsonhtml += "</ul>";
                            }
                        // if we have no title, giving one with first fields
                        else {
                            for (var p in Prop) {
                                // if title is really to short (as an id), taking next field
                                if(jsontitle.length < 4) jsontitle += Prop[p]+" ";
                                else {
                                    if(Prop[p] !== null && Prop[p] !== "") jsonhtml += "<li>" + p + " : " + Prop[p] +"</li>";
                                }
                                jsonhtml = "<h4>" + jsontitle + "</h4><ul>" + jsonhtml + "</ul>";
                                }
                            }
                        jsonPoint.bindPopup(jsonhtml);
                        return jsonPoint.addTo(Map[map]);
                }}
            );
            geoJson.addTo(feat);
        }
        catch(err) {
            displayError("geoJson",err);
        }
    }

    function mapTiddler(obj,tid) {
        // get data fields in the tiddler, let's seek for geo data
        var flds = obj.wiki.getTiddler(tid).fields;
        // create the tiddler group
        var feature = L.featureGroup();
        //
/*    !todo : detect if tiddler is JSON data in order to display them
        for now, assuming any json data is geoJson...
        */
        if (flds.type == "application/json") {
        // have to detect strict geoJSON and other JSON with lat long data
            var data = obj.wiki.getTiddlerText(tid);
            mapGeoJson(data,feature);
        // for second case give instruction about required fields and data to be rendered in popup
        }
        // if tiddler is not JSON data, display tiddler stored geodata as point(s), polygon, polyline...
        else {
            // render a unique point for the tiddler (with tiddler text in the popup)
            if (flds.point) {
                mapPoint(flds.point,feature);
            }
            // render a space separated list of pointS for the tiddler
            if (flds.points) {
                mapPoints(flds.points,feature);
            }
            // render a polygon
            if (flds.polygon) {
                mapPolyg(flds.polygon,feature);
            }
			// render a polygons collection
			if (flds.polygons) {
                mapPolygs(flds.polygons,feature);
            }
            // render a polyline
            if (flds.polyline) {
                mapPolyl(flds.polyline,feature);
            }
			// render a polylines collection
			if (flds.polylines) {
                mapPolyls(flds.polylines,feature);
            }
            if (flds.geojson) {
console.log("tiddler contains geojson data : "+flds.geojson);
                mapGeoJson(flds.geojson,feature);
            }
            var html = "<h4><a href=\"#" + encodeURIComponent(flds.title) + "\">" + flds.title + "</a></h4>" + flds.text;
            // avoid popup for geojson geometry since they could have their own data
            if(!flds.geojson) feature.bindPopup(html);
		}
        // create popup with tiddler content
        feature.addTo(Map[map]);
        // get feature bounds for automatic zoom
		extBounds(feature);
    }
    // map a tiddler colletion
    function mapTiddlers(obj,list) {
		var Tids = list.split(" ");
		for (var td in Tids) {
			mapTiddler(obj,Tids[td]);
		}
	}
    // map tiddlers with a filter
    function mapFilter(obj,filter) {
        try {
            var Tids = obj.wiki.filterTiddlers(filter);
            for (var td in Tids) {
                mapTiddler(obj,Tids[td]);
            }
        }
        catch(err) {
             $tw.utils.error("sorry your filter is probably wrong");
        }
    }

	// coordinate error message
    function displayError(objectType,error) {
        $tw.utils.error("there is an error in a "+objectType+" : "+error);
    }

 	// adjust bounds to feature
	function extBounds(feat) {
        try {
            if (bounds) {
                bounds.extend(feat.getBounds());
            }
            else {
                if (feat.getBounds()._northEast) {
                    console.log(feat.getBounds());
                    bounds = feat.getBounds();
                }
            }
        }
        catch(err) {
            $tw.utils.error("there was an error when trying to zoom on feature");
        }

	}

    exports.leafmap = mapWidget;

})();
/*
MISC NOTES for later
JSON.parse(tiddler.fields.text);
var jsonData = this.wiki.getTiddlerAsJson(this.to),
*/
