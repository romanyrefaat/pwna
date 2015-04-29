// MAP GENERATED FROM: https://mapbuildr.com/buildr/x20rcx

google.maps.event.addDomListener(window, 'load', initMap);
var map;
function initMap() {
    var mapOptions = {
        center: new google.maps.LatLng(41.393294, -103.472901),
        zoom: 4,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
        },
        disableDoubleClickZoom: false,
        mapTypeControl: false,
        scaleControl: false,
        scrollwheel: false,
        panControl: false,
        streetViewControl: false,
        draggable: true,
        overviewMapControl: false,
        overviewMapControlOptions: {
            opened: false,
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
                "featureType": "landscape",
                "stylers": [
                    {"hue": "#F1FF00"},
                    {
                        "saturation": -27.4
                    },
                    {
                        "lightness": 9.4
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "stylers": [
                    {
                        "hue": "#0099FF"
                    },
                    {
                        "saturation": -20
                    },
                    {
                        "lightness": 36.4
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "stylers": [
                    {
                        "hue": "#00FF4F"
                    },
                    {
                        "saturation": 0
                    },
                    {
                        "lightness": 0
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.local",
                "stylers": [
                    {
                        "hue": "#FFB300"
                    },
                    {
                        "saturation": -38
                    },
                    {
                        "lightness": 11.2
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "water",
                "stylers": [
                    {
                        "hue": "#00B6FF"
                    },
                    {
                        "saturation": 4.2
                    },
                    {
                        "lightness": -63.4
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "poi",
                "stylers": [
                    {
                        "hue": "#9FFF00"
                    },
                    {
                        "saturation": 0
                    },
                    {
                        "lightness": 0
                    },
                    {
                        "gamma": 1
                    }
                ]
            }
        ]
    }
    var mapElement = document.getElementById('pwna_map');
    var map = new google.maps.Map(mapElement, mapOptions);

    // Construct the polygon.
    var states = ['Montana', 'Idaho', 'North Dakota', 'Wyoming', 'South Dakota', 'Utah', 'Colorado', 'Nebraska', 'California', 'Arizona', 'New Mexico'];
    for (i = 0; i < states.length; i++) {
        bermudaTriangle = new google.maps.Polygon({
            paths: statesobj[states[i]],
            strokeColor: '#E22427',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#E22427',
            fillOpacity: 0.2,
            clickable: false
        });

        bermudaTriangle.setMap(map);
    }

    var locations = [
        ['Blackfoot Nation', 'Population Census 10,000', 'Tribe: Blackfoot', 'undefined', 'undefined', 46.8796822, -110.3625658, 'https://mapbuildr.com/assets/img/markers/default.png'],
        ['Crow Agency Reservation', 'Tribe: Crow', 'Population Census: 6,894', 'undefined', 'undefined', 48.0090814507565, -112.3849192107208, 'https://mapbuildr.com/assets/img/markers/solid-pin-orange.png'],
        ['Colorado River Indian Res.', 'Population Census: 7,466', 'Tribe: Colorado River', 'undefined', 'undefined', 34.0489281, -111.0937311, 'https://mapbuildr.com/assets/img/markers/solid-pin-purple.png']
    ];
    for (i = 0; i < locations.length; i++) {
        if (locations[i][1] == 'undefined') {
            description = '';
        } else {
            description = locations[i][1];
        }
        if (locations[i][2] == 'undefined') {
            telephone = '';
        } else {
            telephone = locations[i][2];
        }
        if (locations[i][3] == 'undefined') {
            email = '';
        } else {
            email = locations[i][3];
        }
        if (locations[i][4] == 'undefined') {
            web = '';
        } else {
            web = locations[i][4];
        }
        if (locations[i][7] == 'undefined') {
            markericon = '';
        } else {
            markericon = locations[i][7];
        }
        marker = new google.maps.Marker({
            icon: markericon,
            position: new google.maps.LatLng(locations[i][5], locations[i][6]),
            map: map,
            title: locations[i][0],
            desc: description,
            tel: telephone,
            email: email,
            web: web
        });
        link = '';
        bindInfoWindow(marker, map, locations[i][0], description, telephone, email, web, link);
    }
    var iw;
    function bindInfoWindow(marker, map, title, desc, telephone, email, web, link) {
        var infoWindowVisible = (function() {
            var currentlyVisible = false;
            return function(visible) {
                if (visible !== undefined) {
                    currentlyVisible = visible;
                }
                return currentlyVisible;
            };
        }());
        iw = new google.maps.InfoWindow();

        var getHTML = function() {
            return '<div class="map-info"><h4>' + title + '</h4><p>' + desc + '<p><p>' + telephone + '<p></div>';
        }

        google.maps.event.addListener(marker, 'mouseover', function() {
            var html = getHTML();
            if (iw && html == iw.getContent()) {
                return;
            }
            if (iw && html != iw.getContent()) {
                iw.close();
            }
            iw.setContent(html);
            iw.open(map, marker);
        });
        google.maps.event.addListener(marker, 'click', function() {
            if (getHTML() == iw.getContent()) {
                iw.setContent('');
                iw.close(map, marker);
            } else {
                google.maps.event.trigger(marker, 'mouseover');
            }

        });
        google.maps.event.addListener(iw, 'closeclick', function() {
            iw.setContent('');
        });
    }
}