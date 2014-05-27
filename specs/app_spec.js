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
      expect(elems.count()).toBe(2);
      return elems.first().then(function(elem) {
        return elem.findElement(By.css('.button')).click().then(function() {
          return element(By.partialButtonText('Edit')).click().then(function() {
            element(By.input('contact.firstname')).clear();
            element(By.input('contact.lastname')).clear();
            element(By.input('contact.phone')).clear();
            element(By.input('contact.firstname')).sendKeys('Benjamin');
            element(By.input('contact.lastname')).sendKeys('Guez');
            element(By.input('contact.phone')).sendKeys('42424242');
            return element(By.partialButtonText('Edit contact')).click().then(function() {
              return elems.first().then(function(elem) {
                expect(elem.findElement(By.css('.firstname')).getText()).toBe('Benjamin');
                expect(elem.findElement(By.css('.lastname')).getText()).toBe('Guez');
                return expect(elem.findElement(By.css('.phone')).getText()).toBe('42424242');
              });
            });
          });
        });
      });
    });
  });

}).call(this);
