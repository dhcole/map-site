// Formats gdocs json data as geojson and maps it

var gdocs = {};

gdocs.geojson = function(d) {
    var geojson = { 'type': 'FeatureCollection',
            'features': []
        };
    
    _.each(d.feed.entry, function(item) {
        geojson.features.push({
            type: 'Feature',
            id: item['gsx$uniqueid'].$t,
            geometry: {
                type: 'Point',
                coordinates: [
                    parseFloat(item['gsx$longitude'].$t), 
                    parseFloat(item['gsx$latitude'].$t)
                ]
            },
            properties: {
                title: item['gsx$occupation'].$t + ': ' + item['gsx$incidenttype'].$t,
                "marker-color": '#ff0000',
                "marker-symbol": 'circle'
            }
        });
    });
    
    return geojson;
};

gdocs.map = function(geojson) {
    var ml = mmg()
        .factory(simplestyle_factory)
        .features(geojson.features);
    MM_map.addLayer(ml);
    mmg_interaction(ml);
    MM_map.setCenter(MM_map.getCenter());
};

gdocs.fetch = function(url) {
    reqwest({
        url: url,
        type: 'jsonp',
        jsonCallback: 'callback',
        success: function(d) {
            gdocs.map(gdocs.geojson(d));
        }
    });
};

gdocs.start = function(url) {
    gdocs.fetch(url);
}
