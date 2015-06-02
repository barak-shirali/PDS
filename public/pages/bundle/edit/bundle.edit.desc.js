angular.module('das')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('bundle/edit/desc', {
          url: "/bundle/:slug/edit/desc",
          templateUrl: "pages/bundle/edit/bundle.edit.desc.html",
          controller: "bundleEditDescController as bundleEditDescCtrl",
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
  .controller('bundleEditDescController', ['$rootScope', '$scope', '$state', '$routeParams', '$location', 'DEFAUT_BUNDLE_PHOTO', 'currentUser', 'bundle',
  	function ($rootScope, $scope, $state, $routeParams, $location, DEFAUT_BUNDLE_PHOTO, currentUser, bundle) {

      if(currentUser === null) {
        $state.go('landing');
        return;
      }
      if(bundle === null) {
        $state.go('home'); 
        return;
      }
      $rootScope.siteParams.clearHookers();
      $rootScope.siteParams.buttonBack.show = true;
      $rootScope.siteParams.buttonBack.url = '';
      $rootScope.siteParams.buttonMenu.show = false;
      $rootScope.siteParams.isMenu = false;
      $rootScope.siteParams.buttonCloseMenu.show = false;


      var init = function() {
        $scope.currentUser = currentUser;
        $scope.bundle = bundle;

        $rootScope.siteParams.clearHookers();
        $rootScope.siteParams.registerBackButtonHooker(function() {
          $scope.goBack();
          return true;
        });
      };

      $scope.goBack = function() {
        $state.go('bundle/view', {slug: $scope.bundle.slug});
      };

      $scope.onSave = function () {
        $scope.bundle.$update()
          .then(function() {
            $scope.current_photo = '';
            $scope.goBack();
          });
      };

      init();


  }]);