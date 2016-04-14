var libs = require("Libraries");
var $ = libs.$;
//var L = libs.L;
//var _ = libs._;
var ol = libs.ol;

var map;

var app = {	
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        //app.receivedEvent('deviceready');
        app.loadData();
        app.initMap();
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    },

    // Load data
    loadData: function () {
        $.getJSON('js/restaurants.json')
        .done(function (data/*, d2*/) {
            //ugly, just testing...
            data = data[0];


            //app.updateStatus(data.length);


            //d2 = d2[0];
            /*_.forEach(data, function (restaurant) {
                if("Ljubljana" in d2)
                {
                    // continue with original code
                    var lat = restaurant.coordinates[0] * 1;
                    var lon = restaurant.coordinates[1] * 1;
                    L.marker([lat, lon], { icon: markerIcon })
                        .bindPopup(
                            restaurant.name + '<br />' +
                            restaurant.address + '<br />' +
                            restaurant.price + '<br />'
                            )
                        .addTo(map);
                }
            });*/
        });
    },

    initMap: function () {
        /*********************************** OPENLAYERS ***********************************/

        map = new ol.Map({
            target: 'mapid',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.MapQuest({layer: 'osm'})
                })
            ]
        });

        map.setView(new ol.View({
                center: ol.proj.fromLonLat([14.514713, 46.0565274]),
                zoom: 13
            }));

        //app.updateStatus('OLMap init success');

        /*********************************** LEAFLET **********************************/
        //map = L.map('mapid');
        /*L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a>'
        }).addTo( map );*/
        /*var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib = 'Map data © OpenStreetMap contributors';
        var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib });

        map.setView(new L.LatLng(46.0565274, 14.514713), 13);
        map.addLayer(osm);
        
        map.on('resize', function(e) {
            console.log("Resizing :: " + e);
        });*/
    },

    updateStatus: function (status) {
        $('#status').text(status);
    }
};

app.initialize();