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
    
    this.move = function()
    {
        var newPos = {
                    lat: this.getPosition().lat+this.getVelocity().x, 
                    lng: this.getPosition().lng+this.getVelocity().y
                };
        this.setPosition(newPos);
    }
}