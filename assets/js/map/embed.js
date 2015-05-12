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
    var pb = new progressBar({colorBar: '#c5664f'});
    map.controls[google.maps.ControlPosition.RIGHT].push(pb.getDiv());
    // Construct the polygon.
    var states = ['Montana', 'Idaho', 'North Dakota', 'Wyoming', 'South Dakota', 'Utah', 'Nebraska', 'California', 'Arizona', 'New Mexico'];
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
    var locations = [];
    jQuery.getJSON(urlPath + 'pwna_assets/js/locations.json?t=' + new Date().getTime(), function(data) {
        //console.log('success');
        pb.start(data.length);
        jQuery.each(data, function(i, location) {
            setTimeout(function() {
                pb.updateBar(1);
                var Coordinates = location['Coordinates'].split(',');
                //console.log(location['Marker']);
                var marker = new google.maps.Marker({
                    icon: imgPath + location['Marker'],
                    position: new google.maps.LatLng(Coordinates[0], Coordinates[1]),
                    map: map
                });
                link = '';
                bindInfoWindow(marker, map, location);
                location['mapMarker'] = marker;
                locations.push(location);
                if (i === pb.getTotal() - 1) {
                    pb.hide();
                    buildFilterNav(locations, 'Service Area,State,Tribe Name');
                }
            }, 50 + (i * 50));
        });
    }).error(function() {
        console.log('error');
    });

    function buildFilterNav(locations, columns) {
        var cols = columns.split(','),
                filterNav = jQuery('<div class="map-filter"></div>'),
                buildFilterList = function(select, column, parentColumn, parentValue) {
            for (i = 0; i < locations.length; i++) {
                if (typeof parentColumn !== 'undefined' && typeof parentValue !== 'undefined' && locations[i][parentColumn].indexOf(parentValue) < 0) {
                    continue;
                }
                var optionVal = locations[i][column].split(',');
                for (v = 0; v < optionVal.length; v++) {
                    if (jQuery('option', select).filter(':contains("' + optionVal[v] + '")').length === 0) {
                        select.append('<option>' + optionVal[v] + '</option>');
                    }
                }
            }
        };
        for (x = 0; x < cols.length; x++) {
            var select = jQuery('<select name="' + cols[x] + '"></select>')
                    , selectDiv = jQuery('<div><label>' + cols[x] + '</label></div>').hide();
            select.append('<option>All</option>');
            if (x === 0) {
                buildFilterList(select, cols[x]);
                selectDiv.show();
            }
            select.change(function() {
                var idx = jQuery(this).parent().index(), showAll = true;
                if (idx < cols.length - 1) {
                    jQuery('select:gt(' + idx + ')', filterNav).find("option:gt(0)").remove();
                    buildFilterList(jQuery('select:eq(' + (idx + 1) + ')', filterNav), cols[idx + 1], jQuery(this).attr('name'), jQuery(this).val());
                    jQuery('>div', filterNav).show();
                    jQuery('select option:only-child', filterNav).closest('div').hide();
                }
                jQuery('select', filterNav).each(function() {
                    var column = jQuery(this).attr('name'), value = jQuery(this).val();
                    showAll = showAll && jQuery(this).val() === 'All';
                    for (i = 0; i < locations.length; i++) {
                        if (jQuery(this).val() !== 'All') {
                            if ((column === 'State' && locations[i][column].indexOf(value) < 0) || (column !== 'State' && locations[i][column] !== value)) {
                                locations[i]['mapMarker'].setVisible(false);
                            } else {
                                locations[i]['mapMarker'].setVisible(true);
                            }
                        } else if (showAll) {
                            locations[i]['mapMarker'].setVisible(true);
                        }
                    }
                });
            });
            filterNav.append(selectDiv.append(select));
        }
        var filterToggle = jQuery('<a class="toggle" href="#"><span class="fa-stack fa-lg"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search fa-stack-1x fa-inverse"></i></span></a>')
        filterToggle.click(function(e) {
            e.preventDefault();
            filterNav.toggleClass('on');
            jQuery(this).find('.fa-stack-1x').toggleClass('fa-search fa-close')
        });
        jQuery('#pwna_map').prepend(filterToggle).prepend(filterNav);
    }

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

        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
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