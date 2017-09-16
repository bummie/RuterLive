// Ikoner
var ikonBase  = "img/ikoner/";
var ikoner = 
        {
            buss: ikonBase + 'buss.png',
            selected: ikonBase + 'selected.png',
            tbane: ikonBase + 'tbane.png',
            tog: ikonBase + 'tog.png',
            trikk: ikonBase + 'trikk.png',
            baat: ikonBase + 'baat.png'

        };

// Map
var osloCoords = {lat: 59.9138688, lng: 10.7522454};
var map;
var trafficLayer;
var bussMarkers = new Array();

var selectedMarkerRoute = null;
var selectedMarkerTransport = null;

// Misc
var inc = 0;

window.mapsCallback = function ()
{
    initMap();
};

function initMap()
{
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: osloCoords
    });
    
    trafficLayer = new google.maps.TrafficLayer();
    setInterval(updateMap, 10); 
    setInterval(updateSanntid, 5000); 
}

function setTrafikkLag()
{ 
    console.log("Trafikk");
    if(document.getElementById("chkMapTraffic").checked)
        trafficLayer.setMap(map);
    else
        trafficLayer.setMap(null);
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
                    }
                }   
            }
        }
        
        console.log(inc + " OI");
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