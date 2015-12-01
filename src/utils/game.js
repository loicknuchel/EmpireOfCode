function Game(client){
  this.groupUnits = groupUnits;
  
  // TODO
  function groupUnits(coord, radius){
    client.doMove(coord);
    return client.whenIdle(function(){
      if(allUnitsIn(coord, radius)){
        
      } else {
        
      }
    });
    function allUnitsIn(coord, radius){
      
    }
  }
}