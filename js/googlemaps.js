// Ikoner
var ikonBase  = "img/ikoner/";
var ikoner = 
        {
            buss: ikonBase + 'buss.png',
            selected: ikonBase + 'selected.png',
            tbane: ikonBase + 'tbane.png',
            tog: ikonBase + 'tog.png',
            trikk: ikonBase + 'trikk.png',
            baat: ikonBase + 'baat.png',
            stop: ikonBase + 'stopp.png'
        };

// Map
var osloCoords = {lat: 59.9138688, lng: 10.7522454};
var linePathCoords = [{lat: 59.9138688, lng: 10.7522454}, {lat: 59.9138688, lng: 10.7522454}];
var map;
var trafficLayer;
var linePath;
var bussMarkers = new Array();

var selectedMarkerRoute = null;
var selectedMarkerTransport = null;

// Misc
var inc = 0;
var loaded_stops_markers_line = null;
var loaded_stops_markers = new Array();

window.mapsCallback = function ()
{
    initMap();
};

// Backbutton pressed
$(window).on('hashchange', function() 
{
    if(window.location.hash === "" || !window.location.hash)
    {
        btnSettingsClose();
        btnHelpClose();
        btnHistoryClose();
    }
});

function initMap()
{
    map = new google.maps.Map(document.getElementById('map'),
{
        zoom: 12,
        center: osloCoords,
        disableDefaultUI: true,
        gestureHandling: "greedy",
        styles:
        [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ebe3cd"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#523735"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f1e6"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#c9b2a6"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#dcd2be"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#ae9e90"
              }
            ]
          },
          {
            "featureType": "administrative.neighborhood",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dfd2ae"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dfd2ae"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#93817c"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#a5b076"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#447530"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f1e6"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#fdfcf8"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f8c967"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#e9bc62"
              }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e98d58"
              }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#db8555"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#806b63"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dfd2ae"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8f7d77"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#ebe3cd"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dfd2ae"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#b9d3c2"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#92998d"
              }
            ]
          }
        ] 
    });
    
    // Linje tegnet fra transport til stoppested
    linePath = new google.maps.Polyline({
          path: linePathCoords,
          geodesic: true,
          strokeColor: '#d93838',
          strokeOpacity: .8,
          strokeWeight: 2
        });
    linePath.setMap(map);
    trafficLayer = new google.maps.TrafficLayer();
    
    // Load stored settings
    loadSettings();
    
    setInterval(updateMap, 10); 
    setInterval(updateSanntid, 5000); 
}

function updateMap()
{
    if(ROUTE_MANAGER != null && ROUTE_MANAGER.length > 0)
    {
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            if(ROUTE_MANAGER[i] != null)
            {
                if(!ROUTE_MANAGER[i].updateSanntid)
                {
                    //print("Flytter " + ROUTE_MANAGER[i].getId());
                    var transport = ROUTE_MANAGER[i].getTransport();
                    for(var j = 0; j < transport.length; j++)
                    { 
                        if(transport[j].getLastPosition() == null)
                            transport[j].setLastPosition(ROUTE_MANAGER[i].getPositionFromStop(transport[j].getOriginId()));
                        transport[j].setTowardsPosition(ROUTE_MANAGER[i].getPositionFromStop(transport[j].getHeadingTo()));

                        if(transport[j].getHeadingFrom() != null)
                            transport[j].setLastPosition(ROUTE_MANAGER[i].getPositionFromStop(transport[j].getHeadingFrom()));
                        
                        if(transport[j].stuck === STUCK_STUCK)
                            transport[j].stuck = STUCK_RELEASE;
                    }
                }   
            }
        }
        
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            if(ROUTE_MANAGER[i] != null)
            {
                var transport = ROUTE_MANAGER[i].getTransport();
                for(var j = 0; j < transport.length; j++)
                { 
                    transport[j].move(inc);
                }
            }
        }   
        inc = 0;
        
        // Make google maps follow selected marker
        if(selectedMarkerRoute != null && getCheckboxValue("chkMapFollow"))
            map.setCenter(ROUTE_MANAGER[selectedMarkerRoute].getTransport()[selectedMarkerTransport].getPosition());
        
        // Draw line where transport is heading
       drawHeadingToLine()
        
        //Oppdateringer
        updateStopMarkers();
        updateInfo();
    }
    // Oppdatere UI
    updateHide();
}

function updateSanntid()
{
    if(ROUTE_MANAGER != null && ROUTE_MANAGER.length > 0)
    {
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        { 
            if(ROUTE_MANAGER[i] != null)
            {
               if(!ROUTE_MANAGER[i].updateSanntid)
                {
                    inc = 1;
                    var stops = ROUTE_MANAGER[i].getStops();
                    if(stops != null && stops.length > 0)
                    {
                        ROUTE_MANAGER[i].updateSanntidSize = stops.length;
                        ROUTE_MANAGER[i].updateSanntid = true;
                        for(var j = 0; j < stops.length; j++)
                        {
                            var stop = stops[j];
                            if(stop != null)
                                stop = stop.getId();
                            
                                getSanntid(stop, ROUTE_MANAGER[i].getId(), ROUTE_MANAGER[i].getTransportationType());
                        } 
                    }
                    else
                        print("Stops er tom");
                } 
            }
        }
    }
}

function drawHeadingToLine()
{
    if(selectedMarkerRoute != null && getCheckboxValue("chkMapLine"))
    {
        if(linePath.getMap() == null)
            linePath.setMap(map);
        var transport = ROUTE_MANAGER[selectedMarkerRoute].getTransport()[selectedMarkerTransport];
        var lineCoords = [transport.getPosition(), transport.getTowardsPosition()];
        linePath.setPath(lineCoords);
    }else
    {
        if(linePath.getMap() != null)
            linePath.setMap(null);
    }
}

function setTrafikkLag()
{ 
    console.log("Trafikk");
    if(getCheckboxValue("chkMapTraffic"))
        trafficLayer.setMap(map);
    else
        trafficLayer.setMap(null);
}
