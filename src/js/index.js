var $ = require("jquery");
var L = require("leaflet");
var _ = require("lodash");

var map;
var markerIcon = L.icon({
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

    // Load data
    loadData: function () {
        $.getJSON('js/restaurants.json')
            .then(function (data) {
                //app.updateStatus('Number of loaded restaurants: ' + data.length);
                //console.log('Number of loaded restaurants: ' + data.length);

                _.forEach(data, function (restaurant) {
                    var lat = restaurant.coordinates[0] * 1;
                    var lon = restaurant.coordinates[1] * 1;
                    L.marker([lat, lon], { icon: markerIcon })
                        .bindPopup(
                            restaurant.name + '<br />' +
                            restaurant.address + '<br />' +
                            restaurant.price + '<br />'
                            )
                        .addTo(map);
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
    },

    updateStatus: function (status) {
        $('#status').text(status);
    }
};

app.initialize();