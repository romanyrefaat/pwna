// MAP GENERATED FROM: https://mapbuildr.com/buildr/x20rcx
// http://stackoverflow.com/questions/13084631/google-maps-open-infowindow-on-mouseover-close-reopen-on-click
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
        styles: [{"featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{"color": "#f7f1df"}]}, {"featureType": "landscape.natural", "elementType": "geometry", "stylers": [{"color": "#d0e3b4"}]}, {"featureType": "landscape.natural.terrain", "elementType": "geometry", "stylers": [{"visibility": "off"}]}, {"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {"featureType": "poi.business", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "poi.medical", "elementType": "geometry", "stylers": [{"color": "#fbd3da"}]}, {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#bde6ab"}]}, {"featureType": "road", "elementType": "geometry.stroke", "stylers": [{"visibility": "off"}]}, {"featureType": "road", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#ffe15f"}]}, {"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#efd151"}]}, {"featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{"color": "#ffffff"}]}, {"featureType": "road.local", "elementType": "geometry.fill", "stylers": [{"color": "black"}]}, {"featureType": "transit.station.airport", "elementType": "geometry.fill", "stylers": [{"color": "#cfb2db"}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#a2daf2"}]}],
    }
    var mapElement = document.getElementById('pwna_map');
    var map = new google.maps.Map(mapElement, mapOptions);
    var locations = [
        ['Blackfoot Nation', 'Population Census 10,000', 'Tribe: Blackfoot', 'undefined', 'undefined', 46.8796822, -110.3625658, 'https://mapbuildr.com/assets/img/markers/solid-pin-red.png'], ['Crow Agency Reservation', 'Tribe: Crow', 'Population Census: 6,894', 'undefined', 'undefined', 48.0090814507565, -112.3849192107208, 'https://mapbuildr.com/assets/img/markers/solid-pin-red.png'], ['Colorado River Indian Res.', 'Population Census: 7,466', 'Tribe: Colorado River', 'undefined', 'undefined', 34.0489281, -111.0937311, 'https://mapbuildr.com/assets/img/markers/solid-pin-purple.png']
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
            return "<div style='color:#000;background-color:#fff;padding:5px;width:150px;'><h4>" + title + "</h4><p>" + desc + "<p><p>" + telephone + "<p></div>";
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