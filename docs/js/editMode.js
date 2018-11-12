function editMode(){
    // setup Leaflet.draw
    var drawnItems = L.featureGroup();
    map.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
        draw: {
            polyline: false,
            circle: false,
            polygon: {
                allowIntersection: false,
                drawError: {
                    color: '#f00',
                    timeout: 1000
                },
                shapeOptions: {
                    color: '#f60',
                    fillOpacity: 0.5,
                    stroke: false
                },
                repeatMode: true
            },
            rectangle: {
                shapeOptions: {
                    color: '#f60',
                    fillOpacity: 0.5,
                    stroke: false
                },
                repeatMode: true
            }
        },
        edit: {
            featureGroup: drawnItems,
            edit: {
                selectedPathOptions: {
                    color: '#f60',
                    fillOpacity: 0.5
                }
            }
        }
    });
    map.addControl(drawControl);

    map.on('draw:created', function(e){
        drawnItems.addLayer(e.layer);
        if(e.layerType != 'marker')
            e.layer.setStyle({ fillOpacity: 0.2 });
        e.layer.on('click', function(e){
            var outline = [];
            if(this instanceof L.Marker){
                outline.push(this._latlng.lat);
                outline.push(this._latlng.lng);
            } else{
                $.each(this._latlngs, function(i, vertex){
                    outline.push([vertex.lat, vertex.lng]);
                });
            }
            //prompt("Outline data:", JSON.stringify(outline));
            var textbox = L.DomUtil.create('input');
            textbox.value = JSON.stringify(outline);
            textbox.onclick = function(){
                this.select();
            };
            L.popup().setLatLng(e.latlng).setContent(textbox).openOn(map);
        });
    });

    var clearDrawnItems = function(){
        if(confirm("Clear all drawn shapes?"))
            drawnItems.clearLayers();
    };
    map.addControl(new ButtonControl('reset', clearDrawnItems));
}
