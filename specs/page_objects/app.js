(function() {
  var ContactboosterApp;

  ContactboosterApp = (function() {
    function ContactboosterApp() {}

    ContactboosterApp.prototype.toggleMenu = function() {
      return element(By.id("toggleLeftBtn")).click();
    };

    ContactboosterApp.prototype.clickContactNewButton = function(cb) {
      return element(By.id("addNewContactBtn")).click().then(function() {
        return cb();
      });
    };

    ContactboosterApp.prototype.selectList = function(list) {
      return element(By.id("" + list + "_list")).click();
    };

    ContactboosterApp.prototype.getListFromRepeater = function(repeater) {
      return element.all(By.repeater(repeater));
    };

    ContactboosterApp.prototype.editInput = function(field, value) {
      element(By.input(field)).clear();
      return element(By.input(field)).sendKeys(value);
    };

    ContactboosterApp.prototype.editInputs = function(inputs) {
      var field, value, _results;
      _results = [];
      for (field in inputs) {
        value = inputs[field];
        _results.push(this.editInput(field, value));
      }
      return _results;
    };

    ContactboosterApp.prototype.submitEdit = function(cb) {
      return element(By.partialButtonText('Edit contact')).click().then(function() {
        return cb();
      });
    };

    ContactboosterApp.prototype.submitAdd = function(cb) {
      return element(By.buttonText('Add')).click().then(function() {
        return cb();
      });
    };

    ContactboosterApp.prototype.clickContactActionButton = function(contactItem, cb) {
      return contactItem.findElement(By.css('.button')).click().then(function() {
        return cb();
      });
    };

    ContactboosterApp.prototype.clickContactEditButton = function(cb) {
      return element(By.partialButtonText('Edit')).click().then(function() {
        return cb();
      });
    };

    ContactboosterApp.prototype.clickContactDeleteButton = function(cb) {
      return element(By.buttonText('Delete')).click().then(function() {
        return cb();
      });
    };

    return ContactboosterApp;

  })();

  module.exports = new ContactboosterApp;

}).call(this);
