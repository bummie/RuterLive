// Todo smart shit


// 1 Velger rute
// 2 Henter rute
// Søker gjennom stoppesteder basert på idene i rutefilene
// Lager Stoppobjekter og plasserer de i Routeobjekt
// Sorterer de i forhold til distanse mellom stoppene
// KJØRE BUSSER

// getStopPositions(bussStopTestIdListe);
function Route()
{
    this.id = 0;
    this.stops = new Array(0);
}

function Stop(id, name, position)
{
    this.id = id;
    this.name = name;
    this.position = position;
}