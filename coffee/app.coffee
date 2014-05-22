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
  .controller('ContactsCtrl', ($scope, Contactbooster,
                              $ionicModal, $ionicSideMenuDelegate, $ionicLoading, $ionicActionSheet) ->

    ContactView = new ContactsController $scope, Contactbooster, $ionicModal, $ionicSideMenuDelegate, $ionicLoading, $ionicActionSheet
    ContactView.fetch()

  )

class ContactsController
  constructor: ($scope, @Contactbooster, @ionicModal, @ionicSideMenuDelegate, @ionicLoading, @ionicActionSheet) ->
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
    @scope.actionContact   = @actionContact

  actionContact: (contactId) =>
    console.log @ionicActionSheet
    @ionicActionSheet.show({
      buttons: [ { text: 'Edit' } ]
      , destructiveText: 'Delete'
      , destructiveButtonClicked: =>
        if confirm "Are you sure you want to delete contact #{contactId} ?"
          @Contactbooster.one('lists', @scope.activeContacts.id).one('contacts', contactId).remove().then =>
            $("#contact_#{contactId}").fadeOut('fast')
          return true
      , titleText: "Make an action for this contact"
      , cancelText: "Cancel"
      , buttonClicked: (index) =>
        return true
    })
  newContact: =>
    @scope.contactModal.show()
  closeNewContact: =>
    @scope.contactModal.hide()
  createContact: (contact) =>
    @ionicLoading.show({ template: 'Creating new contact...'})
    new_contact = { contact: contact }
    @Contactbooster.one('lists', @scope.activeContacts.id).post('contacts', new_contact).then (created) =>
      console.log created, contact, new_contact, @scope.activeContacts
      @scope.activeContacts.contacts.push contact
      @ionicLoading.hide()
      @scope.contactModal.hide()
    , ->
      alert ("Please, try again.")

  fetch: ->
    @ionicLoading.show({ template: 'Fetching lists...'})
    @Contactbooster.all('lists').getList().then (lists) =>
      @ionicLoading.hide();
      @scope.contactListInitialized = true
      @scope.contactLists           = lists
      @scope.activeContactLists     = _.map( lists, (list) -> list.name )
  selectList: (index) =>
    @scope.contactsInitialized = true
    @scope.activeContacts      = @scope.contactLists[index]
    @scope.activeListName      = @scope.activeContacts.name
    @ionicSideMenuDelegate.toggleLeft()

