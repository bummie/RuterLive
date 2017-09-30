// Seb (c) 2017

var ROUTE_MANAGER = new Array();
var last_zoom = -1;
function Route(id, stopArray, transType, stopsSorted)
{
    this.id = id;
    this.stops = stopArray
    this.transport = new Array();
    this.transportType = transType;
    this.stopsSorted = stopsSorted;
    
    this.updateSanntid = false;
    this.updateSanntidAmount = 0;
    this.updateSanntidSize = 0;
    
    this.getId = function()
    {
        return this.id;
    }
    
    this.getStops = function()
    {
        return this.stops;
    }
    
    this.getTransport = function()
    {
        return this.transport;
    }
    
    this.setTransport = function(transportArray)
    {
        this.transport = transportArray; 
    }
    
    this.getTransportationType = function()
    {
        return this.transportType;
    }
    
    this.areStopsSorted = function()
    {
        return this.stopsSorted;
    }
    
    this.getPositionFromStop = function(stopId)
    {
        var stops = this.getStops();
        for(var i = 0; i < stops.length; i++)
        {
            if(stops[i].getId() == stopId)
                return stops[i].getPosition();
        }
    }
}

function Stop(id, name, position)
{
    this.id = id;
    this.name = name;
    this.position = position;
    
    this.getId = function()
    {
        return this.id;
    }
    
    this.getName = function()
    {
        return this.name;
    }
    
    this.getPosition = function()
    {
        return this.position;
    }
}

function doneLoadingStops(stopsArray, linje, transType, sorted)
{
    if(stopsArray != null && stopsArray.length > 0)
    {
        print("Added " + stopsArray.length + " stops to Routearray");
        var pos = ROUTE_MANAGER.length;
        for(var i = 0; i < pos; i++)
        {
            if(ROUTE_MANAGER[i] == null)
            {
                pos = i;
                break;
            }
        }
        ROUTE_MANAGER[pos] = new Route(linje, stopsArray, transType, sorted);
        updateDropdown();

    }else
        print("Fikk ingen stopp");
}

function doneLoadingTransport(transportArray, linje)
{
    // Finne Ruten dataen gjelder for
    var route = null;
    for(var i = 0; i < ROUTE_MANAGER.length; i++)
    {
        if(ROUTE_MANAGER[i] == null)
            return;
        if(ROUTE_MANAGER[i].getId() == linje)
        {
            route = ROUTE_MANAGER[i];
            break;
        }
    }

    route.updateSanntidAmount += 1;

    if(transportArray != -1 && transportArray != null)
    {
           // Finne transport i forhold til id og oppdatere data
        var transportRouteArray = route.getTransport();
        for(var i = 0; i < transportArray.length; i++)
        {
            var transportId = transportArray[i]["MonitoredVehicleJourney"].VehicleRef;
            //console.log("TransportID: " + transportId);
            var hasFoundTransport = false;
            if(transportId != null)
            {
                //console.log("Str_transportArray: " + transportRouteArray.length);
                for(var j = 0; j < transportRouteArray.length; j++)
                {
                    if(transportId == transportRouteArray[j].getId())
                    {
                        hasFoundTransport = true;
                        transportRouteArray[j] = updateTransport(transportRouteArray[j], transportArray[i], route);
                        break;
                    }
                }

                if(!hasFoundTransport)
                {
                    var added = false;
                    for(var j = 0; j < transportRouteArray.length; j++)
                    {
                        //console.log(j + " " + transportRouteArray[j]);
                        if(transportRouteArray[j] == null)
                        {
                            transportRouteArray[j] = generateTransport(transportArray[i], route.getTransportationType(), route.getId());
                            added = true;
                            break;
                        }
                    }
                    if(!added)
                    {
                        transportRouteArray[transportRouteArray.length] = generateTransport(transportArray[i], route.getTransportationType(), route.getId());
                    }     
                }
            }
        }    
        route.setTransport(transportRouteArray);
    }    
    print(LOG_PARSE + " Henter sanntidsdata ["+route.updateSanntidAmount+"/"+route.updateSanntidSize+"]");
    if(route.updateSanntidAmount >= route.updateSanntidSize)
    {
        route.updateSanntid = false;
        route.updateSanntidAmount = 0;
        route.updateSanntidSize = 0;
    }

    updateDropdown();
    //console.log("Received " + transportArray.length + " transports");
}
    
function generateTransport(data, transType, routeId)
{
    if(data != null)
    {         
        var ikon = generateMapsIcon(transType, true);
        
        var marker = new google.maps.Marker({
            icon: ikon,
            map: map,
            title: data["MonitoredVehicleJourney"].LineRef,
            label: {
                        text: shortenString(data["MonitoredVehicleJourney"]["MonitoredCall"].DestinationDisplay, 10),
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "17px"
                    }
        });
        
        var transObject = new Transport(data["MonitoredVehicleJourney"].VehicleRef, marker, osloCoords, routeId);
        
        transObject.setTitle(data["MonitoredVehicleJourney"]["MonitoredCall"].DestinationDisplay);
        transObject.setOriginId(data["MonitoredVehicleJourney"].OriginRef);
        transObject.setOriginName(data["MonitoredVehicleJourney"].OriginName);
        transObject.setDestinationId(data["MonitoredVehicleJourney"].DestinationRef);
        transObject.setDestinationName(data["MonitoredVehicleJourney"].DestinationName);
        transObject.setHeadingTo(data.MonitoringRef);
        transObject.setArrivalTime(new Date(data["MonitoredVehicleJourney"]["MonitoredCall"].ExpectedArrivalTime));
        
        transObject.getMarker().addListener('click', 
                                            function()
                                            {
                                                changeCurrentMarker(transObject.getId())
                                            });
        //print("Oppretet buss " + transObject.getId() );
        
        return transObject;
    }
    return null;
}

function updateTransport(transport, data, route)
{
    if(data != null && transport != null)
    {   
        // Sjekke om datotingen her fungerer
        var arrivalTime = new Date(data["MonitoredVehicleJourney"]["MonitoredCall"].ExpectedArrivalTime);
        
        // IF ARRIVALTIME HAS PASSED THEN NULL HENT NY TID YEAH
            // Bussen flytter seg fjerne gammel tid, ellers blir den superior yo 
            if(transport.getArrivalTime() < new Date())
            {
                transport.setHeadingFrom(transport.getHeadingTo());
                if(isStopNeighbour(route, transport.getHeadingFrom(), data.MonitoringRef) || transport.stuck === STUCK_RELEASE)
                {
                    console.log( transport.getId() + " ID Stopp: " + data.MonitoringRef + " HeadingFrom: " + transport.getHeadingFrom());
                    transport.setArrivalTime(null);
                    transport.stuck = STUCK_FREE;
                }else
                {
                    transport.stuck = STUCK_STUCK;
                }
            }
        
            if(transport.getArrivalTime() > arrivalTime || transport.getArrivalTime() === null)
            {
                if(transport.getHeadingFrom() == null)
                    transport.setHeadingFrom(transport.getHeadingTo());
                transport.setHeadingTo(data.MonitoringRef);
                transport.setArrivalTime(arrivalTime);
                transport.setTitle(data["MonitoredVehicleJourney"]["MonitoredCall"].DestinationDisplay);
                transport.getMarker().label.text = shortenString(transport.getTitle(), 10);
            }   
        
        return transport;
    }
    return null;
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

function updateStopMarkers()
{
    if(selectedMarkerRoute != null && !getCheckboxValue("chkHideStops"))
    {
        if(loaded_stops_markers_line == null)
        {
           populateStopMarkers();
        }
        else if(loaded_stops_markers_line !== ROUTE_MANAGER[selectedMarkerRoute].getId())
        {
            emptyStopMarkers();
            populateStopMarkers();
        }
        
        if(map.getZoom() !== last_zoom)
            updateStopMarkersLabels();
    }else
    {
       emptyStopMarkers();
    }
}

function updateStopMarkersLabels()
{
     if(selectedMarkerRoute != null && !getCheckboxValue("chkHideStops"))
    {
        if(loaded_stops_markers_line != null)
        {
            var stops = ROUTE_MANAGER[selectedMarkerRoute].getStops();
            for(var i = 0; i < stops.length; i++)
            {
                var labelText = " ";
                if(map.getZoom() >= 14)
                    labelText = stops[i].getName();
                var label =
                {
                    text: labelText,
                    color: "black",
                    fontSize: "14px"
                }
                loaded_stops_markers[i].setLabel(label);
            }
            last_zoom = map.getZoom();
        }
        
    }
}

// Oppretter stoppemarkører
function populateStopMarkers()
{
    var ikon = generateMapsIcon(ikoner.stop, false);

    var stops = ROUTE_MANAGER[selectedMarkerRoute].getStops();
    for(var i = 0; i < stops.length; i++)
    {
        var marker = new google.maps.Marker(
        {
            icon: ikon,
            map: map
        });

        marker.setPosition(stops[i].getPosition());
        marker.setTitle(stops[i].getName());
        loaded_stops_markers[i] = marker;
    }

    loaded_stops_markers_line = ROUTE_MANAGER[selectedMarkerRoute].getId();     
}

// Fjerner stoppesedmarkørene
function emptyStopMarkers()
{
 if(loaded_stops_markers_line != null)
    {
        for(var i = 0; i < loaded_stops_markers.length; i++)
        {
            if(loaded_stops_markers[i] != null)
            {
                loaded_stops_markers[i].setMap(null);
            }            
        }
        loaded_stops_markers = new Array(); 
        loaded_stops_markers_line = null;
    }
}

// Teste sjekke om nabo
function isStopNeighbour(route, id, neighid)
{
       var stops = route.getStops();
        for(var j = 0; j < stops.length; j++)
        {
            if(stops[j].getId() === id)
            {
                // Hvis stoppet etter i arrayen er nabo
                if(j+1 < stops.length-1)
                {
                    if(stops[j+1].getId() === neighid)
                        return true;
                }

                // Hvis stoppet før i arrayen er nabo
                if(j-1 >= 0)
                {
                    if(stops[j-1].getId() === neighid)
                        return true;
                }
            }
        }
    return false;
}