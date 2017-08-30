// Seb (c) 2017

var ROUTE_MANAGER = new Array();

function Route(id, stopArray)
{
    this.id = id;
    this.stops = stopArray
    
    this.getId = function()
    {
        return this.id;
    }
    
    this.getStops = function()
    {
        return this.stops;
    }
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

function doneLoadingStops(stopsArray, linje)
{
    if(stopsArray != null)
    {
        console.log("Added " + stopsArray.length + " stops to Routearray");
        ROUTE_MANAGER[ROUTE_MANAGER.length] = new Route(linje, stopsArray);
    }
}
