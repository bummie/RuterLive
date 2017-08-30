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
setInterval(updateSanntid, 10000); 

function initMap()
{
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: osloCoords
    });
}

function updateMap()
{
    if(!UPDATING_SANNTID)
    {
        console.log("UPDATING MOVEMENT");
        if(ROUTE_MANAGER != null && ROUTE_MANAGER.length > 0)
        {
            for(var i = 0; i < ROUTE_MANAGER.length; i++)
            {
                var transport = ROUTE_MANAGER[i].getTransport();
                for(var j = 0; j < transport.length; j++)
                { 
                    if(transport[j].getLastPosition() == null)
                        transport[j].setLastPosition(ROUTE_MANAGER[i].getPositionFromStop(transport[j].getOriginId()));
                    transport[j].setTowardsPosition(ROUTE_MANAGER[i].getPositionFromStop(transport[j].getHeadingTo()));
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
                UPDATING_SANNTID_SIZE += stops.length;
                UPDATING_SANNTID = true;
                for(var j = 0; j < stops.length; j++)
                {
                    getSanntid(stops[j].getId(), ROUTE_MANAGER[i].getId());
                }
            }
        }
    }
}