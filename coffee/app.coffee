angular.module('contactbooster', ['ionic', 'restangular'])
  # Restangular is used as a RESTFul manager -> https://github.com/mgonto/restangular
  .factory('Contactbooster', (Restangular) ->
    Restangular.withConfig (RestangularConfigurer) ->
      RestangularConfigurer.setBaseUrl('http://localhost:3001')
      RestangularConfigurer.addResponseInterceptor (data, operation, what, url, response, deferred) ->
        if operation == "getList"
          extractedData       = data.lists
          extractedData.total = data.total
        return extractedData
  )
  .controller('ContactsCtrl', ($scope, Contactbooster, $ionicModal, $ionicSideMenuDelegate) ->

    ContactView = new ContactsController $scope, Contactbooster, $ionicModal, $ionicSideMenuDelegate
    ContactView.fetch()

  )

class ContactsController
  constructor: ($scope, @Contactbooster, @ionicModal, @ionicSideMenuDelegate) ->
    @scope                        = $scope
    @scope.contactsInitialized    = false
    @scope.contactListInitialized = false
    @scope.contactLists           = [ ]
    @scope.activeContacts         = [ ]
    @scope.activeContactLists     = [ ]

    @initNewContactModal()

    @delegateEvent()

  initNewContactModal: ->
    @ionicModal.fromTemplateUrl 'new-contact.html', (modal) =>
      @scope.contactModal = modal
    , { scope: @scope, animation: 'slide-in-up' }

  delegateEvent: ->
    @scope.selectList      = @selectList
    @scope.newContact      = @newContact
    @scope.closeNewContact = @closeNewContact
    @scope.createContact   = @createContact

  newContact: =>
    @scope.contactModal.show()
  closeNewContact: =>
    @scope.contactModal.hide()
  createContact: (contact) =>
    new_contact = { contact: contact }
    @Contactbooster.one('lists', @scope.activeContacts.id).post('contacts', new_contact).then (created) =>
      console.log created, contact, new_contact, @scope.activeContacts
      @scope.activeContacts.contacts.push contact
      @scope.contactModal.hide()
    , ->
      alert ("Please, try again.")

  fetch: ->
    @Contactbooster.all('lists').getList().then (lists) =>
      @scope.contactListInitialized = true
      @scope.contactLists           = lists
      @scope.activeContactLists     = _.map( lists, (list) -> list.name )
  selectList: (index) =>
    @scope.contactsInitialized = true
    @scope.activeContacts      = @scope.contactLists[index]
    @scope.activeListName      = @scope.activeContacts.name
    @ionicSideMenuDelegate.toggleLeft()

