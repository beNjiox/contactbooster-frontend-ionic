(function() {
  var App, ContactsController,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  App = angular.module('contactbooster', ['ionic', 'restangular']);

  if (window.location.origin === "http://localhost:8080") {
    App.constant('BASE_URL', "http://localhost:3000/");
  } else if (window.location.origin === "http://localhost:8033") {
    App.constant('BASE_URL', 'http://railscontactbooster.apiary-mock.com/');
  } else {
    throw new Error("Bad location origin");
  }

  App.factory('Contactbooster', function(Restangular, BASE_URL) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(BASE_URL);
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
      this.editContact = __bind(this.editContact, this);
      this.error_cleanup = __bind(this.error_cleanup, this);
      this.success_cleanup = __bind(this.success_cleanup, this);
      this.submitContact = __bind(this.submitContact, this);
      this.closeContactForm = __bind(this.closeContactForm, this);
      this.contactForm = __bind(this.contactForm, this);
      this.removeContactFromMemory = __bind(this.removeContactFromMemory, this);
      this.deleteContact = __bind(this.deleteContact, this);
      this.actionContact = __bind(this.actionContact, this);
      this.scope = $scope;
      this.scope.contact = {};
      this.scope.contactsInitialized = false;
      this.scope.contactListInitialized = false;
      this.scope.contactLists = [];
      this.scope.activeContacts = [];
      this.scope.activeContactLists = [];
      this.initContactFormModal();
      this.delegateEvent();
    }

    ContactsController.prototype.initContactFormModal = function() {
      return this.ionicModal.fromTemplateUrl('./partials/contact_form.html', (function(_this) {
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
      this.scope.contactForm = this.contactForm;
      this.scope.submitContact = this.submitContact;
      this.scope.closeContactForm = this.closeContactForm;
      this.scope.createContact = this.createContact;
      return this.scope.actionContact = this.actionContact;
    };

    ContactsController.prototype.actionContact = function(contact) {
      var contactId;
      contactId = contact.id;
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
              return _this.deleteContact(contactId);
            }
          };
        })(this),
        titleText: "Make an action for this contact",
        cancelText: "Cancel",
        buttonClicked: (function(_this) {
          return function(index) {
            _this.contactForm(angular.copy(contact));
            return true;
          };
        })(this),
        cancel: function() {}
      });
    };

    ContactsController.prototype.deleteContact = function(contactId) {
      this.Contactbooster.one('lists', this.scope.activeContacts.id).one('contacts', contactId).remove().then((function(_this) {
        return function() {
          $("#contact_" + contactId).fadeOut('fast');
          return _this.scope.activeContacts.contacts = _this.removeContactFromMemory;
        };
      })(this));
      return true;
    };

    ContactsController.prototype.removeContactFromMemory = function() {
      return _.without(this.scope.activeContacts.contacts, _.findWhere(this.scope.activeContacts.contacts, {
        id: contactId
      }));
    };

    ContactsController.prototype.contactForm = function(contact) {
      if (contact == null) {
        contact = {};
      }
      this.scope.contact = contact;
      if (this.scope.contact.id) {
        this.scope.modal = {
          title: "Edit contact: #" + this.scope.contact.id,
          text_button: "Edit contact"
        };
      } else {
        this.scope.modal = {
          title: "New contact",
          text_button: "Add"
        };
      }
      return this.scope.contactModal.show();
    };

    ContactsController.prototype.closeContactForm = function() {
      return this.scope.contactModal.hide();
    };

    ContactsController.prototype.submitContact = function(contact) {
      var contact_to_save, q;
      if (_.isEmpty(contact)) {
        return alert("Please fill the fields");
      }
      this.ionicLoading.show({
        template: 'Creating new contact...'
      });
      contact_to_save = {
        contact: contact
      };
      if (contact.id) {
        q = this.editContact(contact_to_save);
      } else {
        q = this.createContact(contact_to_save);
      }
      return q.then(this.success_cleanup, this.error_cleanup);
    };

    ContactsController.prototype.success_cleanup = function() {
      this.ionicLoading.hide();
      return this.scope.contactModal.hide();
    };

    ContactsController.prototype.error_cleanup = function(err) {
      var error, error_string, field, _ref;
      this.ionicLoading.hide();
      error_string = "Validation error\n";
      _ref = err.data.error;
      for (field in _ref) {
        error = _ref[field];
        error_string += "" + field + " : " + error[0] + "\n";
      }
      return alert(error_string);
    };

    ContactsController.prototype.editContact = function(contact) {
      var q;
      q = this.Contactbooster.one('lists', this.scope.activeContacts.id).one('contacts', contact.contact.id).patch(contact);
      q.then((function(_this) {
        return function(modified) {
          var key, old_contact, _i, _len, _ref, _results;
          old_contact = _.findWhere(_this.scope.activeContacts.contacts, {
            id: contact.contact.id
          });
          _ref = ['lastname', 'firstname', 'phone'];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            key = _ref[_i];
            _results.push(old_contact[key] = contact.contact[key]);
          }
          return _results;
        };
      })(this));
      return q;
    };

    ContactsController.prototype.createContact = function(contact) {
      var q;
      q = this.Contactbooster.one('lists', this.scope.activeContacts.id).post('contacts', contact);
      q.then((function(_this) {
        return function(created) {
          return _this.scope.activeContacts.contacts.push(contact.contact);
        };
      })(this));
      return q;
    };

    ContactsController.prototype.fetch = function() {
      this.ionicLoading.show({
        template: 'Fetching lists.....'
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
