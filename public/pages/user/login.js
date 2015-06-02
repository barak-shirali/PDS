angular.module('das')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('login', {
          url: "/login",
          templateUrl: "pages/user/login.html",
          controller: "LoginController as loginCtrl",
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
  .controller('LoginController', ['$rootScope', '$scope', '$state', '$routeParams', '$location', 'Facebook', 'currentUser', 'Users',
  	function ($rootScope, $scope, $state, $routeParams, $location, Facebook, currentUser, Users) {

  		
      if(currentUser !== null) {
        $state.go('home');
        return;
      }
      $rootScope.siteParams.clearHookers();
      $rootScope.siteParams.buttonBack.show = true;
      $rootScope.siteParams.buttonBack.url = 'landing';
      $rootScope.siteParams.buttonMenu.show = false;
      $rootScope.siteParams.isMenu = false;
      $rootScope.siteParams.buttonCloseMenu.show = false;


  		$scope.error = '';
  		$scope.email = '';
  		$scope.password = '';

  		$scope.login = function() {
        $scope.error = '';
  			Users.auth({
  				email: $scope.email,
  				password: $scope.password
  			}).$promise.then(function(result) {
    			$rootScope.isLoggedIn = true;
				  $state.go('home');
  			}, function(err) {
  				$scope.error = err.data.errors;
  			});
  		};

      $scope.loginWithFacebook = function() {
        $scope.error = '';
        Facebook.login(function(response) {
          if (response.authResponse) {
            Facebook.api('/me', function(response) {
              Users.authFacebook({
                facebookId: response.id,
                firstname: response.first_name,
                surname: response.last_name,
                dob: null,
                email: null,
                photo: 'http://graph.facebook.com/' + response.id + '/picture?type=square'
              }).$promise.then(function(result) {
                $rootScope.isLoggedIn = true;
                $state.go('home');
              }, function(err) {
                $scope.error = err.data.errors;
              });
            });
          }
        });
      };

  		$scope.clearError= function() {
  			$scope.error = '';
  		};

  }]);