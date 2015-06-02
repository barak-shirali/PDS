angular.module('das')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('account/photo', {
          url: "/account/photo",
          templateUrl: "pages/user/account.edit_photo.html",
          controller: "accountEditPhotoController as accountEditPhotoCtrl",
          resolve: {
          	currentUser: ['$stateParams', '$q', 'Users', function($stateParams, $q, Users) {
            	var deferred = $q.defer();

          		Users.get({userId: 'me'}).$promise.then(function(user) {
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
  .controller('accountEditPhotoController', ['$rootScope', '$scope', '$state', '$routeParams', '$location', 'DEFAULT_AVATARS', 'currentUser',
  	function ($rootScope, $scope, $state, $routeParams, $location, DEFAULT_AVATARS, currentUser) {

      if(currentUser === null) {
        $state.go('landing');
        return;
      }

      currentUser.password = '';
      $rootScope.siteParams.clearHookers();
      $rootScope.siteParams.buttonBack.show = true;
      $rootScope.siteParams.buttonBack.url = 'account';
      $rootScope.siteParams.buttonMenu.show = false;
      $rootScope.siteParams.isMenu = true;
      $rootScope.siteParams.buttonCloseMenu.show = true;


      var init = function() {
        $scope.currentUser = currentUser;
        $scope.DEFAULT_AVATARS = DEFAULT_AVATARS;
      };

      $scope.onSave = function () {
        $scope.currentUser.$update()
          .then(function() {
            $state.go('account');
          });
      };

      $scope.onChangePhoto= function(url) {
        $scope.currentUser.photo = url;
        $scope.onSave();
      };


      init();


  }]);