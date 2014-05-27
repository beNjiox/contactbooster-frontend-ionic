(function() {
  var app, ptor;

  app = require('./page_objects/app');

  ptor = protractor.getInstance();

  describe("adding a client", function() {
    return it("should open the menu and select a list", function() {
      var elems;
      browser.get('http://localhost:8033/');
      app.toggleMenu();
      app.selectList('family');
      elems = app.getListFromRepeater("c in activeContacts.contacts");
      return expect(elems.count()).toBe(2);
    });
  });

}).call(this);
