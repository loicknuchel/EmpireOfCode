function require(name){
  if(name === 'underscore'){ return _; }
  if(name === 'battle/commander.js'){ return new Commander(); }
}
