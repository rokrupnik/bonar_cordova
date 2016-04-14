var libs = require("Libraries");
var $ = libs.$;
var _ = libs._;
var ol = libs.ol;

var map, vectorSource, clusterSource;

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
        app.initMap();
        app.loadData();
        //app.geolocation();
    },
    
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
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
        $.getJSON('js/restaurants.json')
        .done(function (data) {

            vectorSource = new ol.source.Vector();

            _.forEach(data.restaurants, function (restaurant) {
                var point = new ol.geom.Point(ol.proj.fromLonLat(restaurant.coordinates.reverse()));
                var feat = new ol.Feature(point);
                vectorSource.addFeature(feat);
            });

            clusterSource = new ol.source.Cluster({
                source: vectorSource,
                distance: 20
            });

            map.addLayer(new ol.layer.Vector({
                source: clusterSource,
                style: new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: '#3399ff',
                            width: 2
                        }),
                        fill: new ol.style.Fill({
                            color: 'black'
                        })
                    })
                })
            }));
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

        
    },

    updateStatus: function (status) {
        $('#status').text(status);
    }
};

app.initialize();
