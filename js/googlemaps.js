// Ikoner
var ikonBase  = "img/ikoner/";
var ikoner = 
        {
          buss: ikonBase + 'ikon_buss.png',
          buss_selected: ikonBase + 'ikon_buss_selected.png',
          tbane: ikonBase + 'ikon_buss.png',
          tog: ikonBase + 'ikon_buss.png'
        };

// Map
var osloCoords = {lat: 59.9138688, lng: 10.7522454};
var map;
var bussMarkers = new Array();

var selectedMarkerRoute = null;
var selectedMarkerTransport = null;

setInterval(updateMap, 10); 
setInterval(updateSanntid, 5000); 

function initMap()
{
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: osloCoords
    });
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
                    print("Flytter " + ROUTE_MANAGER[i].getId());
                    var transport = ROUTE_MANAGER[i].getTransport();
                    for(var j = 0; j < transport.length; j++)
                    { 
                        if(transport[j].getLastPosition() == null)
                            transport[j].setLastPosition(ROUTE_MANAGER[i].getPositionFromStop(transport[j].getOriginId()));
                        transport[j].setTowardsPosition(ROUTE_MANAGER[i].getPositionFromStop(transport[j].getHeadingTo()));

                        if(transport[j].getHeadingFrom() != null)
                            transport[j].setLastPosition(ROUTE_MANAGER[i].getPositionFromStop(transport[j].getHeadingFrom()));
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
                    transport[j].move();
                }
            }
        }   
        
        if(selectedMarkerRoute != null && document.getElementById("chkMapFollow").checked)
            map.setCenter(ROUTE_MANAGER[selectedMarkerRoute].getTransport()[selectedMarkerTransport].getPosition());

        updateInfo();
    }
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
                    var stops = ROUTE_MANAGER[i].getStops();
                    if(stops != null && stops.length > 0)
                    {
                        ROUTE_MANAGER[i].updateSanntidSize = stops.length;
                        ROUTE_MANAGER[i].updateSanntid = true;
                        for(var j = 0; j < stops.length; j++)
                        {
                            if(stops[j] != null)
                                getSanntid(stops[j].getId(), ROUTE_MANAGER[i].getId(), ROUTE_MANAGER[i].getTransportationType());
                        } 
                    }
                    else
                        print("Stops er tom");
                } 
            }
        }
    }
}

function changeCurrentMarker(vehicleId)
{
    if(ROUTE_MANAGER != null && ROUTE_MANAGER.length > 0)
    {
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            var transport = ROUTE_MANAGER[i].getTransport();
            for(var j = 0; j < transport.length; j++)
            { 
                if(transport[j].getId() == vehicleId)
                {
                   setSelected(i, j);
                }
            }
        }
    }    
}

function changeIcon(transport, icon)
{
    if(transport != null && icon != null)
    {
        transport.getMarker().setIcon(icon);
    }
}

function getStopNameFromId(routeId, stopId)
{
    if(routeId != null && stopId != null)
    {
        var stops = ROUTE_MANAGER[routeId].getStops();
        for(var i = 0; i < stops.length; i++)
        {
            if(stops[i].getId() == stopId)
                return stops[i].getName();
        }
    }
}