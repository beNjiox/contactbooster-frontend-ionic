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
  .controller('ContactsCtrl', ($scope, Contactbooster, $ionicModal) ->

    ContactView = new ContactsController $scope, Contactbooster, $ionicModal
    ContactView.fetch()

  )

class ContactsController
  constructor: ($scope, Contactbooster, $ionicModal) ->
    @scope                        = $scope
    @scope.contactsInitialized    = false
    @scope.contactListInitialized = false
    @scope.contactLists           = [ ]
    @scope.activeContacts         = [ ]
    @scope.activeContactLists     = [ ]

    @ionicModal = $ionicModal
    @initNewContactModal()

    @Contactbooster = Contactbooster
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
    console.log @scope.contactModal
    @scope.contactModal.show()
  closeNewContact: =>
    @scope.contactModal.hide()
  createContact: (contact) =>
    @scope.activeContacts.push contact
    @scope.contactModal.hide()

  fetch: ->
    @Contactbooster.all('lists').getList().then (lists) =>
      @scope.contactListInitialized = true
      @scope.contactLists           = lists
      @scope.activeContactLists     = _.map( lists, (list) -> list.name )
  selectList: (index) =>
    @scope.contactsInitialized = true
    @scope.activeContacts      = @scope.contactLists[index].contacts

