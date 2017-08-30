// Ikoner
var ikonBase  = "img/ikoner/";
var ikoner = {
          buss: ikonBase + 'ikon_buss.png',
          trikk: ikonBase + 'ikon_buss.png',
          tbane: ikonBase + 'ikon_buss.png',
          tog: ikonBase + 'ikon_buss.png'
        };

// Map
var osloCoords = {lat: 59.9138688, lng: 10.7522454};
var map;
var bussMarkers = new Array();

setInterval(updateMap, 100); 
setInterval(updateSanntid, 5000); 

function initMap()
{
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: osloCoords
        });
    
    generateBusses(5, map);
}

function updateMap()
{
    for(var i = 0; i < bussMarkers.length; i++)
    {
        bussMarkers[i].move();
    }
    //console.log("Routes = " + ROUTE_MANAGER.length);
}

function updateSanntid()
{
   if(ROUTE_MANAGER != null && ROUTE_MANAGER.length > 0)
    {
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            var stops = ROUTE_MANAGER[i].getStops();
            for(var j = 0; j < stops.length; j++)
            {
                getSanntid(stops[j].getId(), ROUTE_MANAGER[i].getId());
                for(var x = 0; x < ROUTE_MANAGER[i].getTransport().length; x++)
                {
                    ROUTE_MANAGER[i].getTransport()[x].setPosition(stops[j].getPosition());
                }
            }
        }
    } 
}


function generateBusses(antall)
{
    for(var i = 0; i < antall; i++)
    {
        var marker = new google.maps.Marker({
            icon: ikoner.buss,
            map: map,
            title: "30",
            label: "411"
        });
        bussMarkers[i] = new Transport(i, marker, osloCoords);
        var ranVel = {x: Math.random() * 0.001, y: Math.random() * 0.001};
        bussMarkers[i].setVelocity(ranVel);
    }
}