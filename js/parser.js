// Parse all the data!

var stopPosFileLocation = "data/StoppeSteder.stop";
var URL_SANNTID = "php/index.php?type=sanntid";
var URL_STOPPESTEDER = "php/index.php?type=stops";

var LOG_PARSE = "[PARSER]: ";

function getSanntid(stoppId, linje)
{
    var URL_SANNTID = "php/index.php?type=sanntid&id=" + stoppId + "&linje=" + linje;

    if(linje != null)
    {
        jQuery.ajax(
        {
            url: URL_SANNTID,
            success: function(response)
            {
                var data = JSON.parse(response);
                
                console.log(LOG_PARSE + " getSanntid done");

                doneLoadingTransport(data, linje);
            },
            async:true
        });
    }
}

function getStops(linje)
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
                console.log(LOG_PARSE + " getStops done");
                getStartStop(stoppArr, linje);
            },
            async:true
        });
    }
}

function getStartStop(stoppArray, linje)
{
    var URL_SANNTID = "php/index.php?type=sanntid&id=" + stoppArray[0] + "&linje=" + linje;

    if(linje != null)
    {
        jQuery.ajax(
        {
            url: URL_SANNTID,
            success: function(response)
            {
                var data = JSON.parse(response);
                var startStoppId = data[0]["MonitoredVehicleJourney"].OriginRef;
                
                console.log(LOG_PARSE + " getStartStop done");
                getStopPositions(stoppArray, startStoppId, linje);
            },
            async:true
        });
    }
}

// Henter stoppestedposisjon fra stoppesteder.stop
function getStopPositions(stoppIdList, startStopp, linje)
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
                                var pos = {lat: parseFloat(busSplit[2]), lng: parseFloat(busSplit[3])};
                                stopsList[arrayIncrementer] = new Stop(busSplit[0], busSplit[1], pos);  
                                
                                arrayIncrementer++;
                            }
                        });
                    });
                console.log(LOG_PARSE + " getStopPositions done");
                print(LOG_PARSE + " getStopPositions done");

                doneLoadingStops(sorterStopp(stopsList, startStopp), linje);
            },
            async:true
        });
    }
    else
        doneLoadingStops(null);
}

// Sorterer busstoppene, de nærmeste ved siden av hverandre
function sorterStopp(stoppArray, startStopp)
{
    for ( i = 0; i < stoppArray.length; i++)
    {
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
                if(shortestDistance == null || dist < shortestDistance )
                {
                    shortestDistance = dist;
                    shortestDistIndex = i;
                }
            }
        }
        //console.log(stoppArray[shortestDistIndex].getName());
        if(sortertArray.length-1 >= (j+1))
        {
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
        return dist;
}