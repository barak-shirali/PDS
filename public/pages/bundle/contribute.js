angular.module('das')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('bundle/contribute', {
          url: "/bundle/contribute/:slug/:step",
          templateUrl: "pages/bundle/contribute.html",
          controller: "bundleContributeController as bundleContributeCtrl",
          resolve: {
          	currentUser: ['$stateParams', '$q', 'Users', function($stateParams, $q, Users) {
            	var deferred = $q.defer();

          		Users.me().$promise.then(function(user) {
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
            }],
            step: ['$stateParams', function($stateParams) {
              var step = parseInt($stateParams.step);
              if(isNaN(step) || typeof step == "undefined" || step < 1 || step > 6)
                return 1;
              return step;
            }]
          }
      });

  }]);

angular.module('das.controllers')
  .controller('bundleContributeController', ['$rootScope', '$scope', '$state', '$routeParams', '$timeout', 'BundleDataService', 'currentUser', 'preview', 'bundle', 'BUNDLE_STATUS', 
  	function ($rootScope, $scope, $state, $routeParams, $timeout, BundleDataService, currentUser, preview, bundle, BUNDLE_STATUS) {

      if(currentUser === null) {
        $state.go('landing');
        return;
      }
      if(bundle == null) {
        $state.go('home'); 
        return;
      }
      $rootScope.siteParams.clearHookers();
      $rootScope.siteParams.buttonBack.show = true;
      $rootScope.siteParams.buttonBack.url = 'home';
      $rootScope.siteParams.buttonMenu.show = false;
      $rootScope.siteParams.isMenu = false;
      $rootScope.siteParams.buttonCloseMenu.show = true;


      var init = function() {
        $scope.bundle = bundle;
        $scope.preview = preview;
        $scope.currentUser = currentUser;
        $scope.BUNDLE_STATUS = BUNDLE_STATUS;
        $scope.showBundleOverlay = bundle.status == BUNDLE_STATUS.DRAFTED;
        if($scope.showBundleOverlay) {
          $timeout(function() {
            angular.element('.bundle-overlay').css('height', (angular.element('.page-container').height() + 50) + 'px');
            angular.element('.guide-desc').css('top', angular.element('.btn-bundle-add-desc').offset().top + 'px');
            angular.element('.btn-got-it').css('top', angular.element('.btn-bundle-add-desc').offset().top + angular.element('.btn-bundle-add-desc').height() + 'px');
          });
        }

        if(bundle.status === 0) {
          $rootScope.siteParams.clearHookers();
          $rootScope.siteParams.registerBackButtonHooker(function() {
            $rootScope.bundle = bundle;
            $state.go('bundle/wizard', {step: 6});
            return true;
          });
          $rootScope.siteParams.registerCloseButtonHooker(function() {
            bundle.$delete();
          });
        }
        else {
          $rootScope.siteParams.buttonCloseMenu.show = false;
          $rootScope.siteParams.buttonMenu.show = true;
        }
      };

      $scope.getProgressDescription = function() {
        return BundleDataService.getProgressDescription($scope.bundle);
      };

      $scope.onEditPhoto = function() {
        $state.go('bundle/edit/photo', {slug: $scope.bundle.slug});
      };

      $scope.onEditDesc = function() {
        $state.go('bundle/edit/desc', {slug: $scope.bundle.slug});
      };

      $scope.onMakeLive = function() {
        $scope.bundle.status = BUNDLE_STATUS.LIVE;
        $scope.bundle.$update().then(function() {
          $state.go('bundle/live', {slug: $scope.bundle.slug});
        });
      };

      $scope.onHideOverlay = function() {
        $scope.showBundleOverlay = false;
      };

      $scope.onThumbnailClick = function() {

      };

      $scope.$watch('bundle', function() {
        console.log($scope.bundle);
      }, true);

      init();


  }]);