(function() {
  var app, expect_row_information;

  app = require('./page_objects/app');

  expect_row_information = function(rowItem, contactInfo) {
    var field, value, _results;
    _results = [];
    for (field in contactInfo) {
      value = contactInfo[field];
      _results.push(expect(elem.findElement(By.css("." + field)).getText()).toBe(value));
    }
    return _results;
  };

  describe("adding a client", function() {
    var elems;
    elems = [];
    beforeEach(function() {
      browser.get('http://localhost:8033/');
      app.toggleMenu();
      app.selectList('family');
      return elems = app.getListFromRepeater("c in activeContacts.contacts");
    });
    it("should contain rows", function() {
      return expect(elems.count()).toBe(2);
    });
    it("Edit a contact successfully", function() {
      return elems.first().then(function(elem) {
        return app.clickContactActionButton(elem, function() {
          return app.clickContactEditButton(function() {
            app.editInputs({
              'contact.firstname': 'Benjamin',
              'contact.lastname': 'Guez',
              'contact.phone': '42424242'
            });
            return app.submitEdit(function() {
              return elems.first().then(function(elem) {
                return expect_row_information({
                  'firstname': 'Benjamin',
                  'lastname': 'Guez',
                  'phone': '42424242'
                });
              });
            });
          });
        });
      });
    });
    it("Add a contact successfully", function() {
      return app.clickContactNewButton(function() {
        app.editInputs({
          'contact.firstname': 'Michel',
          'contact.lastname': 'Sapin',
          'contact.phone': '88888888'
        });
        return app.submitAdd(function() {
          return elems.last().then(function(elem) {
            expect_row_information({
              'firstname': 'Michel',
              'lastname': 'Sapin',
              'phone': '88888888'
            });
            return expect(elems.count()).toBe(3);
          });
        });
      });
    });
    return it("Delete a contact successfully", function() {
      return elems.first().then(function(elem) {
        return app.clickContactActionButton(elem, function() {
          return app.clickContactDeleteButton(function() {
            var alertDialog;
            alertDialog = browser.switchTo().alert();
            return alertDialog.accept().then(function() {
              return expect(elems.count()).toBe(1);
            });
          });
        });
      });
    });
  });

}).call(this);
