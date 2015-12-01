function Promise(){
  return {
    then: function(success, error, progress){
      // success();
      return new Promise();
    }
  }
}
