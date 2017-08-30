// Seb (c) 2017

var ROUTE_MANAGER = new Array();

function Route(id, stopArray)
{
    this.id = id;
    this.stops = stopArray
    this.transport = new Array();
    
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

function doneLoadingStops(stopsArray, linje)
{
    if(stopsArray != null)
    {
        console.log("Added " + stopsArray.length + " stops to Routearray");
        ROUTE_MANAGER[ROUTE_MANAGER.length] = new Route(linje, stopsArray);
    }
}

function doneLoadingTransport(transportArray, linje)
{
    if(transportArray != null)
    {
        // Finne Ruten dataen gjelder for
        var route = null;
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            if(ROUTE_MANAGER[i].getId() == linje)
            {
                route = ROUTE_MANAGER[i];
                break;
            }
        }
        
        // Finne transport i forhold til id og oppdatere data
        var transportRouteArray = route.getTransport();
        for(var i = 0; i < transportArray.length; i++)
        {
            var transportId = transportArray[i]["MonitoredVehicleJourney"].VehicleRef;
            console.log("TransportID: " + transportId);
            var hasFoundTransport = false;
            if(transportId != null)
            {
                console.log("Str_transportArray: " + transportRouteArray.length);
                for(var j = 0; j < transportRouteArray.length; j++)
                {
                    if(transportId == transportRouteArray[j].getId())
                    {
                        hasFoundTransport = true;
                        transportRouteArray[j] = updateTransport(transportRouteArray[j], transportArray[i] );
                        break;
                    }
                }
                
                if(!hasFoundTransport)
                {
                        var added = false;
                        for(var j = 0; j < transportRouteArray.length; j++)
                        {
                            console.log(j + " " + transportRouteArray[j]);
                            if(transportRouteArray[j] == null)
                            {
                                transportRouteArray[j] = generateTransport(transportArray[i]);
                                added = true;
                                break;
                            }
                        }
                        if(!added)
                        {
                            transportRouteArray[transportRouteArray.length] = generateTransport(transportArray[i]);
                            console.log("La til i egen");
                        }
                            
                }
            }
        }
        route.setTransport(transportRouteArray);

        console.log("Received " + transportArray.length + " transports");
    }
}
    
function generateTransport(data)
{
    if(data != null)
    { 
        var marker = new google.maps.Marker({
            icon: ikoner.buss,
            map: map,
            title: data["MonitoredVehicleJourney"].LineRef,
            label: data["MonitoredVehicleJourney"].LineRef
        });
        var transObject = new Transport(data["MonitoredVehicleJourney"].VehicleRef, marker, osloCoords);
        
        transObject.setTitle(data["MonitoredVehicleJourney"]["MonitoredCall"].DestinationDisplay);
        //transObject.setOriginId(data["MonitoredVehicleJourney"].OriginRef);
        transObject.setOriginName(data["MonitoredVehicleJourney"].OriginName);
        transObject.setDestinationId(data["MonitoredVehicleJourney"].DestinationRef);
        transObject.setDestinationName(data["MonitoredVehicleJourney"].DestinationName);
        transObject.setHeadingTo(data.MonitoringRef);
        transObject.setArrivalTime(new Date(data["MonitoredVehicleJourney"]["MonitoredCall"].ExpectedArrivalTime));
        
        return transObject;
    }
    return null;
}

function updateTransport(transport, data)
{
    if(data != null && transport != null)
    {   
        var arrivalTime = new Date(data["MonitoredVehicleJourney"]["MonitoredCall"].ExpectedArrivalTime);
        if(transport.getArrivalTime() > arrivalTime )
        {
            transport.setHeadingTo(data.MonitoringRef);
            transport.setArrivalTime(arrivalTime);
        }
        
        return transport;
    }
    return null;
}