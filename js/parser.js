// Parse all the data!

var stopPosFileLocation = "data/StoppeSteder.stop";
var linjerFileLocation = "data/Linjer.json";

var URL_SANNTID = "php/index.php?type=sanntid";
var URL_STOPPESTEDER = "php/index.php?type=stops";

var LOG_PARSE = "[PARSER]: ";

function getSanntid(stoppId, linje, transType)
{
    if(stoppId != null)
    {
       var URL_SANNTID = "php/index.php?type=sanntid&id=" + stoppId;
    
        if(transType === 2 || transType === 7 || transType === 8 ) // Om buss legg til filter
             URL_SANNTID = URL_SANNTID + "&linje=" + linje;

        //print( transType + " " + URL_SANNTID);
        if(linje != null)
        {
            jQuery.ajax(
            {
                url: URL_SANNTID,
                error: function()
                {
                    print("Henting av sanntid brukte for lang tid");
                    doneLoadingTransport(null, linje);

                },
                success: function(response)
                {
                    var data = JSON.parse(response);

                    console.log(LOG_PARSE + " getSanntid done");

                    doneLoadingTransport(data, linje);
                },
                timeout: 10000,
                async:true
            });
        } 
    }
    else
    {
        doneLoadingTransport(null, linje);
    }   
}

function getStops(linje, transType)
{
    var URL_SANNTID = "php/index.php?type=stops&linje=" + linje;

    if(linje != null)
    {
        jQuery.ajax(
        {
            url: URL_SANNTID,
            success: function(response)
            {
                var data = JSON.parse(response);
                var stoppArr = new Array(data.length);
                //console.log(stoppArr.length);
                for(var i = 0; i < data.length; i++)
                {
                    stoppArr[i] = data[i].ID;
                    //console.log(i + " " + data[i].ID);
                }
                print(LOG_PARSE + " getStops done");
                getStartStop(stoppArr, linje, transType);
            },
            async:true
        });
    }
}

function getStartStop(stoppArray, linje, transType)
{
    var URL_SANNTID = "php/index.php?type=sanntid&id=" + stoppArray[0] 
    
    if(transType === 2 || transType === 7 || transType === 8 ) // Om buss legg til filter
         URL_SANNTID = URL_SANNTID + "&linje=" + linje;
    
    console.log(URL_SANNTID);
    
    if(linje != null)
    {
        jQuery.ajax(
        {
            url: URL_SANNTID,
            success: function(response)
            {
                var data = JSON.parse(response);
                if(data != null && data.length > 0)
                {
                    var startStoppId = data[0]["MonitoredVehicleJourney"].OriginRef;
                    if(startStoppId == null)
                        print("Fant ingen startId");
                    
                    print(LOG_PARSE + " getStartStop done");
                    getStopPositions(stoppArray, startStoppId, linje, transType);    

                }else
                    print(LOG_PARSE + "Fant ikke startId, kan ikke hente stoppesteder");
                
            },
            async:true
        });
    }
}

// Henter stoppestedposisjon fra stoppesteder.stop
function getStopPositions(stoppIdList, startStopp, linje, transType)
{
    if(stoppIdList != null && stoppIdList.length > 0)
    {
        var stopsList = new Array(stoppIdList.length);
        var arrayIncrementer = 0;
        jQuery.ajax(
        {
            url: stopPosFileLocation,
            success: function(response)
            {
                 var fileLine = response.split("\n");
                    $.each(fileLine, function(n, bussStopp) 
                    {
                        $.each(stoppIdList, function(i, stoppId) 
                        {
                            var busSplit = bussStopp.split(",");
                            if(busSplit[0] == stoppId)
                            {
                                //print(busSplit[0] + " = " + stoppId);
                                var pos = {lat: parseFloat(busSplit[2]), lng: parseFloat(busSplit[3])};
                                stopsList[arrayIncrementer] = new Stop(busSplit[0], busSplit[1], pos);  
                                
                                arrayIncrementer++;
                            }
                        });
                    });
                
                print(LOG_PARSE + " getStopPositions done, " + arrayIncrementer + " stopp funnet");
                var sortert = false;
                if(startStopp != null && stopsList != null)
                {
                    stopsList = sorterStopp(stopsList, startStopp);
                    sortert = true;
                }
                
                if(stopsList != null)
                    doneLoadingStops(stopsList, linje, transType, sortert);
                else
                    print("Feil med sortering");
            },
            async:true
        });
    }
    else
        doneLoadingStops(null);
}

// Henter busslinjedata fra Linjer.json
function getLinjeData(linjeNavn)
{
    if(linjeNavn != null)
    { 
        linjeNavn = linjeNavn.toUpperCase();
        jQuery.ajax(
        {
            url: linjerFileLocation,
            success: function(response)
            {
                var funnetNavn = false;
                var idEksisterer = false;
                for(var i = 0; i < response.length; i++)
                {
                    if(response[i].Name === linjeNavn)
                    {
                        for(var j = 0; j < ROUTE_MANAGER.length; j++)
                        {
                            if(ROUTE_MANAGER[j] != null)
                            {
                                if(ROUTE_MANAGER[j].getId() === response[i].ID )
                                idEksisterer = true;   
                            }
                        }
                        
                        if(!idEksisterer)
                            getStops(response[i].ID, response[i].Transportation);
                        funnetNavn = true;
                        break;
                    }
                }
                if(funnetNavn)
                    print("Fant linje: " + linjeNavn);
                else
                    print("Fant ikke linje: " + linjeNavn);
                 if(idEksisterer)
                    print("Denne linjen eksisterer allerede!");

            },
            async:true
        });
    }
    else
        print("Linje kan ikke være av typen null");
}

// Sorterer busstoppene, de nærmeste ved siden av hverandre
function sorterStopp(stoppArray, startStopp)
{
    for ( i = 0; i < stoppArray.length; i++)
    {
        if(stoppArray[i] ==  null)
            return null;
        if(stoppArray[i].getId() == startStopp)
        {
            startStopp = i;
            break;
        }
    }
    
    var sortertArray = new Array(stoppArray.length);
    sortertArray[0] = stoppArray[startStopp];
    stoppArray[startStopp] = null;
    for ( j = 0; j < sortertArray.length; j++)
    {
        var shortestDistance = null;
        var shortestDistIndex= null;
        for ( i = 0; i < stoppArray.length; i++)
        {
            if(stoppArray[i] != null && sortertArray[j] != null)
            {
                var dist = calculateDistance(sortertArray[j].getPosition().lat, sortertArray[j].getPosition().lng, stoppArray[i].getPosition().lat, stoppArray[i].getPosition().lng, "K");
                if(shortestDistance == null || shortestDistIndex == null || dist < shortestDistance )
                {
                    shortestDistance = dist;
                    shortestDistIndex = i;
                }
            }else
            {
                print("StoppArray er null");
            }
        }
        //console.log(stoppArray[shortestDistIndex].getName());
        if(sortertArray.length-1 >= (j+1))
        {
            if(shortestDistIndex == null)
                print("NULL INDEX");
            if(stoppArray[shortestDistIndex] == null)
                print("NULL SORTERT");
            sortertArray[j+1] = stoppArray[shortestDistIndex];
            stoppArray[shortestDistIndex] = null;    
        }   
    }
    return sortertArray;
}
 
// Regner ut avstand mellom to koordinater
function calculateDistance(lat1, lon1, lat2, lon2, unit)
{
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var radlon1 = Math.PI * lon1/180
        var radlon2 = Math.PI * lon2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist*1000;
}