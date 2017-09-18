// HTML UI COMS
var CONSOLE_DELAY = 1500;
var CONSOLE_LAST_MESSAGE_TIME = new Date();


function btnAddTransport()
{
    var inputValue = document.getElementById("inputTransportId").value;
    if(inputValue != null || inputValue === "" )
    {
        getLinjeData(inputValue);
        print("Henter stoppdata for rute " + inputValue);
        //document.getElementById("btnAddTransport").disabled = true;
    }
}

function btnSettingsSave(){}

// Close button in the settings menu
function btnSettingsClose()
{
    if(document.getElementById("settingsContainer") != null)
        document.getElementById("settingsContainer").style.display = "none";
}

function btnSettingsOpen()
{
    if(document.getElementById("settingsContainer") != null)
        document.getElementById("settingsContainer").style.display = "block";
}

function btnRemoveTransport()
{
    var selectRoute = document.getElementById("selectRoute");
    if(selectRoute != null)
    {
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            if(selectRoute.value == i)
            {
                var tran = ROUTE_MANAGER[i].getTransport();
                for(var j = 0; j < tran.length; j++)
                {
                    tran[j].getMarker().setMap(null);
                }
                ROUTE_MANAGER[i] = null;
                print("Slettet rute: " + selectRoute.value);
            }
        }
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            if(ROUTE_MANAGER[i] != null)
            {
                selectedMarkerRoute = i;
                selectedMarkerTransport = 0;
            }
        }
        updateDropdown();
    }
}

function updateInfo()
{
    if(selectedMarkerRoute != null && selectedMarkerTransport != null)
    {
        var route = ROUTE_MANAGER[selectedMarkerRoute];
        if(route != null)
            var tran = route.getTransport()[selectedMarkerTransport];
        else return;
        if(tran != null)
        {
            var changeSecond =  Math.trunc(Math.abs((new Date() - tran.getArrivalTime())/1000));
            document.getElementById("textInfo").innerHTML = getStopNameFromId(selectedMarkerRoute, tran.getHeadingTo()) + " - " + changeSecond + "sek";
        }
    }
    
    // Om siste melding blir for gammel så fjerner vi den
    if(((new Date()) - CONSOLE_LAST_MESSAGE_TIME) >= CONSOLE_DELAY)
    {
            document.getElementById("textConsole").style.display = "none";
    }
        
}

function print(text)
{
    console.log(text);
    document.getElementById("textConsole").innerHTML = text;
    document.getElementById("textConsole").style.display = "inline-block";
    CONSOLE_LAST_MESSAGE_TIME = new Date();
}

function updateDropdown()
{
    var selectRoute = document.getElementById("selectRoute");
    var selectTransport = document.getElementById("selectTransport");
    
    if(ROUTE_MANAGER.length != selectRoute.length)
    {
        $('#selectRoute').empty()

        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            if(ROUTE_MANAGER[i] != null)
            {
                var valg = document.createElement("option");
                valg.text = ROUTE_MANAGER[i].getId();
                valg.value = i;
                selectRoute.add(valg);   
            }
        }
    }
    
    onChangeRoute();
}

function onChangeRoute()
{
    if(ROUTE_MANAGER.length > 0)
    {
        if(ROUTE_MANAGER[selectRoute.options[selectRoute.selectedIndex].value] != null)
        {
           var transportArr = ROUTE_MANAGER[selectRoute.options[selectRoute.selectedIndex].value].getTransport();
        
            if(transportArr != null && transportArr.length > 0)
            {
                if(transportArr.length != selectTransport.length)
                {
                    $('#selectTransport').empty()
                    for(var i = 0; i < transportArr.length; i++)
                    {
                        var valg = document.createElement("option");
                        valg.text = transportArr[i].getId();
                        valg.value = i;
                        selectTransport.add(valg);
                    }
                }
            } 
        }
    }
    updateSelected();
}
  
function onChangeTransport()
{
    updateSelected();  
}

function updateSelected()
{
    var selectRoute = document.getElementById("selectRoute");
    var selectTransport = document.getElementById("selectTransport");
    
    if(selectRoute.length > 0 && selectTransport.length > 0)
    {
        if(selectedMarkerRoute != null && ROUTE_MANAGER[selectedMarkerRoute] != null)
            changeIcon( ROUTE_MANAGER[selectedMarkerRoute].getTransport()[selectedMarkerTransport], getMarkerIcon(ROUTE_MANAGER[selectedMarkerRoute].getTransportationType()));
        
        selectedMarkerRoute = selectRoute.options[selectRoute.selectedIndex].value;
        selectedMarkerTransport = selectTransport.options[selectTransport.selectedIndex].value;
        
        if(ROUTE_MANAGER[selectedMarkerRoute] != null)
            changeIcon( ROUTE_MANAGER[selectedMarkerRoute].getTransport()[selectedMarkerTransport], ikoner.selected);
    }
}

function setSelected(routeIndex, transportIndex)
{
    // Rydde opp i repitesjon senere yo
    var selectRoute = document.getElementById("selectRoute");
    var selectTransport = document.getElementById("selectTransport");
    
    if(routeIndex != null && transportIndex != null)
    {
        selectRoute.value = routeIndex;
        selectTransport.value = transportIndex;
    }
}

function changeCurrentMarker(vehicleId)
{
    if(ROUTE_MANAGER != null && ROUTE_MANAGER.length > 0)
    {
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            if(ROUTE_MANAGER[i] != null)
            {
                var transport = ROUTE_MANAGER[i].getTransport();
                for(var j = 0; j < transport.length; j++)
                { 
                    if(transport[j].getId() == vehicleId)
                    {
                       setSelected(i, j);
                    }
                }    
            }
        }
    }    
}

function changeIcon(transport, icon)
{
    if(transport != null && icon != null)
    {
        transport.getMarker().setIcon(generateMapsIcon(icon, false));
    }
}

function generateMapsIcon(iconVal, erTransportType)
{
    var url;
    if(erTransportType)
        url = getMarkerIcon(iconVal);
    else
        url = iconVal;
     var ikon =
            {
                url: url, 
                scaledSize: new google.maps.Size(20, 24),
                origin: new google.maps.Point(0,0), 
                anchor: new google.maps.Point(0, 0), 
                labelOrigin: new google.maps.Point(10, -10),
                rotation: 270
            };
    return ikon;
}

function getMarkerIcon(transType)
{
    console.log("Transporttype: " + transType);
    switch(transType)
    {
        case 1:
        case 2:
            return ikoner.buss;    
        break;

        case 5:
            return ikoner.baat;    
        break;
        
        case 6:
            return ikoner.tog;    
        break;
        
        case 7:
            return ikoner.trikk;    
        break;
        
        case 8:
            return ikoner.tbane;    
        break;
            
        default: 
            return ikoner.buss;
        break;
            
    }
}