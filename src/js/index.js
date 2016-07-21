var libs = require('Libraries');
var $ = libs.$;
var _ = libs._;
var ol = libs.ol;

// Main object
var app = 
{	
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    // deviceready Event Handler
    onDeviceReady: function () {
        // First start loading data
        app.loadData();
        
        // Init other stuff
        app.display.init();
        app.map.init();
        app.geolocation.init();
        app.settings.init();
        
        // Lastly resize the map -> hopefully this resets the map correctly
        app.map.initResizer();
    },
        
    // Load data
    loadData: function () {
        $.getJSON('js/restaurants.json')
        .done(function (data) { 
            app.restaurants = data.restaurants;
            app.cities = data.cities;
            app.restaurantFeatures = data.features;
            
            // After data loaded:
            app.onDataLoaded();
        });
    },
    
    // Run after all data in app.loadData is loaded
    onDataLoaded: function() {
        app.map.loadRestaurants();
    },
    
    display: {
        init: function() {
            // Get variables
            var fh = $(".site-footer").css("height");
            app.footerHeight = parseInt(fh.substring(0, fh.length - 2));
            
            // footer image click
            $(".footer-img").on("click", function() {
                app.display.switchTab($(this).attr("name"));
            });
            
            // switch to default tab
            app.display.switchTab("map");
        },
        
        switchTab: function (tab) {
            $(".tab").css("display", "none");
            $("#tab-" + tab).css("display", "initial");
            
            $(".tab-active").removeClass("tab-active");
            $(".footer-img[name='" + tab + "']").addClass("tab-active");
        }
    },
    
    settings: {
        //TODO...
        init: function() {}
        // getter: function(setting) {},
        // setter: function(setting, value) {}
    },
    
    geolocation: {
        onSuccess: function(position) {
            app.locationData.err  = null;
            app.locationData.lat  = position.coords.latitude;
            app.locationData.lon  = position.coords.longitude;
            app.locationData.acc  = position.coords.accuracy;
            app.locationData.time = position.timestamp;
        },

        onError: function(error) {
            app.locationData.err = error.message; //err.code needed?
        },

        getter: function() {
            // check settings...
            
            // Get location
            navigator.geolocation.getCurrentPosition(app.geolocation.onSuccess, app.geolocation.onError);
        },
        
        init: function() { app.geolocation.getter() }
    },
    
    map: {
        init: function () {
            app.vectorSource = new ol.source.Vector();

            app.clusterSource = new ol.source.Cluster({
                source: app.vectorSource,
                distance: 20
            });

            app.bigmap = new ol.Map({
                target: 'mapid',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    }),
                    new ol.layer.Vector({
                        source: app.clusterSource,
                        style: app.map.restaurantStyleFun
                    })
                ],
                // Disable rotate
                interactions: ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false})
            });

            app.bigmap.setView(new ol.View({
                center: ol.proj.fromLonLat([14.514713, 46.0565274]),
                zoom: 13
            }));

            var element = document.getElementById('popup');
            var popup = new ol.Overlay({
                element: element,
                positioning: 'bottom-center',
                stopEvent: false
            });
            app.bigmap.addOverlay(popup);
            $(element).popover({
                'placement': 'top',
                'html': true,
                'content': function() {
                    return $('#popover-content').html();
                }
            });

            // display popup on click
            app.bigmap.on('click', function(evt) {
                var feature = app.bigmap.forEachFeatureAtPixel(evt.pixel, function(feature) {
                    return feature;
                });
                if (feature) {
                    popup.setPosition(evt.coordinate);
                    $('#popover-content').html(app.map.contentFun(feature));
                    $(element).popover('show');
                } else {
                    $(element).popover('hide');
                }
            });

            // change mouse cursor when over marker
            $(app.bigmap.getViewport()).on('mousemove', function(e) {
                if (e.dragging) {
                    $(element).popover('hide');
                    return;
                }
                var pixel = app.bigmap.getEventPixel(e.originalEvent);
                var hit = app.bigmap.hasFeatureAtPixel(pixel);
                app.bigmap.getTargetElement().style.cursor = hit ? 'pointer' : '';
            });

            // hide popover on zoom - not working right now
            /*var mouseWheelZooom = new ol.interaction.MouseWheelZoom();
            mouseWheelZooom.on('change:active', function () {
                $('#popover').popover('hide');
            });
            map.addInteraction(mouseWheelZooom);*/
        }, 
        
        
        restaurantStyleFun: function (feature) {
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
                        iconSrc += 'pin-0.svg';
                        break;
                    case 1:
                        iconSrc += 'pin-1.svg';
                        break;
                    case 2:
                        iconSrc += 'pin-2.svg';
                        break;
                    case 3:
                        iconSrc += 'pin-3.svg';
                        break;
                    case 4:
                        iconSrc += 'pin-4.svg';
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
        },
        
        contentFun: function (feature) {
            var features = feature.get('features');
            var content = '';

            if (features.length > 1) {
                content = 'Na tem mestu je več restavracij.<br />Približaj za več info.';
            } else {
                feature = features[0];

                content = feature.get('name') + '<br />';
                content += feature.get('address') + '<br />';
                content += feature.get('price') + ' &euro;<br />';
                content += feature.get('opening');
            }
            return content;
        },
            
        initResizer: function () {
            var resizeFun = function() {
                var mapel = $(".app");                
                mapel.css("height", $("body").height() - app.footerHeight);
                mapel.css("width", $("body").width());
                app.bigmap.updateSize();
            };
            
            resizeFun()
            $(window).resize(resizeFun);
        },
        
        // Load pins in map
        loadRestaurants: function () {
            _.forEach(app.restaurants, function (restaurant) {
                var point = new ol.geom.Point(ol.proj.fromLonLat(restaurant.coordinates.reverse()));
                var feat = new ol.Feature(point);

                feat.set('name', restaurant.name);
                feat.set('address', restaurant.address);
                feat.set('price', restaurant.price);

                var opening = restaurant.opening.week[0];
                opening += "-" + restaurant.opening.week[1];
                if (restaurant.opening.saturday) {
                    opening += ", sob: " + restaurant.opening.saturday[0];
                    opening += "-" + restaurant.opening.saturday[1];
                }
                if (restaurant.opening.sunday) {
                    opening += ", ned: " + restaurant.opening.sunday[0];
                    opening += "-" + restaurant.opening.sunday[1];
                }

                feat.set('opening', opening);

                app.vectorSource.addFeature(feat);
            });
        }
    },
    
    // explicitally declared variables:
    bigmap:             null,
    smallmap:           null,
    vectorSource:       null,
    clusterSource:      null,
    
    restaurants:        null,
    cities:             null,
    restaurantFeatures: null,
    
    footerHeight:       null,
    locationData:       {},
    settingsData:       {}
};

// "main()"
app.initialize();
