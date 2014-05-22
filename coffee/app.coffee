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
    @scope.submitContact   = @submitContact
    @scope.closeNewContact = @closeNewContact
    @scope.createContact   = @createContact
    @scope.actionContact   = @actionContact

  actionContact: (contact) =>
    contactId = contact.id
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
        @scope.contact = angular.copy contact
        @newContact()
        return true
      , cancel: ->
    })
  newContact: =>
    @scope.contactModal.show()
  closeNewContact: =>
    @scope.contactModal.hide()
  submitContact: (contact) =>
    # prep the request
    @ionicLoading.show({ template: 'Creating new contact...'})
    contact_to_save = { contact: contact }

    # branch depending on context
    if contact.id
      console.log "Edit"
      q = @editContact contact_to_save
    else
      q = @createContact contact_to_save

    # Generic end of edit/create handling
    q.then =>
      @ionicLoading.hide()
      @scope.contactModal.hide()
      @scope.contact = {}
    , ->
      alert ("Please, try again.")

  editContact: (contact) =>
    q = @Contactbooster.one('lists', @scope.activeContacts.id).one('contacts', contact.contact.id).patch(contact)
    q.then (modified) =>
      old_contact = _.findWhere(@scope.activeContacts.contacts, {id: contact.contact.id})
      for key in ['lastname','firstname','phone']
        old_contact[key] = contact.contact[key]
    return q
  createContact: (contact) =>
    q = @Contactbooster.one('lists', @scope.activeContacts.id).post('contacts', contact)
    q.then (created) =>
      @scope.activeContacts.contacts.push contact.contact
    return q
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

