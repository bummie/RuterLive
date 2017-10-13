<?php

$MASTER_URL = 'http://reisapi.ruter.no/';
$LOAD_STOPS = 'Place/GetStopsByLineID/';
$LOAD_SANNTID = 'StopVisit/GetDepartures/';
$LOAD_LINJER = 'Line/GetLines/';

switch($_GET["type"])
{
    case 'stops':
        getStopIdList();
    break;
    
    case 'sanntid':
        getSanntid();
    break;
        
    case 'linjer':
        getLinjer();
    break;
}

// Henter stoppene for gitt linje
function getStopIdList()
{
    global $MASTER_URL, $LOAD_STOPS;
    $linje = $_GET['linje'];
    $url = $MASTER_URL . $LOAD_STOPS . $linje;    

    print_r(getSiteData($url));
}

// Henter stoppene for gitt linje
function getSanntid()
{
    global $MASTER_URL, $LOAD_SANNTID;
    $id = $_GET['id'];
    $url = $MASTER_URL . $LOAD_SANNTID . $id;   
    if(isset($_GET['linje']))
    {
        $linje = $_GET['linje'];
        $url = $url . '?linenames=' . $linje;  
    }
    print_r(getSiteData($url));
}

// Henter linjene
function getLinjer()
{
    global $MASTER_URL, $LOAD_LINJER;
    $url = $MASTER_URL . $LOAD_LINJER;    
    print_r(getSiteData($url));
}

// Henter data fra Ruters API
function getSiteData($url)
{
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; rv:1.7.3) Gecko/20041001 Firefox/0.10.1" );
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_REFERER, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
    $side = curl_exec($curl);
    curl_close($curl);
    
    return $side;
    
}