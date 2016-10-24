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

    // base 64 icons
    var base64icon = "data:image/png;base64,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",
        base64shadow = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAYAAACiu5n/AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAcPSURBVGiB3VpdT1tXFl1rn3uvbWwghUkIhebDYSaaIkWVeKryQn9E/H/yd8qfsFSpvBTNwyipIkVMhzSElASwHX/ec86aB64zSUtIJsGQzpIsy9b13XudtffZe59rSsJFgyTf/Dh+X19ff/19s9kUgPELAKCPcJ4XRbggybW1NZfneWZmaZZlLkkSl+e5jUYjV61WE++9JUkSu92uL5fLXpIPIfg8z32v1/PLy8uh2WxGHPN/L5lzJ0zS1tbW3GAwKGVZVknTtAZgRlI1hFB2zmWSMgApSSfJSMYQgjezgaS+pH6SJH0AfZI9M+sB6C8vL482NjbiacTPjTBJrq6upjMzMzVJM3mez5nZnKRZAFMAMpIuxuhImiQzMyt+rhijAAQz85I8AA8gl9Q3s4MQwr5z7rDdbndrtdpga2vLn0T8XAiTdHfu3CmnaTpP8iuSCzHGaZJlSZmZmaST8vgkvHaYpCQFMxvEGLskDwviv/V6vcOvv/66//3334e3fJk04e+++y55+fLl9NTU1GII4TrJq5KqRbgSp5P7UEhSBDAi2ZP0EsBOpVL5NUmSTrPZDGO1kzMw9k40Gg03HA5nKpVKPYRwA8A8gDIAO+OFJkkHoCyphOMUmcrzPOt2uztra2tHAHIAsNPu8qkePHr0qDwajZYk1QEsAKhImpjNwqyRLJO8EkL4m5nVAcw2Gg0HTFZhViqVmqQvQwhzJFOcTfh+kG0AKYB5M4tm1n/48OGAZHdiq72+vm4kK977WTPLcH5kxyCAJMb4RZ7ni1mWVQBwYgp3Oh1agUnZ+ADQzDJJNedc6d69e5yYM/V6PSZJMgTQlxTe+4MJgeRbu+PEyhJJfvPNN7Mk/+6c+6ukS8VOeq6Q1AewPTU19Y8ffvjh5cQUliTnXLdcLu+Y2a9m1jlnpQUgJ9lyzj1vtVo9ABMtEdja2vKXLl16kWXZYwBPAPRIxknaBACSkeRI0gHJf5dKpd3bt28PJGninRZJu3v3brXb7d5K03Q1xjg/wdCWpECyB+CFpCcxxidmdvTTTz/lwIQ7LZK8ceNGNhqNLhWDQtnMznKRBQCSIslgZsMY4ysAe5KeAHgxOzvbbTabr1NpYoSLMbCcpumVEMItAF9JmsK7uzsVjkdJPK2cxRhVpEZOcoTjMbErqUXyZZqm+7u7u+1ffvllVPTYrzERwiTtzp07lSzLFkMItyQtkay9I5RVbGZ9M+uQHMUYDcdNg5NEkirKi4r8HJPtSmoDaHnvO9Vqtd/v94dLS0vDH3/88cS5+MxzuNFouJ2dnar3/ktJK865RQBTJ/TQkhTNbADgyHu/l6bpnnOuG2OkpBRA6r13ZhZjjCFJkhBCCHmexzRNA4A8SZLR3NzcsFar+Y2NjTi+8bv8OzOFSXJ9fd1576e998sAbpnZAo4nGPvdtTHGOJTUAfDce79rZr/Nz893arWaB4Dt7W1rtVq2vLzMSqWinZ0dzczMxMuXL2tjY+NNQh90tPPa9lkoTJJra2sJgNk0Ta957+skLxejGt+4Lkrykl6R3Ce5C2Avxtje2toanlSnWUz5n+xkgU9WeHx0kyTJF977G977mwDmi5AckxUAL6lX1MZdks/a7fbR4uJi/80B/fc4S7LAJypMkisrK9n09PS8mdUlXTezL3C8kMR/87QfYzwC8MzMdvM8P3DOdd917jRJfLTCRc6WOp3OFZJ1ANdIzhT3JMkQYxwBaAN4DuCpc27/4ODg1ePHj/Pfl4vzwkcpPK6xZnZV0i2Sy8WhnBXlI5f0CsB+jPFpmqbPzay9ubk5usjJCfiII5779+/b3bt3q865ZUm3JV2PMU6bGXF8dNqW9JTkz865fw6Hw+1r16692NzcHFw0WeB/VLjRaLjt7e1akiRLIYQVkldjjGUAcs69lachhAMAvYvI09PwQYTHNXY4HM6EEL4CUI8xXpGUFa1dW9Ieyd00Tffb7farBw8e+IvK09PwXsLjGhtjvATgupndJDlXPBnokNwPIeyWSqXnkjqbm5vDz5HoGKfu0uMaa2ZzzrmbMcbrJGdijAOSh2b2dDAY7Ek6qtfrg/c91/kc8E6Fi9GutLCw8Jc8z2+a2ZKkUqHqMzN7JumgUqn0TmscPjecSHhcdkIIV5IkuSHpcjGx7JvZbpqmLw4PD7sPHjzI/yxEx/hDSI9HOzNbIHmN5DTJAwB73vvfZmdnO81m8w9z5p8Fb9Xh+/fv2+rq6lSaplclLQKA934nxvgwxvivlZWVg2az+VlvSu/D65BuNBpuf3+/0mq15p1zc865AODg6Oio9b4G/88ESgJJ+/bbb0sxxhlJU8650Wg0eoXPsHH4VCQAcO/ePT569MjMbFitVntHR0fDz7Vx+FSMFeb6+roDgGazGf8fiY5xYf/iuSj8BzrgXt4p5a59AAAAAElFTkSuQmCC";

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
        // create icon !todo only if there are points to display;
        lfltIcon = L.icon({
            iconUrl: base64icon,
            iconRetinaUrl: base64icon,
            iconSize: [20, 38],
            iconAnchor: [15, 38],
            popupAnchor: [-5, -39],
            shadowUrl: base64shadow,
            shadowRetinaUrl: base64shadow,
            shadowSize: [40, 20],
            shadowAnchor: [0, 20]
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
            var geoJson = L.geoJSON(geojson, {
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
            var data = JSON.parse(obj.wiki.getTiddlerText(tid));
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
            var html = "<h4><a href=\"#" + encodeURIComponent(flds.title) + "\">" + flds.title + "</a></h4>" + flds.text;
            feature.bindPopup(html);
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
