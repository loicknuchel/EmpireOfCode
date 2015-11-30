function Commander(){
  return {
    Client: function(){
      return {
        askTowers: function(){ return []; },
        askCenter: function(){ return []; },
        doAttack: function(id){ },
        whenItemDestroyed: function(id){ return new Promise(); },
      };
    }
  };
}
