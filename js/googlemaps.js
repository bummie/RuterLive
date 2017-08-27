
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

// Markers
var bussMarker = null
var markerSpeed = 0.00005;

setInterval(updateMap, 100); 

function initMap()
{
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: osloCoords
        });
    
    bussMarker = new google.maps.Marker({
            position: osloCoords,
            icon: ikoner.buss,
            map: map,
            title: "30"
    });
    
    var buss = new Transport(3);
    console.log(buss.getId());
    //bussMarker.setAnimation(google.maps.Animation.BOUNCE);
}

function updateMap()
{
    var newPos = {
                    lat: bussMarker.getPosition().lat()+markerSpeed, 
                    lng: bussMarker.getPosition().lng()+markerSpeed
                };
    bussMarker.setPosition(newPos);
}