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
        styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"labels.text","stylers":[{"color":"#ff0000"},{"saturation":"50"},{"gamma":"8.34"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#0f252e"},{"lightness":17}]}]
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