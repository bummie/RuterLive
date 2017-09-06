// Seb (c) 2017

var ROUTE_MANAGER = new Array();
var UPDATING_SANNTID = false;
var UPDATING_SANNTID_AMOUNT = 0;
var UPDATING_SANNTID_SIZE = 0;

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
        console.log("TRANSTYPE PÅ RUTEN ER : " + transType);
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
                        transportRouteArray[j] = updateTransport(transportRouteArray[j], transportArray[i] );
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
                            transportRouteArray[j] = generateTransport(transportArray[i], route.getTransportationType());
                            added = true;
                            break;
                        }
                    }
                    if(!added)
                    {
                        transportRouteArray[transportRouteArray.length] = generateTransport(transportArray[i], route.getTransportationType());
                        //console.log("La til i egen");
                    }     
                }
            }
        }    
        route.setTransport(transportRouteArray);
    }    
    print(LOG_PARSE + " Henter sanntidsdata ["+route.updateSanntidAmount+"/"+route.updateSanntidSize+"]");
    //console.log(UPDATING_SANNTID_AMOUNT + " : " + UPDATING_SANNTID_SIZE);
    if(route.updateSanntidAmount >= route.updateSanntidSize)
    {
        route.updateSanntid = false;
        route.updateSanntidAmount = 0;
        route.updateSanntidSize = 0;
    }

    updateDropdown();
    //console.log("Received " + transportArray.length + " transports");
}
    
function generateTransport(data, transType)
{
    if(data != null)
    {         
        var ikon =
            {
                url: getMarkerIcon(transType), // url
                scaledSize: new google.maps.Size(20, 24),
                origin: new google.maps.Point(0,0), 
                anchor: new google.maps.Point(0, 0), 
                labelOrigin: new google.maps.Point(10, -10)
            };
        
        var marker = new google.maps.Marker({
            icon: ikon,
            map: map,
            title: data["MonitoredVehicleJourney"].LineRef,
            label: {
                        text: data["MonitoredVehicleJourney"].LineRef,
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "20px"
                    }
        });
        
        var transObject = new Transport(data["MonitoredVehicleJourney"].VehicleRef, marker, osloCoords);
        
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

function updateTransport(transport, data)
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
                transport.setArrivalTime(null);
            }
                
            if(transport.getArrivalTime() > arrivalTime || transport.getArrivalTime() == null)
            {
                if(transport.getHeadingFrom() == null)
                    transport.setHeadingFrom(transport.getHeadingTo());
                transport.setHeadingTo(data.MonitoringRef);
                transport.setArrivalTime(arrivalTime);
                transport.setTitle(data["MonitoredVehicleJourney"]["MonitoredCall"].DestinationDisplay);
            }    
        
        return transport;
    }
    return null;
}