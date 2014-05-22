(function() {
  var ContactsController,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('contactbooster', ['ionic', 'restangular']).factory('Contactbooster', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('http://localhost:3001');
      return RestangularConfigurer.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        var extractedData;
        if (operation === "getList") {
          extractedData = data.lists;
          extractedData.total = data.total;
        }
        return extractedData;
      });
    });
  }).controller('ContactsCtrl', function($scope, Contactbooster, $ionicModal) {
    var ContactView;
    ContactView = new ContactsController($scope, Contactbooster, $ionicModal);
    return ContactView.fetch();
  });

  ContactsController = (function() {
    function ContactsController($scope, Contactbooster, $ionicModal) {
      this.selectList = __bind(this.selectList, this);
      this.createContact = __bind(this.createContact, this);
      this.closeNewContact = __bind(this.closeNewContact, this);
      this.newContact = __bind(this.newContact, this);
      this.scope = $scope;
      this.scope.contactsInitialized = false;
      this.scope.contactListInitialized = false;
      this.scope.contactLists = [];
      this.scope.activeContacts = [];
      this.scope.activeContactLists = [];
      this.ionicModal = $ionicModal;
      this.initNewContactModal();
      this.Contactbooster = Contactbooster;
      this.delegateEvent();
    }

    ContactsController.prototype.initNewContactModal = function() {
      return this.ionicModal.fromTemplateUrl('new-contact.html', (function(_this) {
        return function(modal) {
          return _this.scope.contactModal = modal;
        };
      })(this), {
        scope: this.scope,
        animation: 'slide-in-up'
      });
    };

    ContactsController.prototype.delegateEvent = function() {
      this.scope.selectList = this.selectList;
      this.scope.newContact = this.newContact;
      this.scope.closeNewContact = this.closeNewContact;
      return this.scope.createContact = this.createContact;
    };

    ContactsController.prototype.newContact = function() {
      console.log(this.scope.contactModal);
      return this.scope.contactModal.show();
    };

    ContactsController.prototype.closeNewContact = function() {
      return this.scope.contactModal.hide();
    };

    ContactsController.prototype.createContact = function(contact) {
      this.scope.activeContacts.push(contact);
      return this.scope.contactModal.hide();
    };

    ContactsController.prototype.fetch = function() {
      return this.Contactbooster.all('lists').getList().then((function(_this) {
        return function(lists) {
          _this.scope.contactListInitialized = true;
          _this.scope.contactLists = lists;
          return _this.scope.activeContactLists = _.map(lists, function(list) {
            return list.name;
          });
        };
      })(this));
    };

    ContactsController.prototype.selectList = function(index) {
      this.scope.contactsInitialized = true;
      return this.scope.activeContacts = this.scope.contactLists[index].contacts;
    };

    return ContactsController;

  })();

}).call(this);
