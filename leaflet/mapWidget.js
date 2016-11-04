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
        L = require("$:/plugins/sycom/leaflet/lib/leaflet.js"),
        markerClusterGroup = require("$:/plugins/sycom/leaflet/lib/leaflet-markercluster.js");

    var mapWidget = function(parseTreeNode, options) {
        this.initialise(parseTreeNode, options);
    };

    // global vars
    var Map = [], // map collection
        map = 0, // map order number
        fCluster = [], // the clusters
        clusterRadius = 80, // default cluster radius
        lfltDefBounds = [
            [52.75, -2.55],
            [52.85, -2.65]
        ], // default bounds when nothing given
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
        div.setAttribute("id", "lfltMap-" + map);
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
        Map[map] = L.map('lfltMap-' + map);
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
        if (Tiles[setting.tile] == undefined) {
            setting.tile = "osm";
            $tw.utils.error("Seems you entered a wrong tile id, displayed osm instead. Please refer to plugin documentation to avoid this - error : "+ error);
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
        var icone = escape(this.wiki.getTiddlerText("$:/plugins/sycom/leaflet/images/marker.svg"));
        var shadow = escape(this.wiki.getTiddlerText("$:/plugins/sycom/leaflet/images/markershadow.svg"));
        var iconUrl = 'data:image/svg+xml;charset=UTF-8,' + icone;
        var shadowUrl = 'data:image/svg+xml;charset=UTF-8,' + shadow;
        // create icon !todo only if there are points to display;
        lfltIcon = L.icon({
            iconUrl: iconUrl,
            iconRetinaUrl: iconUrl,
            iconSize: [25, 40],
            iconAnchor: [12.5, 40],
            popupAnchor: [0, -40],
            shadowUrl: shadowUrl,
            shadowRetinaUrl: shadowUrl,
            shadowSize: [50, 40],
            shadowAnchor: [0, 40]
        });
        L.icon.default = lfltIcon;
        // creating cluster
        fCluster[map] = L.markerClusterGroup({
            name: "Cluster" + map,
            maxClusterRadius: clusterRadius,
            /* for the record. may be a function
            function() {return (clusterRadius - 50) / 9 * Map[map].getZoom() + 50 - (clusterRadius - 50) / 9 },*/
            iconCreateFunction: function(cluster) {
                // cluster icon size will be based on item number and zoom
                var cC = cluster.getChildCount();
                var m = this.name.split("Cluster")[1];
                var cS = Math.sqrt(cC * Map[m].getZoom() * clusterRadius) * 1.15;
console.log("cS : " + cS)
                if (cS < 38) cS = 38;
                var cF = cS / 2;
                if (cF < 14) cF = 14;
                return new L.DivIcon({
                    html: '<div style="width:' + cS + 'px;height:' + cS + 'px;font-size:' + cF + 'px;"><div><span style="line-height:' + cS + 'px">' + cC + "</span></div></div>",
                    className: "marker-cluster marker-cluster-" + cC,
                    iconSize: new L.Point(cS, cS)
                })
            }
        });
        fCluster[map].name = "Cluster" + map;
        // Get the declared places from the attributes
        var places = this.getAttribute("places", undefined);
        if (places) {
            var plcs = JSON.parse(places);
            // case 1 : data in a tiddler
            if (plcs.tiddler) {
                var feature = L.featureGroup();
                // if no tiddler is given (single space) map current Tiddler
                // !todo would be much better if so when no attribute at all...
                if (plcs.tiddler == " ") {
                    mapTiddler(this, this.getVariable("currentTiddler"));
                }
                // else, map the given tiddler
                else {
                    // get data fields in the tiddler, let's seek for geo data
                    mapTiddler(this, plcs.tiddler);
                }
            }
            // case 2 : data in multiple tiddlers
            if (plcs.tiddlers) {
                var feature = L.featureGroup();
                mapTiddlers(this, plcs.tiddlers);
            }
            // case 3 : data in tiddlers following a filter
            if (plcs.filter) {
                var feature = L.featureGroup();
                mapFilter(this, plcs.filter);
            }
            // case 4 : data are directly listed in places (point(s) - polygon - polyline - geojson)
            // for each we will
            // - create a containing layer
            // - use dedicated function to populate layer
            // - add layer to map
            // - adjust bounds to new object
            if (plcs.point) {
                var feature = L.featureGroup();
                // add the point to the cluster layer
                mapPoint(plcs.point, fCluster[map]);
                // add the cluster layer to map
                feature.addLayer(fCluster[map]);
                // set bounds

            }
            if (plcs.points) {
                var feature = L.featureGroup();
                mapPoints(plcs.points, fCluster[map]);
                feature.addLayer(fCluster[map]);

            }
            if (plcs.polygon) {
                var feature = L.featureGroup();
                var polygFeat = L.layerGroup();
                mapPolyg(plcs.polygone, polygFeat);
                polygFeat.addTo(feature);

            }
            if (plcs.polygons) {
                var feature = L.featureGroup();
                var polygsFeat = L.layerGroup();
                mapPolygs(plcs.polygons, polygsFeat);
                polygsFeat.addTo(feature);

            }
            if (plcs.polyline) {
                var feature = L.featureGroup();
                var polylFeat = L.layerGroup();
                mapPolyl(plcs.polyline, polylFeat);
                polylFeat.addTo(feature);

            }
            if (plcs.polylines) {
                var feature = L.featureGroup();
                var polylsFeat = L.layerGroup();
                mapPolyls(plcs.polylines, polylsFeat);
                polylsFeat.addTo(feature);

            }
            if (plcs.geojson) {
                var feature = L.featureGroup();
                var geojsonFeat = L.layerGroup();
                mapGeoJson(plcs.geojson, geojsonFeat);
                geojsonFeat.addTo(feature);

            }
        // add feature to map
        Map[map].addLayer(feature);
        extBounds(feature);
        }
        // set map to objects bounds
        if (bounds) {
            Map[map].fitBounds(bounds);
        } else {
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
    function mapPoint(coord, cluster) {
        try {
            var location = eval("[" + coord + "]");
        } catch (err) {
            displayError("point", err);
        }
        try {
            var marker = L.marker(location, {
                icon: lfltIcon
            })
            cluster.addLayer(marker);
        } catch (err) {
            displayError("point", err);
        }
    }
    // add a marker serie for a points list
    function mapPoints(list, cluster) {
        var Points = list.split(" ");
        for (var pt in Points) {
            mapPoint(Points[pt], cluster);
        }
    }
    // add a polygon
    function mapPolyg(list, feat) {
        var Coords = list.split(" ");
        var Shape = [];
        try {
            for (var nd in Coords) {
                var location = eval("[" + Coords[nd] + "]");
                Shape.push(location);
            }
        } catch (err) {
            displayError("polygone", err);
        }
        try {
            var polygon = L.polygon(Shape);
            polygon.addTo(feat);
        } catch (err) {
            displayError("polygone", err);
        }
    }
    // add a polygons collection
    function mapPolygs(collec, feat) {
        var Polys = collec.split("|");
        for (var pg in Polys) {
            mapPolyg(Polys[pg], feat);
        }
    }
    // add a polyline
    function mapPolyl(list, feat) {
        var Coords = list.split(" ");
        var Line = [];
        try {
            for (var nd in Coords) {
                var location = eval("[" + Coords[nd] + "]");
                Line.push(location);
            }
        } catch (err) {
            displayError("polyline", err);
        }
        try {
            var polyline = L.polyline(Line);
            // add polyline class in order to make fill transparent
            polyline.setStyle({
                "className": "polyline"
            }).addTo(feat);
        } catch (err) {
            displayError("polyline", err);
        }
    }
    // add a polylines collection
    function mapPolyls(collec, feat) {
        var Lines = collec.split("|");
        for (var ln in Lines) {
            mapPolyl(Lines[ln], feat);
        }
    }
    // add a geojson set
    function mapGeoJson(geojson, feat) {
        try {
            var data = JSON.parse(geojson);
            var geoJson = L.geoJSON(data, {
                // adding points
                pointToLayer: function(geoJsonPoint, latlng) {
                    // binding default icon
                    var jsonPoint = L.marker(latlng, {
                        icon: lfltIcon
                    });
                    fCluster[map].addLayer(jsonPoint);
                    // extracting data to create popup (all non-null data!)
                    var Prop = geoJsonPoint.properties,
                        jsontitle = "",
                        jsonhtml = "";
                    // testing if properties title or name exists
                    if (Prop["name"]) jsontitle += Prop["name"] + " ";
                    if (Prop["title"]) jsontitle += Prop["title"] + " ";
                    // populating other data
                    // if we got a title
                    if (jsontitle != "") {
                        jsonhtml += "<h4>" + jsontitle + "</h4><ul>";
                        for (var p in Prop) {
                            if (Prop[p] !== null && Prop[p] !== "" && p != "name" && p != "title") jsonhtml += "<li>" + p + " : " + Prop[p] + "</li>";
                        }
                        jsonhtml += "</ul>";
                    }
                    // if we have no title, giving one with first fields
                    else {
                        for (var p in Prop) {
                            // if title is really to short (as an id), taking next field
                            if (jsontitle.length < 4) jsontitle += Prop[p] + " ";
                            else {
                                if (Prop[p] !== null && Prop[p] !== "") jsonhtml += "<li>" + p + " : " + Prop[p] + "</li>";
                            }
                            jsonhtml = "<h4>" + jsontitle + "</h4><ul>" + jsonhtml + "</ul>";
                        }
                    }
                    jsonPoint.bindPopup(jsonhtml);
                }
            });
            feat.addLayer(fCluster[map]);
            geoJson.addTo(feat);
        } catch (error) {
            displayError("geoJson", error);
        }
    }

    function mapTiddler(obj, tid) {
console.log("mapping "+tid);
        // get data fields in the tiddler, let's seek for geo data
        var flds = obj.wiki.getTiddler(tid).fields;
        // create the tiddler feature
        var feature = L.featureGroup();
        //
/*    !todo : detect if tiddler is JSON data in order to display them
              for now, assuming any json data is geoJson...
*/
        if (flds.type == "application/json") {
            // have to detect strict geoJSON and other JSON with lat long data
            var data = obj.wiki.getTiddlerText(tid);
            mapGeoJson(data, feature);
            // for second case give instruction about required fields and data to be rendered in popup
        }
        // if tiddler is not JSON data, display tiddler stored geodata as point(s), polygon, polyline...
        else {
            // create the layer group
            var subFeat = L.featureGroup();
            var wasRendered = 0;
            // render a unique point for the tiddler (with tiddler text in the popup)
            if (flds.point) {
                mapPoint(flds.point, fCluster[map]);
                subFeat.addLayer(fCluster[map]);
                wasRendered++;
            }
            // render a space separated list of pointS for the tiddler
            if (flds.points) {
                mapPoints(flds.points, fCluster[map]);
                subFeat.addLayer(fCluster[map]);
                wasRendered++;
            }
            // render a polygon
            if (flds.polygon) {
                mapPolyg(flds.polygon, subFeat);
                wasRendered++;
            }
            // render a polygons collection
            if (flds.polygons) {
                mapPolygs(flds.polygons, subFeat);
                wasRendered++;
            }
            // render a polyline
            if (flds.polyline) {
                mapPolyl(flds.polyline, subFeat);
                wasRendered++;
            }
            // render a polylines collection
            if (flds.polylines) {
                mapPolyls(flds.polylines, subFeat);
                wasRendered++;
            }
            // render a geojson directly in feature
            if (flds.geojson) {
                mapGeoJson(flds.geojson, feature);
                wasRendered++;
            }
            // check if anything was rendered before binding popup
            if (wasRendered != 0) {
                // avoid popup for geojson geometry since they could have their own data
                if (!flds.geojson) {
                   var popup = "<h4><a href=\"#" + encodeURIComponent(flds.title) + "\">" + flds.title + "</a></h4>";
                    var content = "";
                    if (flds.text != "") {
                       // if tiddler contains a widget, avoid html rendering?
                        if (flds.text.match(/<\$/)) {
console.log("text contains a widget - plain text");
                           content += "<pre>" + flds.text + "</pre>";
                       }
                        // else render
                        else {
console.log("text does not contains a widget - html text");
                           content += obj.wiki.renderTiddler("text/html", tid).substring(0, 420);
                        }
                    }
                    // adding a link to the tiddler
                    content += "<br/>(<a href=\"#" + encodeURIComponent(flds.title) + "\" title=\"read more...\">...</a>)";
                    popup += content;
console.log("content : " + content);
                    subFeat.bindPopup(popup);
                }
            } else console.log("non geotiddler was listed and not rendered : " + flds.title);
        // add the layer to the feature
        feature.addLayer(subFeat);
        }
        // create popup with tiddler content
        Map[map].addLayer(feature);// layer.addTo(Map[map]);
        // get layer bounds for automatic zoom
        console.log("tid "+tid+"was mapped");
        extBounds(feature);
    }
    // map a tiddler colletion
    function mapTiddlers(obj, list) {
        var Tids = list.split(" ");
        for (var td in Tids) {
            mapTiddler(obj, Tids[td]);
        }
    }
    // map tiddlers with a filter
    function mapFilter(obj, filter) {
        try {
            var Tids = obj.wiki.filterTiddlers(filter);
            for (var td in Tids) {
console.log(Tids[td] + " > go");
                mapTiddler(obj, Tids[td]);
            }
        } catch (error) {
            $tw.utils.error("sorry there was something wrong when trying to map your filter. error : " + error);
        }
    }

    // coordinate error message
    function displayError(objectType, error) {
        $tw.utils.error("there was an error when mapping a " + objectType + " - error : " + error);
    }

    // adjust bounds to layer
    function extBounds(feat) {
        try {
            if (bounds) {
                bounds.extend(feat.getBounds());
            } else {
                if (feat.getBounds()._northEast) {
                    bounds = feat.getBounds();
                }
            }
        } catch (error) {
            $tw.utils.error("there was an error when trying to zoom on bounds. error : "+ error);
        }

    }

    exports.leafmap = mapWidget;

})();
/*
MISC NOTES for later
JSON.parse(tiddler.fields.text);
var jsonData = this.wiki.getTiddlerAsJson(this.to),
*/
