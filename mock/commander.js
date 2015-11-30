function Commander(){
  return {
    Client: function(){
      return {
        // Infos
        askMyInfo: function(){
          return {};
        },
        askItemInfo: function(itemId){
          return {};
        },
        askEnemyItems: function(){
          return {};
        },
        askMyItems: function(){
          return {};
        },
        askBuildings: function(){
          return {};
        },
        askTowers: function(){
          return {};
        },
        askCenter: function(){
          return {};
        },
        askUnits: function(){
          return {};
        },
        askNearestEnemy: function(){
          return {};
        },
        askMyRangeEnemyItems: function(){
          return {};
        },
        askCurTime: function(){
          return {};
        },

        // Commands
        doAttack: function(itemId){},
        doMove: function(coordinates){},
        doMessageToId: function(message, itemId){}, // need level 4
        doMessageToCraft: function(message){}, // need level 4
        doMessageToTeam: function(message){}, // need level 4

        // Subscribes
        whenInArea: function(center, radius){
          return new Promise();
        },
        whenItemInArea: function(center, radius){
          return new Promise();
        },
        whenIdle: function(){
          return new Promise();
        },
        whenEnemyInRange: function(){
          return new Promise();
        },
        whenEnemyOutRange: function(itemId){
          return new Promise();
        },
        whenItemDestroyed: function(itemId){
          return new Promise();
        },
        whenTime: function(secs){
          return new Promise();
        },
        whenMessage: function(){
          return new Promise();
        }
      };
    }
  };
}
