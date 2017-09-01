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
        if(!UPDATING_SANNTID)
        {
            print("Flytter transportmidler");
            if(ROUTE_MANAGER != null && ROUTE_MANAGER.length > 0)
            {
                for(var i = 0; i < ROUTE_MANAGER.length; i++)
                {
                    var transport = ROUTE_MANAGER[i].getTransport();
                    for(var j = 0; j < transport.length; j++)
                    { 
                        if(transport[j].getLastPosition() == null)
                            transport[j].setLastPosition(ROUTE_MANAGER[i].getPositionFromStop(transport[j].getOriginId()));
                       
                        if(isNaN(transport[j].getPosition().lat || isNaN(transport[j].getPosition().lng)))
                        {
                            console.log("FANT EN NAN GJENOPPRETTER");
                        transport[j].setPosition(ROUTE_MANAGER[i].getPositionFromStop(transport[j].getHeadingTo()));
                        } transport[j].setTowardsPosition(ROUTE_MANAGER[i].getPositionFromStop(transport[j].getHeadingTo()));
                    }
                }
            }    
        } 

        if(ROUTE_MANAGER != null && ROUTE_MANAGER.length > 0)
        {
            for(var i = 0; i < ROUTE_MANAGER.length; i++)
            {
                var transport = ROUTE_MANAGER[i].getTransport();
                for(var j = 0; j < transport.length; j++)
                { 
                    transport[j].move();
                }
            }
        }    

        updateInfo();
    }
}

function updateSanntid()
{
    if(!UPDATING_SANNTID)
    {
        if(ROUTE_MANAGER != null && ROUTE_MANAGER.length > 0)
        {
            for(var i = 0; i < ROUTE_MANAGER.length; i++)
            {
                var stops = ROUTE_MANAGER[i].getStops();
                if(stops != null && stops.length > 0)
                {
                    UPDATING_SANNTID_SIZE += stops.length;
                    UPDATING_SANNTID = true;
                    for(var j = 0; j < stops.length; j++)
                    {
                        if(stops[j] != null)
                            getSanntid(stops[j].getId(), ROUTE_MANAGER[i].getId());
                    } 
                }
                else
                    print("Stops er tom");
            }
        }
    }
}

function changeCurrentMarker(vehicleId)
{
    if(ROUTE_MANAGER != null && ROUTE_MANAGER.length > 0)
    {
        if(selectedMarkerRoute != null)
            ROUTE_MANAGER[selectedMarkerRoute].getTransport()[selectedMarkerTransport].getMarker().setIcon(ikoner.buss);

        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            var transport = ROUTE_MANAGER[i].getTransport();
            for(var j = 0; j < transport.length; j++)
            { 
                if(transport[j].getId() == vehicleId)
                {
                    transport[j].getMarker().setIcon(ikoner.buss_selected);
                    selectedMarkerRoute = i;
                    selectedMarkerTransport = j;
                }
            }
        }
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

function btnAddTransport()
{
    var inputValue = document.getElementById("inputTransportId").value;
    if(inputValue != null || inputValue === "" )
    {
        getLinjeData(inputValue);
        print("Henter stoppdata for rute " + inputValue);
        document.getElementById("btnAddTransport").disabled = true;
    }
}

function updateInfo()
{
    if(selectedMarkerRoute != null && selectedMarkerTransport != null)
    {
        var tran = ROUTE_MANAGER[selectedMarkerRoute].getTransport()[selectedMarkerTransport];

        if(tran != null)
        {
            document.getElementById("infoTitle").innerHTML = "Tittel: " + tran.getTitle();
            document.getElementById("infoPosition").innerHTML = "Posisjon: " + tran.getPosition().lat + ",\n " + tran.getPosition().lng;
            //document.getElementById("infoTowardsPosition").innerHTML = "På vei til: " + tran.getTowardsPosition();
            //document.getElementById("infoLastPosition").innerHTML = "Forrige Pos: " + tran.getLastPosition();
            //document.getElementById("infoOriginId").innerHTML = "StartId: " + tran.getOriginId();
            document.getElementById("infoOriginName").innerHTML = "StartNavn: " + tran.getOriginName();
            //document.getElementById("infoDestinationId").innerHTML = "DestinasjonsId: " + tran.getDestinationId();
            document.getElementById("infoDestinationName").innerHTML = "DestinasjonsNavn: " + tran.getDestinationName();
            document.getElementById("infoHeadingTo").innerHTML = "NesteStopp: " + getStopNameFromId(selectedMarkerRoute, tran.getHeadingTo());
            document.getElementById("infoHeadingFrom").innerHTML = "SistStopp: " + getStopNameFromId(selectedMarkerRoute, tran.getHeadingFrom());
            
            var changeSecond = Math.abs((new Date() - tran.getArrivalTime())/1000);
            document.getElementById("infoTimeLeft").innerHTML = "Tid igjen: " + changeSecond + " sekunder";

        }
    }
}

function print(text)
{
    console.log(text);
    document.getElementById("infoConsole").innerHTML = text;
}