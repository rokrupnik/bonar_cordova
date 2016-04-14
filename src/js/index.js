var libs = require("Libraries");
var $ = libs.$;
var L = libs.L;
var _ = libs._;

var map, markerIcon;
markerIcon = L.icon({
    iconUrl: 'img/lib/marker-icon.png',
    iconAnchor: [0, 0]
    /*iconRetinaUrl: 'my-icon@2x.png',
    iconSize: [38, 95],
    popupAnchor: [-3, -76],
    shadowUrl: 'my-icon-shadow.png',
    shadowRetinaUrl: 'my-icon-shadow@2x.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]*/
});

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
        app.geolocation();
    },
    
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    
    // Get location
    geolocation: function() {
        var onSuccess = function(position) {
            alert('Latitude: '          + position.coords.latitude          + '\n' +
                  'Longitude: '         + position.coords.longitude         + '\n' +
                  'Altitude: '          + position.coords.altitude          + '\n' +
                  'Accuracy: '          + position.coords.accuracy          + '\n' +
                  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                  'Heading: '           + position.coords.heading           + '\n' +
                  'Speed: '             + position.coords.speed             + '\n' +
                  'Timestamp: '         + position.timestamp                + '\n');
        };

        var onError = function(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    },

    // Load data
    loadData: function () {
        $.when(
            $.getJSON('js/restaurants.json'),
            $.getJSON('js/restaurant_clusters.json')
        ).done(function (data, d2) {
            //ugly, just testing...
            data = data[0];
            d2 = d2[0];
            _.forEach(data, function (restaurant) {
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
            });
        });
    },

    initMap: function () {
        map = L.map('mapid');
        /*L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a>'
        }).addTo( map );*/
        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib = 'Map data © OpenStreetMap contributors';
        var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib });

        map.setView(new L.LatLng(46.0565274, 14.514713), 13);
        map.addLayer(osm);
        
        map.on('resize', function(e) {
            console.log("Resizing :: " + e);
        });
    },

    updateStatus: function (status) {
        $('#status').text(status);
    }
};

app.initialize();
