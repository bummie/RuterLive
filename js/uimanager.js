// HTML UI COMS
var CONSOLE_DELAY = 1500;
var CONSOLE_LAST_MESSAGE_TIME = new Date();

var SIDEBAR_OPEN = false;

function btnAddTransport()
{
    var inputValue = document.getElementById("inputTransportId").value;
    if(inputValue != null || inputValue === "" )
    {
        getLinjeData(inputValue);
        print("Henter stoppdata for rute " + inputValue);
        //document.getElementById("btnAddTransport").disabled = true;
        
        $('#inputTransportId').blur();
    }
}

function btnShare()
{
    var url = getSelectedURL();
    $('#btnShare').attr('data-clipboard-text', url);
    alert("Copied: "+ getSelectedURL());
}

// Returns an URL for the selected route
function getSelectedURL()
{
    if(ROUTE_MANAGER.length > 0)
    {
        var routeName = ROUTE_MANAGER[selectedMarkerRoute].getName();
        var transportId = ROUTE_MANAGER[selectedMarkerRoute].getTransport()[selectedMarkerTransport].getId();
        
        return "http://ruter.live/?line=" + routeName + "&t=" + transportId;
    }else
    {
        return "Non-selected";
    }
}

// Viser og skjuler sidebarmenyen
// TODO: Rydde opp
function buttonArrow()
{
    if(!SIDEBAR_OPEN)
    {
        document.getElementById("btnHelp").style.display = "block";
        document.getElementById("btnShare").style.display = "block";
        document.getElementById("btnHistory").style.display = "block";
        document.getElementById("btnSettings").style.display = "block";

        document.getElementById("btnArrow").style.backgroundImage = "url('../img/ikoner/arrow_down.png')";

        SIDEBAR_OPEN = true;
    }else
    {
        document.getElementById("btnHelp").style.display = "none";
        document.getElementById("btnShare").style.display = "none";
        document.getElementById("btnHistory").style.display = "none";
        document.getElementById("btnSettings").style.display = "none";
        
        document.getElementById("btnArrow").style.backgroundImage = "url('../img/ikoner/arrow_up.png')";
        SIDEBAR_OPEN = false;
    }
}

function btnHistory(linje)
{
    getLinjeData(linje.toString());
    print("Henter stoppdata for rute " + linje);
    btnHistoryClose();
}

function btnSettingsSave(){}

// Close button in the settings menu
function btnSettingsClose()
{
    if(document.getElementById("settingsContainer") != null)
        document.getElementById("settingsContainer").style.display = "none";
    saveSettings();
}

function btnSettingsOpen()
{
    if(document.getElementById("settingsContainer") != null)
        document.getElementById("settingsContainer").style.display = "block";
    
    btnHelpClose();
    btnHistoryClose();
    addMenuHash();
}

// Close button in the help menu
function btnHelpClose()
{
    if(document.getElementById("helpContainer") != null)
        document.getElementById("helpContainer").style.display = "none";
}

function btnHelpOpen()
{
    if(document.getElementById("helpContainer") != null)
        document.getElementById("helpContainer").style.display = "block";
    
    btnSettingsClose();
    btnHistoryClose();
    addMenuHash();
}

// Close button in the history menu
function btnHistoryClose()
{
    if(document.getElementById("historyContainer") != null)
        document.getElementById("historyContainer").style.display = "none";
}

function btnHistoryOpen()
{
    if(document.getElementById("historyContainer") != null)
        document.getElementById("historyContainer").style.display = "block";
    
    btnSettingsClose();
    btnHelpClose();
    addMenuHash();
    loadHistory();
}

function addMenuHash()
{
    window.location.hash='m';
}

// Sletter valgt linje
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

// Laster inn tidligere søk fra cookies
function loadHistory()
{
    var hist = getHistory();
    var historyHtml = "<h1>Ingen tidligere søk å vise frem :(</h1>";

    // Finne bodyContainer til historydiven
    var historyDiv = document.getElementById("historyContainer");
    for (var i = 0; i < historyDiv.childNodes.length; i++)
    {
        var child = historyDiv.childNodes[i];
        if(child.id === "bodyContainer")
            historyDiv = child;
    }
    
    if(hist[0] != null)
    {
        historyHtml = "";
        for(var i = 0; i < hist.length; i++)
        {
            if(hist[i] != null)
                historyHtml += '<button id="btnHist" class="btnHistory" onclick="btnHistory(\'' + hist[i] + '\')">' + hist[i] + '</button>';
        }
        
    }
    
    historyDiv.innerHTML = historyHtml;
}

function updateHide()
{
    // Searchbar
    updateHideElementById("inputTransportId", "chkHideSearch");
    updateHideElementById("btnAddTransport", "chkHideSearch");
    
    // Select linje dropdowns
    updateHideElementById("bottomContainer", "chkHideSelect");
    
    // Infotextboxes
    updateHideElementById("textConsole", "chkHideTransportInfo");
    updateHideElementById("textInfo", "chkHideInfo");
}

function updateHideElementById(id, chkboxid)
{
     if(document.getElementById(id) != null)
     {
         if(getCheckboxValue(chkboxid))
            document.getElementById(id).style.display = "none";
         else
            document.getElementById(id).style.display = "inline-block";
     }
}

function getCheckboxValue(id)
{
    return document.getElementById(id).checked;
}

function setCheckboxValue(id, checked)
{
    return document.getElementById(id).checked = checked;
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
            document.getElementById("textInfo").innerHTML = getStopNameFromId(selectedMarkerRoute, tran.getHeadingTo()) + " - " + fmtMSS(changeSecond) + "sek";
        }
    }
    
    // Om siste melding blir for gammel så fjerner vi den
    if(((new Date()) - CONSOLE_LAST_MESSAGE_TIME) >= CONSOLE_DELAY)
    {
            document.getElementById("textConsole").style.display = "none";
    }
        
}

// Printer ut til konsoll og app
function print(text)
{
    //console.log(text);
    document.getElementById("textConsole").innerHTML = text;
    if(!getCheckboxValue("chkHideTransportInfo"))
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
                anchor: new google.maps.Point(10, 24), 
                labelOrigin: new google.maps.Point(10, -10)
            };
    return ikon;
}

function getMarkerIcon(transType)
{
    //console.log("Transporttype: " + transType);
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

// Function by Geoffrey Crofte
function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}

// Sekunder til "00:00"
function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}

// Get share link
function getShareLink()
{
    
}