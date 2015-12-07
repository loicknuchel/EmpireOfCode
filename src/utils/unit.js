function Unit(client){
  this.moveTo = moveTo;

  function moveTo(coordList){
    if(!coordList || coordList.length === 0){
      return client.whenIdle();
    } else {
      var head = coordList[0];
      var tail = coordList.slice(1);
      client.doMove(head);
      return client.whenIdle().then(function(){
        return moveTo(tail);
      });
    }
  }
}
