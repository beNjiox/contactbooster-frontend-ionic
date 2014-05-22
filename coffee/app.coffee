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
  .controller('ContactsCtrl', ($scope, Contactbooster) ->
    $scope.contactsInitialized    = false
    $scope.contactListInitialized = false
    $scope.contactLists           = [ ]

    $scope.activeContacts         = [ ]
    $scope.activeContactLists     = [ ]

    Contactbooster.all('lists').getList().then (lists) ->
      $scope.contactListInitialized = true
      $scope.contactLists           = lists
      $scope.activeContactLists     = _.map( lists, (list) -> list.name )

    $scope.selectList = (index) ->
      $scope.contactsInitialized = true
      $scope.activeContacts      = $scope.contactLists[index].contacts
      console.log $scope.activeContacts[0]
      console.log $scope.activeContacts[0].lastname
  )