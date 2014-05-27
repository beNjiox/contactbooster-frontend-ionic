App = angular.module('contactbooster', ['ionic', 'restangular']);

if window.location.origin is "http://localhost:8080"
  App.constant('BASE_URL', "http://localhost:3000/")
else if window.location.origin is "http://localhost:8033"
  App.constant('BASE_URL', 'http://railscontactbooster.apiary-mock.com/')
else
  throw new Error("Bad location origin")

# Restangular is used as a RESTFul manager -> https://github.com/mgonto/restangular
App.factory('Contactbooster', (Restangular, BASE_URL) ->
    Restangular.withConfig (RestangularConfigurer) ->
      RestangularConfigurer.setBaseUrl(BASE_URL)
      RestangularConfigurer.addResponseInterceptor (data, operation, what, url, response, deferred) ->
        if operation == "getList"
          extractedData       = data.lists
          extractedData.total = data.total
        return extractedData
  )



  .controller('ContactsCtrl', ($scope,
                              Contactbooster,
                              $ionicModal,
                              $ionicSideMenuDelegate,
                              $ionicLoading,
                              $ionicActionSheet) ->

    ContactView = new ContactsController $scope,
                                         Contactbooster,
                                         $ionicModal,
                                         $ionicSideMenuDelegate,
                                         $ionicLoading,
                                         $ionicActionSheet
    ContactView.fetch()
  )



class ContactsController
  constructor: ($scope, @Contactbooster, @ionicModal, @ionicSideMenuDelegate, @ionicLoading, @ionicActionSheet) ->
    @scope                        = $scope
    @scope.contact                = {}          # contact object, used as placeholder for new/editer contact
    @scope.contactsInitialized    = false       # boolean used to know if a contact array is initialized
    @scope.contactListInitialized = false       # boolean used to know if a contactList array is initialized
    @scope.contactLists           = [ ]
    @scope.activeContacts         = [ ]
    @scope.activeContactLists     = [ ]
    @initContactFormModal()
    @delegateEvent()



  initContactFormModal: ->
    @ionicModal.fromTemplateUrl './partials/contact_form.html', (modal) =>
      @scope.contactModal = modal
    , { scope: @scope, animation: 'slide-in-up' }



  delegateEvent: ->
    @scope.selectList      = @selectList
    @scope.contactForm     = @contactForm
    @scope.submitContact   = @submitContact
    @scope.closeContactForm = @closeContactForm
    @scope.createContact   = @createContact
    @scope.actionContact   = @actionContact



  actionContact: (contact) =>
    contactId = contact.id
    @ionicActionSheet.show({
      buttons: [ { text: 'Edit' } ]
      , destructiveText: 'Delete'
      , destructiveButtonClicked: =>
          @deleteContact(contactId) if confirm "Are you sure you want to delete contact #{contactId} ?"
      , titleText: "Make an action for this contact"
      , cancelText: "Cancel"
      , buttonClicked: (index) =>
        @contactForm(angular.copy(contact))
        return true
      , cancel: ->
    })



  deleteContact: (contactId) =>
    @Contactbooster.one('lists', @scope.activeContacts.id).one('contacts', contactId).remove().then =>
      $("#contact_#{contactId}").fadeOut('fast')
      @scope.activeContacts.contacts = @removeContactFromMemory
    return true



  removeContactFromMemory: =>
     _.without(@scope.activeContacts.contacts, _.findWhere(@scope.activeContacts.contacts, { id: contactId }))



  contactForm: (contact = {}) =>
    @scope.contact = contact
    if @scope.contact.id
      @scope.modal = { title: "Edit contact: ##{@scope.contact.id}", text_button: "Edit contact"}
    else
      @scope.modal = { title: "New contact", text_button: "Add"}
    @scope.contactModal.show()



  closeContactForm: =>
    @scope.contactModal.hide()



  submitContact: (contact) =>
    # prep the request
    return alert "Please fill the fields" if _.isEmpty contact

    @ionicLoading.show({ template: 'Creating new contact...'})
    contact_to_save = { contact: contact }

    # branch depending on context
    if contact.id
      q = @editContact contact_to_save
    else
      q = @createContact contact_to_save
    q.then @success_cleanup, @error_cleanup



  success_cleanup: =>
    @ionicLoading.hide()
    @scope.contactModal.hide()



  error_cleanup: (err) =>
    @ionicLoading.hide()
    error_string = "Validation error\n"
    for field, error of err.data.error
      error_string += "#{field} : #{error[0]}\n"
    alert (error_string)



  editContact: (contact) =>
    q = @Contactbooster.one('lists', @scope.activeContacts.id).one('contacts', contact.contact.id).patch(contact)
    q.then (modified) =>
      old_contact = _.findWhere(@scope.activeContacts.contacts, {id: contact.contact.id})
      for key in [ 'lastname', 'firstname', 'phone' ]
        old_contact[key] = contact.contact[key]
    return q



  createContact: (contact) =>
    q = @Contactbooster.one('lists', @scope.activeContacts.id).post('contacts', contact)
    q.then (created) =>
      @scope.activeContacts.contacts.push contact.contact
    return q



  fetch: ->
    @ionicLoading.show({ template: 'Fetching lists.....' })
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

