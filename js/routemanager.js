// Todo smart shit


// 1 Velger rute
// 2 Henter rute
// Søker gjennom stoppesteder basert på idene i rutefilene
// Lager Stoppobjekter og plasserer de i Routeobjekt
// Sorterer de i forhold til distanse mellom stoppene
// KJØRE BUSSER

// getStopPositions(bussStopTestIdListe);
function Route()
{
    this.id = 0;
    this.stops = new Array(0);
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

function test()
{
     var stops = getStopPositions(bussStopTestIdListe);
    
    // jquery leser fil i bakgrunn blir ferdig etter koden under kjører FIKSE
if(stops != null)
    console.log(stops[1].getName());

}

function doneLoadingStops(stopsArray)
{
    if(stopsArray != null)
    {
        for(var i = 0; i < stopsArray.length; i++)
        {
            if(stopsArray[i] != null)
            {
                console.log(i + " " + stopsArray[i].getId() + "" + stopsArray[i].getName());    
            }else
            {
                console.log(i + " er null");
            }

        }    
    }else
    {
        console.log("null stopsArray");
    }
}
