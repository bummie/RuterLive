var STUCK_FREE = 0, STUCK_STUCK = 1, STUCK_RELEASE = 2;

function Transport(id, marker, pos, route)
{
    this.id = id;
    this.route = route;
    this.marker = marker;
    this.title = "";
    this.position = pos;
    this.towardsPosition = pos;
    this.lastPosition = pos;
    this.marker.setPosition(pos);
    this.velocity = null;
    this.firstInit = true;
    this.firstInitCounter = 0;
    this.stuck = STUCK_FREE;
    this.originId = null;
    this.originName = null;
    this.desinationId = null;
    this.destinationName = null;
    
    this.headingTo = null;
    this.headingFrom = null;
    
    this.arrivalTime = null;
    this.lastArrivalTime = null;
    this.totalTime = null;
    
    this.arrived = true;
    this.timeSinceUpdate = null;
    
    // Getters and setters
    this.getId = function()
    {
        return this.id;
    }
    
    this.getMarker = function()
    {
        return this.marker;
    }
    
    this.getTitle = function()
    {
        return this.title;
    }
    
    this.getPosition = function()
    {
        return this.position;
    }
    
    this.getVelocity = function()
    {
        return this.velocity;
    }
    
    this.setId = function(id)
    {
        this.id = id;
    }
    
    this.setMarker = function(marker)
    {
        this.marker = marker;
    }
    
    this.setTitle = function(title)
    {
        this.title = title;
    }
    
    this.setPosition = function(pos)
    {
        this.marker.setPosition(pos);
        this.position = pos;
    }
    
    this.setVelocity = function(vel)
    {
        this.velocity = vel;
    }
    
    this.getOriginId = function()
    {
        return this.originId;
    }
    
    this.setOriginId = function(id)
    {
        this.originId = id;
    }
    
    this.getOriginName = function()
    {
        return this.originName;
    }
    
    this.setOriginName = function(name)
    {
        this.originName = name;
    }
    
    this.getDestinationId = function()
    {
        return this.desinationId;
    }
    
    this.setDestinationId = function(id)
    {
        this.desinationId = id;
    }
    
    this.getDestinationName = function()
    {
        return this.destinationName;
    }
    
    this.setDestinationName = function(name)
    {
        this.destinationName = name;
    }
    
    this.isAlive = function()
    {
        return this.alive;
    }
    
    this.setAlive = function(alive)
    {
        this.alive = alive;
    }
    
    this.getHeadingTo = function()
    {
        return this.headingTo;
    }
    
    this.setHeadingTo = function(id)
    {
        this.headingTo = id;
    }
    
    this.getHeadingFrom = function()
    {
        return this.headingFrom;
    }
    
    this.setHeadingFrom = function(id)
    {
        this.headingFrom = id;
    }
    
    this.getArrivalTime = function()
    {
        return this.arrivalTime;
    }
    
    this.setArrivalTime = function(time)
    {
        this.arrivalTime = time;
    }
    
    this.getTowardsPosition = function()
    {
        return this.towardsPosition;
    }
    
    this.setTowardsPosition = function(pos)
    {
        this.towardsPosition = pos;
    }
    
    this.getLastPosition = function()
    {
        return this.lastPosition;
    }
    
    this.setLastPosition = function(pos)
    {
        this.lastPosition = pos;
    }
    
    // TODO: Skrive om så den gjetter headingFrom basert på origin
    this.isStopNeighbour = function( id, neighid)
    {
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            if(ROUTE_MANAGER[i].getId === this.route)
            {
                var stops = ROUTE_MANAGER[i].getStops();
                for(var j = 0; j < stops.length; j++)
                {
                    if(stops[j].getId() === id)
                    {
                        // Hvis stoppet etter i arrayen er nabo
                        if(j+1 < stops.length-1)
                        {
                            if(stops[j+1].getId() === neighid)
                                return true;
                        }

                        // Hvis stoppet før i arrayen er nabo
                        if(j-1 >= 0)
                        {
                            if(stops[j-1].getId() === neighid)
                                return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    
    this.lastStopFromCurrent = function()
    {
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            if(ROUTE_MANAGER[i].getId() === this.route)
            {
                var stops = ROUTE_MANAGER[i].getStops();
                var stopIndex;
                for(stopIndex = 0; stopIndex < stops.length; stopIndex++)
                {
                    if(stops[stopIndex].getId() === this.getOriginId())
                    {
                        break;
                    }
                }
                
                // Finne retningen i array vi beveger oss
                var arrayUp = true;
                if(stopIndex > (stops.length - stopIndex))
                    arrayUp = false;
                
                if(arrayUp)
                {
                    for(stopIndex = 0; stopIndex < stops.length; stopIndex++)
                    {
                        if(stops[stopIndex].getId() === this.getHeadingTo())
                        {
                           if((stopIndex-1) >= 0)
                               return stops[stopIndex-1].getId();
                            else
                                return this.getHeadingTo();
                        }
                    }
                }else
                {
                    for(stopIndex = stopIndex; stopIndex > 0; stopIndex--)
                    {
                        if(stops[stopIndex].getId() === this.getHeadingTo())
                        {
                           if((stopIndex+1) < (stops.length-1))
                               return stops[stopIndex+1].getId();
                            else
                                return this.getHeadingTo();
                        }
                    }
                }
            }
        }
        return null;
    }
    
    // Do stuff functions
    this.move = function(inc)
    {
        if(!this.firstInit)
        {
            if(this.getHeadingFrom() == null)
                this.setPosition(this.getTowardsPosition());
            
            if(this.lastArrivalTime !== this.getArrivalTime())
            {
                this.totalTime = Math.abs((new Date() - this.getArrivalTime())/1000);
                this.lastArrivalTime = this.getArrivalTime();
            }
        
            if(this.getTowardsPosition() != null)
            {   
                var timeLeft = (this.getArrivalTime() - (new Date()))/1000;
                //console.log(timeLeft);

                // Så bussen stopper når den er fremme yo
                if(timeLeft > 0)
                {
                    var changeSecond = ((this.totalTime - (Math.abs((new Date()) - this.getArrivalTime())/1000)) / this.totalTime);
                    
                    var latDistance = this.getTowardsPosition().lat - this.getLastPosition().lat;
                    var lngDistance = this.getTowardsPosition().lng - this.getLastPosition().lng;
                    
                    var changeLat = ((latDistance * changeSecond));//* deltaTime);
                    var changeLng = ((lngDistance * changeSecond));// * deltaTime);

                    this.setVelocity(changeSecond * 100 + "%");
                    //console.log("x: " + changeLat + " y:" + changeLng);
                    var newPos = {
                                        lat: this.getLastPosition().lat + changeLat, 
                                        lng: this.getLastPosition().lng + changeLng
                                    };

                    this.setPosition(newPos);   
                }
            }   
        }
        else
        {
            if(this.firstInitCounter >= 2)
                this.firstInit = false;
            this.setPosition(this.getTowardsPosition());
            //if(this.getHeadingFrom() == null)
            this.setHeadingFrom(this.lastStopFromCurrent(this.getHeadingTo()));
            if(this.getHeadingFrom() != null)
                console.log(this.getId() + " Fra: " + getStopNameFromId(0, this.getHeadingFrom())  + " Til: " + getStopNameFromId(0, this.getHeadingTo()));
            this.setLastPosition(this.getTowardsPosition());
            this.firstInitCounter += inc;
        }
    }
}