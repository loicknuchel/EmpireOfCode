describe("Geo", function(){
  beforeEach(function(){
  });

  describe("Circle utils", function(){
    beforeEach(function(){
    });

    it("should be out of the circle", function(){
      expect(Geo.isInCircle(0, 0, 5, 3, 5)).toBeFalsy();
    });
    it("should be in the circle", function(){
      expect(Geo.isInCircle(0, 0, 5, 3, 3)).toBeTruthy();
    });
  });
});
