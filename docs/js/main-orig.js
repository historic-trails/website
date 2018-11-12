"use strict";

/* ===============================
 * Helper classes
 * ===============================
 */

// The "tms" option didn't work for inverting the y axis, so this
// class ensures compatibility with our tile format.
// It's a simple modification of this class:
// https://github.com/Leaflet/Leaflet/blob/master/src/layer/tile/TileLayer.js
var TileLayerInverted = L.TileLayer.extend({
    getTileUrl: function(coords){
        return L.Util.template(this._url, L.extend({
            x: coords.x,
            y: -1 - coords.y,
            z: this._getZoomForUrl()
        }, this.options));
    }
});

// This lets us put the entire map into a coordinate system
// between [0, 0] and [1, 1].
// Extension of https://github.com/Leaflet/Leaflet/blob/master/src/geo/crs/CRS.Simple.js
var OneBasedSimple = L.Util.extend(L.CRS.Simple, {
    scale: function(t){
        return 256 * Math.pow(2, t);
    }
});

// Used in editMode for a "reset" button
var ButtonControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    initialize: function(text, fn, options){
        this.buttonText = text;
        this.buttonFn = fn;
        L.Util.setOptions(this, options);
    },
    onAdd: function(map){
        var container = L.DomUtil.create('div', 'leaflet-bar');
        var b = L.DomUtil.create('a', '', container);
        b.href = '#';
        b.innerHTML = this.buttonText;
        var fn = this.buttonFn;
        L.DomEvent.addListener(b, 'click', function(e){
            fn();
            e.preventDefault();
        });
        return container;
    }
});


/* ==============================
 * Google Sheets interface
 * ==============================
 */

// Sheetrock expects to be outputting HTML for each row, so here's a place to put it.
$('<div id="sheetrock"></div>').appendTo(document.body).hide();

function getMarkersByYear(year, callback){
    console.log("Getting markers for "+year+".");
    // The spreadsheet must be either "visible to anyone with the link", or "public on the web".
    // Click Share in the spreadsheet, then click Change visibility.
    //var sheetURL = "https://docs.google.com/a/umich.edu/spreadsheet/ccc?key=0Asv4deoA2Il5dHU5bkN3UzY1MlhWaVM5RUYxSG93MGc#gid=0";
    var sheetURL = "https://docs.google.com/spreadsheets/d/1m3kjmqpheNtAQ7tDB93BhJ7yA2fhfDvu49vKQ_Kkai8/edit#gid=0";
    var markers = [];
    $('#sheetrock').sheetrock({
        url: sheetURL,
        columns: {A: "year"},
        sql: "select * where %year% contains '"+year+"'",
        labels: ["year","name","outline","caption","link",
                 "image1","image2","image3","image4","image5"],
        chunkSize: 0,
        resetStatus: true,
        headers: 1,
        headersOff: true,
        rowHandler: function(row){
            var m = row.cells;
            m.year = m.A;
            m.title = m.B;
            m.outline = m.C;
            m.caption = m.D;
            m.link = m.E;
            // outline should be a javascript array in a string, so
            // this turns it back into an array
            try{
                m.outline = JSON.parse(m.outline);
                if(!(m.outline instanceof Array)){
                    throw "";
                }
                if(m.outline.length == 2 && typeof(m.outline[0]) == "number"){
                    // The outline is actually just a position, for placing a marker.
                    m.position = m.outline;
                    delete m.outline;
                }
            } catch(e){
                console.log("There is a problem with the outline for row "+(row.num+1)+"!");
		//console.log(m.outline);
		//console.log(e);
                return;
            }
            //m.images = [m.image1, m.image2, m.image3, m.image4, m.image5];
            m.images = [m.F, m.G, m.H, m.I, m.J];
            // remove empty values from images
            m.images = $.grep(m.images, function(x){ return x; });
	    if(m.images.length == 0) delete m.images;
            markers.push(m);
            console.log("Row "+(row.num+1)+" is OK.");
            return $('<span></span>'); // appease the sheetrock table handler
        },
        userCallback: function(){
            console.log("Retrieved a total of "+markers.length+" markers.");
            callback(markers);
        }
    });
}

/* ===========================
 * Map setup
 * ===========================
 */

var map = L.map('map', {
    center: [0, 0],
    zoom: 1,
    crs: OneBasedSimple
});

var activeMarkers = L.featureGroup();
map.addLayer(activeMarkers);

// attribution control
map.attributionControl.setPrefix('<a href="http://milproj.dc.umich.edu" target="_blank">Millenium Project</a>');

// initialize image sliders in popups
map.on('popupopen', function(e){
    var slider = $(e.popup._contentNode).children('.image-slider');
    if(slider.children('li').length > 1){
        slider.bxSlider({
            responsive: false,
    //        adaptiveHeight: true,
            controls: false
        });
    }
});

// clear all building highlights when a popup closes
map.on('popupclose', function(){
    activeMarkers.setStyle({ fillOpacity: 0 });
});

// load year data, completing map setup
$.ajax({
    dataType: 'json',
    url: 'markers.json',
    success: function(data){
        loadYears(data, '1854'); // 1854 is the default
        if(typeof window.editMode == "function" && !navigator.userAgent.match(/iPad/i))
            editMode();
    },
    error: function(data){
        alert("An error occurred when loading the map markers. Check the json syntax, or try reloading the page.");
    }
});

/* =========================
 * Year setup
 * =========================
 */

var yearLayers;
function loadYears(yearData, defaultYear){
    // make a bunch of layers
    var url = 'http://specular.dmc.dc.umich.edu/map/drag/tiles/{year}/{z}/{x}/{y}.png';
    yearLayers = {};
    $.each(yearData, function(year, options){
        // each year gets the options from yearData added to it
        var bounds = options.bounds || null;
        if(bounds) bounds[0] = [0.0001, 0.0001];
        yearLayers[year] = new TileLayerInverted(url, L.Util.extend({
            year: year,
            maxZoom: options.maxNativeZoom + 1,
            continuousWorld: true,
            bounds: bounds
        }, options));
    });

    // when the year is changed, re-center the map and load markers
    map.on('baselayerchange', function(e){
        var options = e.layer.options;

        // jump to new center/zoom
        map.fitBounds(options.bounds, {
            animate: false,
            padding: [80, 10]
        });
        //map.setMaxBounds(options.bounds);

        // load markers using google sheets interface
        getMarkersByYear(options.year, function(markers){
            // clear away old markers
            activeMarkers.clearLayers();
            // and add the markers for this year
            $.each(markers, loadMarker);
        });

        // illuminate all buildings to hint at what to click on
        highlightBuildings();
    });

    map.on('drag', highlightBuildings);
    map.on('zoomstart', highlightBuildings);


    // create a year selection control
    var layerControl = L.control.layers({}, {}, {
        collapsed: false,
    }).addTo(map);
    // add years to selection control
    Object.keys(yearLayers).sort().forEach(function(v, i){
        layerControl.addBaseLayer(yearLayers[v], v);
    });
    // open up the default year
    map.addLayer(yearLayers[defaultYear]);
}

var hl_timeout;
function highlightBuildings(){
    $('#map').addClass('hl-hint');
    clearTimeout(hl_timeout);
    hl_timeout = setTimeout(function(){
        $('#map').removeClass('hl-hint');
    }, 1000);
}

function loadMarker(i, markerData){
    var m;
    // see if we have enough info to make a popup
    var hasPopup = !!(markerData.title || markerData.image || markerData.caption || markerData.link);

    var color = "#ccc"; // dim markers with no popup information
    if(hasPopup){
        color = "#6af";
    }

    // create the marker - either a polygon or a circle depending on how much information we have
    if(markerData.outline){
        m = L.polygon(markerData.outline, {
            fillColor: color,
            stroke: false,
            fillOpacity: 0
        }).addTo(activeMarkers);
    } else if(markerData.position){
        m = L.circle(markerData.position, 100, {
            fillColor: color,
            stroke: false,
            fillOpacity: 0
        }).addTo(activeMarkers);
    } else{
        // if there's no position data, nothing should happen
        console.log("Skipped a building without outline data");
        return;
    }

    // markers default to invisible unless hovered
    m.on('mouseover', function(){
        this.setStyle({ fillOpacity: 0.5 });
    });
    m.on('mouseout', function(){
        this.setStyle({ fillOpacity: 0 });
    });

    if(hasPopup){
        // assemble the popup!
        var popup = $('<div></div>');
        if(markerData.title){
            $('<h2></h2>')
                .text(markerData.title)
                .appendTo(popup);
        }
        if(markerData.image || markerData.images){
            // image carousel
            var images = markerData.images || [markerData.image];
            var slider = $('<ul></ul>')
                .addClass('image-slider')
                .appendTo(popup);
            $.each(images, function(i, url){
                $('<img>')
                    .attr('src', url)
                    .appendTo($('<li></li>').appendTo(slider));
            });
        }
        if(markerData.caption){
            $('<p></p>')
                .text(markerData.caption)
                .appendTo(popup);
        }
        if(markerData.link){
            $('<a></a>')
                .addClass('read-more')
                .attr('href', markerData.link)
                .attr('target', '_blank')
                .text("More information »")
                .appendTo($('<p></p>').appendTo(popup));
        }

        m.bindPopup(popup.html(), {
            minWidth: 400,
            maxWidth: 400,
            autoPanPaddingTopLeft: L.point(46, 5),
            autoPanPaddingBottomRight: L.point(88, 5)
        });

        // highlight clicked buildings, for touch devices
        // (with a real mouse, the highlight clears on mouseout)
        m.on('click', function(){
            this.setStyle({ fillOpacity: 0.5 });
        });
    }
}
