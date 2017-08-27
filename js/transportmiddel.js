function Transport(id)
{
    this.id = id;
    this.position = {
            lat: 0,
            lon: 0
    };
    
    this.getId = function()
    {
        return this.id;
    }
    
    this.getPosition() = function()
    {
        return this.position;
    }
}