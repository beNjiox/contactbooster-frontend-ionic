(function() {
  var ContactboosterApp;

  ContactboosterApp = (function() {
    function ContactboosterApp() {}

    ContactboosterApp.prototype.toggleMenu = function() {
      return element(By.id("toggleLeftBtn")).click();
    };

    ContactboosterApp.prototype.selectList = function(list) {
      return element(By.id("" + list + "_list")).click();
    };

    ContactboosterApp.prototype.getListFromRepeater = function(repeater) {
      return element.all(By.repeater(repeater));
    };

    return ContactboosterApp;

  })();

  module.exports = new ContactboosterApp;

}).call(this);
