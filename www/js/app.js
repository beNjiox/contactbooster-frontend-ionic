(function() {
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
  }).controller('ContactsCtrl', function($scope, Contactbooster) {
    $scope.contactsInitialized = false;
    $scope.contactListInitialized = false;
    $scope.contactLists = [];
    $scope.activeContacts = [];
    $scope.activeContactLists = [];
    Contactbooster.all('lists').getList().then(function(lists) {
      $scope.contactListInitialized = true;
      $scope.contactLists = lists;
      return $scope.activeContactLists = _.map(lists, function(list) {
        return list.name;
      });
    });
    return $scope.selectList = function(index) {
      $scope.contactsInitialized = true;
      $scope.activeContacts = $scope.contactLists[index].contacts;
      console.log($scope.activeContacts[0]);
      return console.log($scope.activeContacts[0].lastname);
    };
  });

}).call(this);
