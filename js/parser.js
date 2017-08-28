// Parse all the data!

var stopPosFileLocation = "data/StoppeSteder.stop";

// Dummydata
var bussStopTestIdListe = [3010013, 3010017, 3010065, 3010076, 3010110, 3010132, 3010140, 3010143, 3010146, 3010151, 3010152, 3010153, 3010154, 3010155, 3010156, 3010157, 3010162, 3010163, 3010164, 3010436, 3010437, 3010441, 3010442, 3010445, 3010446, 3010447, 3010465, 3010510, 3010519, 3010524, 3010531, 3012134, 3012135 ];


// Henter stoppestedposisjon fra stoppesteder.stop
function getStopPositions(stoppIdList)
{
    if(stoppIdList != null && stoppIdList.length > 0)
    {
        var stopsList = new Array(stoppIdList.length);
        var arrayIncrementer = 0;
        $.get(stopPosFileLocation, function(response) 
        {
            var fileLine = response.split("\n");
            $.each(fileLine, function(n, bussStopp) 
            {
                $.each(stoppIdList, function(i, stoppId) 
                {
                    var busSplit = bussStopp.split(",");
                    if(busSplit[0] == stoppId)
                    {
                        var pos = {lat: busSplit[2], lng: busSplit[3]};
                        stopsList[arrayIncrementer] = new Stop(busSplit[0], busSplit[1], pos);
                        
                        
                        console.log(stopsList[arrayIncrementer].getName());
                        arrayIncrementer++;
                    }
                });
            });
        });
        return stopsList;
    }
    else
        return null;
}