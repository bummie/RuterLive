var settings = 
    {
        modeStalker: "chkMapFollow",
        modeTraffic: "chkMapTraffic",
        modeLine: "chkMapLine",
        hideSearch: "chkHideSearch",
        hideSelect: "chkHideSelect",
        hideTransportInfo: "chkHideTransportInfo",
        hideInfo: "chkHideInfo",
        hideStops: "chkHideStops"
    };

function setCookie(cname, cvalue) 
{
    var d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) 
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++)
    {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function saveSettings()
{
    setCookie(settings.modeStalker, getCheckboxValue(settings.modeStalker));
    setCookie(settings.modeTraffic, getCheckboxValue(settings.modeTraffic));
    setCookie(settings.modeLine, getCheckboxValue(settings.modeLine));
    setCookie(settings.hideSearch, getCheckboxValue(settings.hideSearch));
    setCookie(settings.hideSelect, getCheckboxValue(settings.hideSelect));
    setCookie(settings.hideTransportInfo, getCheckboxValue(settings.hideTransportInfo));
    setCookie(settings.hideInfo, getCheckboxValue(settings.hideInfo));
    setCookie(settings.hideStops, getCheckboxValue(settings.hideStops));
}

function loadSettings()
{
    setCheckboxValue(settings.modeStalker, toBool(getCookie(settings.modeStalker)));
    setCheckboxValue(settings.modeTraffic, toBool(getCookie(settings.modeTraffic)));
    setCheckboxValue(settings.modeLine, toBool(getCookie(settings.modeLine)));
    setCheckboxValue(settings.hideSearch, toBool(getCookie(settings.hideSearch)));
    setCheckboxValue(settings.hideSelect, toBool(getCookie(settings.hideSelect)));
    setCheckboxValue(settings.hideTransportInfo, toBool(getCookie(settings.hideTransportInfo)));
    setCheckboxValue(settings.hideInfo, toBool(getCookie(settings.hideInfo)));
    setCheckboxValue(settings.hideStops, toBool(getCookie(settings.hideStops)));
}

function toBool(bool)
{
    if(bool === "true")
        return true;
    else
        return false;
}