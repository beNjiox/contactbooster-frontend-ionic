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
  }).controller('ContactsCtrl', function($scope, Contactbooster, $ionicModal, $ionicSideMenuDelegate, $ionicLoading, $ionicActionSheet) {
    var ContactView;
    ContactView = new ContactsController($scope, Contactbooster, $ionicModal, $ionicSideMenuDelegate, $ionicLoading, $ionicActionSheet);
    return ContactView.fetch();
  });

  ContactsController = (function() {
    function ContactsController($scope, Contactbooster, ionicModal, ionicSideMenuDelegate, ionicLoading, ionicActionSheet) {
      this.Contactbooster = Contactbooster;
      this.ionicModal = ionicModal;
      this.ionicSideMenuDelegate = ionicSideMenuDelegate;
      this.ionicLoading = ionicLoading;
      this.ionicActionSheet = ionicActionSheet;
      this.selectList = __bind(this.selectList, this);
      this.createContact = __bind(this.createContact, this);
      this.closeNewContact = __bind(this.closeNewContact, this);
      this.newContact = __bind(this.newContact, this);
      this.actionContact = __bind(this.actionContact, this);
      this.scope = $scope;
      this.scope.contactsInitialized = false;
      this.scope.contactListInitialized = false;
      this.scope.contactLists = [];
      this.scope.activeContacts = [];
      this.scope.activeContactLists = [];
      this.initNewContactModal();
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
      this.scope.createContact = this.createContact;
      return this.scope.actionContact = this.actionContact;
    };

    ContactsController.prototype.actionContact = function(contactId) {
      console.log(this.ionicActionSheet);
      return this.ionicActionSheet.show({
        buttons: [
          {
            text: 'Edit'
          }
        ],
        destructiveText: 'Delete',
        destructiveButtonClicked: (function(_this) {
          return function() {
            if (confirm("Are you sure you want to delete contact " + contactId + " ?")) {
              _this.Contactbooster.one('lists', _this.scope.activeContacts.id).one('contacts', contactId).remove().then(function() {
                return $("#contact_" + contactId).fadeOut('fast');
              });
              return true;
            }
          };
        })(this),
        titleText: "Make an action for this contact",
        cancelText: "Cancel",
        buttonClicked: (function(_this) {
          return function(index) {
            return true;
          };
        })(this)
      });
    };

    ContactsController.prototype.newContact = function() {
      return this.scope.contactModal.show();
    };

    ContactsController.prototype.closeNewContact = function() {
      return this.scope.contactModal.hide();
    };

    ContactsController.prototype.createContact = function(contact) {
      var new_contact;
      this.ionicLoading.show({
        template: 'Creating new contact...'
      });
      new_contact = {
        contact: contact
      };
      return this.Contactbooster.one('lists', this.scope.activeContacts.id).post('contacts', new_contact).then((function(_this) {
        return function(created) {
          console.log(created, contact, new_contact, _this.scope.activeContacts);
          _this.scope.activeContacts.contacts.push(contact);
          _this.ionicLoading.hide();
          return _this.scope.contactModal.hide();
        };
      })(this), function() {
        return alert("Please, try again.");
      });
    };

    ContactsController.prototype.fetch = function() {
      this.ionicLoading.show({
        template: 'Fetching lists...'
      });
      return this.Contactbooster.all('lists').getList().then((function(_this) {
        return function(lists) {
          _this.ionicLoading.hide();
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
      this.scope.activeContacts = this.scope.contactLists[index];
      this.scope.activeListName = this.scope.activeContacts.name;
      return this.ionicSideMenuDelegate.toggleLeft();
    };

    return ContactsController;

  })();

}).call(this);
