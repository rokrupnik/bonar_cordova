var libs = require('Libraries');
var $ = libs.$;
var _ = libs._;
var ol = libs.ol;

var map, vectorSource, clusterSource;
var restaurantStyleFun = function (feature) {
    // color schemes for pins: https://coolors.co/app/e86500-8ea604-f5bb00-ec9f05-bf3100
    var features = feature.get('features');
    var iconSrc = 'img/';

    if (features.length > 1) {
        iconSrc += 'pin-cluster.png';
    } else {
        feature = features[0];
        var priceRange = parseInt(feature.get('price'));
        switch(priceRange) {
            case 0:
                iconSrc += 'pin-0.png';
                break;
            case 1:
                iconSrc += 'pin-1.png';
                break;
            case 2:
                iconSrc += 'pin-2.png';
                break;
            case 3:
                iconSrc += 'pin-3.png';
                break;
            case 4:
                iconSrc += 'pin-4.png';
                break;
            default:
                iconSrc += 'pin-cluster.png';
        }
    }

    var style = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 0.5,
            src: iconSrc
        }))
    });

    return [style];
};

var contentFun = function (feature) {
    var features = feature.get('features');
    var content = '';

    if (features.length > 1) {
        content = 'Na tem mestu je več restavracij, približaj za več info.';
    } else {
        feature = features[0];
        content = feature.get('price');
    }

    return content;
}

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
            _.forEach(data.restaurants, function (restaurant) {
                var point = new ol.geom.Point(ol.proj.fromLonLat(restaurant.coordinates.reverse()));
                var feat = new ol.Feature(point);
                feat.set('price', restaurant.price);
                vectorSource.addFeature(feat);
            });
        });
    },

    initMap: function () {

        vectorSource = new ol.source.Vector();

        clusterSource = new ol.source.Cluster({
            source: vectorSource,
            distance: 20
        });

        map = new ol.Map({
            target: 'mapid',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.MapQuest({layer: 'osm'})
                }),
                new ol.layer.Vector({
                    source: clusterSource,
                    style: restaurantStyleFun
                })
            ]
        });

        map.setView(new ol.View({
            center: ol.proj.fromLonLat([14.514713, 46.0565274]),
            zoom: 13
        }));

        var element = document.getElementById('popup');
        var popup = new ol.Overlay({
            element: element,
            positioning: 'bottom-center',
            stopEvent: false
        });
        map.addOverlay(popup);
        $(element).popover({
            'placement': 'top',
            'html': true,
            'content': function() {
                return $('#popover-content').html();
            }
        });

        // display popup on click
        map.on('click', function(evt) {
            var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                return feature;
            });
            if (feature) {
                popup.setPosition(evt.coordinate);
                $('#popover-content').html(contentFun(feature));
                $(element).popover('show');
            } else {
                $(element).popover('hide');
            }
        });

        // change mouse cursor when over marker
        $(map.getViewport()).on('mousemove', function(e) {
            if (e.dragging) {
                $(element).popover('hide');
                return;
            }
            var pixel = map.getEventPixel(e.originalEvent);
            var hit = map.hasFeatureAtPixel(pixel);
            map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        });
    }, 

    updateStatus: function (status) {
        $('#status').text(status);
    } 
};

app.initialize();
