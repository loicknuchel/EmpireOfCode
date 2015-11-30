var Game = function(width, height){
  var self = this;
  self.area = new Matrix(width, height);
  self.towers = [];
  
  self.addTowers = function(towers){
    _.map(towers, function(tower){
      self.addTower(tower);
    });
  };
  self.addTower = function(tower){
    self.towers.push(tower);
    // TODO mark 
  };
};

var Item = function(){
  
};
Item.Role.UNIT = 'unit';
Item.Role.TOWER = 'tower';
Item.Role.CENTER = 'center';
Item.Role.BUILDING = 'building';
Item.Role.OBSTACLE = 'obstacle';
