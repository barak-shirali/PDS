angular.module('das')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('bundle/whosin', {
          url: "/bundle/:slug/whosin",
          templateUrl: "pages/bundle/whosin.html",
          controller: "bundleWhosInController as bundleWhosInCtrl",
          resolve: {
          	currentUser: ['$stateParams', '$q', 'Users', function($stateParams, $q, Users) {
            	var deferred = $q.defer();

          		Users.get({userId: 'me'}).$promise.then(function(user) {
                deferred.resolve(user);
          		}, function(err) {
          			deferred.resolve(null);
          		});

          		return deferred.promise;
          	}],
            bundle: ['$stateParams', '$q', 'Bundles', function($stateParams, $q, Bundles) {
              var deferred = $q.defer();

              Bundles.getBySlug({slug: $stateParams.slug}).$promise.then(function(bundle) {
                deferred.resolve(bundle);
              }, function(err) {
                deferred.resolve(null);
              });

              return deferred.promise;
            }]
          }
      });

  }]);

angular.module('das.controllers')
  .controller('bundleWhosInController', ['$rootScope', '$scope', '$state', '$routeParams', '$location', 'currentUser', 'bundle', 'BUNDLE_STATUS',
  	function ($rootScope, $scope, $state, $routeParams, $location, currentUser, bundle, BUNDLE_STATUS) {

      if(currentUser === null) {
        $state.go('landing');
        return;
      }
      if(bundle === null || bundle.status != BUNDLE_STATUS.LIVE) {
        $state.go('home'); 
        return;
      }
      
      $rootScope.siteParams.clearHookers();
      
      $rootScope.siteParams.buttonBack.show = true;
      $rootScope.siteParams.buttonBack.url = {url: 'bundle/view', params: {slug:bundle.slug}};
      $rootScope.siteParams.buttonMenu.show = false;
      $rootScope.siteParams.isMenu = false;
      $rootScope.siteParams.buttonCloseMenu.show = false;
      $rootScope.siteParams.buttonCloseMenu.url = {url: 'bundle/live', params: {slug: bundle.slug}};


      var init = function() {
        $scope.currentUser = currentUser;
        $scope.bundle = bundle;
      };

      init();


  }]);