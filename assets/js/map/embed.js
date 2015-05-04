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
        styles: [{"featureType": "all", "elementType": "labels.text.fill", "stylers": [{"saturation": 36}, {"color": "#000000"}, {"lightness": 40}]}, {"featureType": "all", "elementType": "labels.text.stroke", "stylers": [{"visibility": "on"}, {"color": "#000000"}, {"lightness": 16}]}, {"featureType": "all", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative", "elementType": "geometry.fill", "stylers": [{"color": "#000000"}, {"lightness": 20}]}, {"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{"color": "#000000"}, {"lightness": 17}, {"weight": 1.2}]}, {"featureType": "landscape", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 20}]}, {"featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{"visibility": "simplified"}]}, {"featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{"visibility": "off"}]}, {"featureType": "landscape.man_made", "elementType": "labels.text", "stylers": [{"color": "#ff0000"}, {"saturation": "50"}, {"gamma": "8.34"}]}, {"featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 21}]}, {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#000000"}, {"lightness": 17}]}, {"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#000000"}, {"lightness": 29}, {"weight": 0.2}]}, {"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 18}]}, {"featureType": "road.local", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 16}]}, {"featureType": "transit", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 19}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#0f252e"}, {"lightness": 17}]}]
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

    jQuery.getJSON((document.location.hostname === "localhost" ? '' : '/') + 'pwna_assets/js/locations.json?t=' + new Date().getTime(), function(data) {
        console.log('success');
        jQuery.each(data, function(i, location) {
            var Coordinates = location['Coordinates'].split(',');
            //console.log(location['Marker']);
            var marker = new google.maps.Marker({
                icon: location['Marker'],
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
                    '<p>' +
                    '<strong>State:</strong> ' + location['State'] + '<br/>' +
                    '<strong>Tribe Name:</strong> ' + location['Tribe Name'] + '<br/>' +
                    '<strong>Population:</strong> ' + location['Population'] + '<br/>' +
                    '<strong>% Below Poverty:</strong> ' + location['% Below Poverty'] + '<br/>' +
                    '<strong>Tribal Enrollment:</strong> ' + location['Tribal Enrollment'] + '<br/>' +
                    '<strong>Size (acres):</strong> ' + location['Size (acres)'] + '<br/>' +
                    '<strong>Communities/Chapters/Towns:</strong> ' + location['Communities/Chapters/Towns'] + '<br/>' +
                    '</p>' +
                    '</div>';
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