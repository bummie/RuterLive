function Transport(id, marker, pos)
{
    this.id = id;
    this.marker = marker;
    this.title = "-1"
    this.position = pos;
    this.marker.setPosition(pos);
    this.velocity = {
                        x: 0,
                        y: 0
                    };
    
    this.originId = null;
    this.originName = null;
    this.desinationId = null;
    this.destinationName = null;
    
    this.alive = false;
    this.headingTo = null;
    this.headingFrom = null;
    this.arrivalTime = null;
    
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
    // Do stuff functions
    this.move = function()
    {
        var newPos = {
                    lat: this.getPosition().lat+this.getVelocity().x, 
                    lng: this.getPosition().lng+this.getVelocity().y
                };
        this.setPosition(newPos);
    }
}