// MAP GENERATED FROM: https://mapbuildr.com/buildr/x20rcx

google.maps.event.addDomListener(window, 'load', initMap);
var map;
function initMap() {
    var mapOptions = {
        center: new google.maps.LatLng(41.393294, -103.472901),
        zoom: 5,
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
        styles: [
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 65
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 51
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 30
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 40
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "hue": "#ffff00"
                    },
                    {
                        "lightness": -25
                    },
                    {
                        "saturation": -97
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": -25
                    },
                    {
                        "saturation": -100
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
    var urlPath = document.location.hostname === "localhost" ? '' : '/', imgPath = urlPath + 'pwna_assets/images/reservations/';
    jQuery.getJSON(urlPath + 'pwna_assets/js/locations.json?t=' + new Date().getTime(), function(data) {
        console.log('success');
        jQuery.each(data, function(i, location) {
            var Coordinates = location['Coordinates'].split(',');
            //console.log(location['Marker']);
            var marker = new google.maps.Marker({
                icon: imgPath + location['Marker'],
                position: new google.maps.LatLng(Coordinates[0], Coordinates[1]),
                map: map
            });
            link = '';
            bindInfoWindow(marker, map, location);
        });
    }).error(function() {
        console.log('error');
    });
    var iw;
    function bindInfoWindow(marker, map, location) {
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
            return '<div class="map-info">' +
                    '<h4>' + location['Reservation Name'] + '</h4>' +
                    '<p class="clearfix">' +
                    '<img src="' + imgPath + location['Image'] + '" alt="' + location['Reservation Name'] + '"/>' +
                    '<strong>State:</strong> ' + location['State'] + '<br/>' +
                    '<strong>Tribe Name:</strong> ' + location['Tribe Name'] + '<br/>' +
                    '<strong>Population:</strong> ' + location['Population'] + '<br/>' +
                    '<strong>% Below Poverty:</strong> ' + location['% Below Poverty'] + '<br/>' +
                    '<strong>Tribal Enrollment:</strong> ' + location['Tribal Enrollment'] + '<br/>' +
                    '<strong>Size (acres):</strong> ' + location['Size (acres)'] + '<br/>' +
                    '<strong>Communities/Chapters/Towns:</strong> ' + location['Communities/Chapters/Towns'] + '<br/>' +
                    (location['Link'] ? '<a class="pull-right" href="' + location['Link'] + '">Learn More <i class="fa fa-chevron-circle-right"></i></a>' : '') +
                    '</p>' +
                    '</div>';
        }

        if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
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
        }
        google.maps.event.addListener(marker, 'click', function() {
            if (getHTML() == iw.getContent()) {
                iw.setContent('');
                iw.close(map, marker);
            } else {
//                google.maps.event.trigger(marker, 'mouseover');
                iw.setContent(getHTML());
                iw.open(map, marker);
            }

        });
        google.maps.event.addListener(iw, 'closeclick', function() {
            iw.setContent('');
        });
    }
}