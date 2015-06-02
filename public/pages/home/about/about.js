angular.module('das')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('about', {
          url: "/about",
          templateUrl: "pages/home/about/about.html",
          controller: "AboutController as aboutCtrl",
          resolve: {
          	currentUser: ['$stateParams', '$q', 'Users', function($stateParams, $q, Users) {
            	var deferred = $q.defer();

          		Users.me().$promise.then(function(user) {
          			deferred.resolve(user);
          		}, function(err) {
          			deferred.resolve(null);
          		});

          		return deferred.promise;
          	}]
          }
      });

  }]);

angular.module('das.controllers')
  .controller('AboutController', ['$rootScope', '$scope', '$state', '$routeParams', '$location', 'currentUser',
  	function ($rootScope, $scope, $state, $routeParams, $location, currentUser) {

  		
      if(currentUser === null) {
        $state.go('landing');
        return;
      }
      $rootScope.siteParams.clearHookers();
      $rootScope.siteParams.buttonBack.show = true;
      $rootScope.siteParams.buttonBack.url = 'menu';
      $rootScope.siteParams.buttonMenu.show = false;
      $rootScope.siteParams.isMenu = true;
      $rootScope.siteParams.buttonCloseMenu.show = true;


  }]);