angular.module('das')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('account', {
          url: "/account",
          templateUrl: "pages/user/account.html",
          controller: "AccountController as accountCtrl",
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
            cards: ['$q', 'Cards', function($q, Cards) {
              var deferred = $q.defer();

              Cards.query().$promise.then(function(cards) {
                deferred.resolve(cards);
              }, function(err) {
                deferred.resolve(null);
              });

              return deferred.promise;
            }],
            transactions: ['$q', 'Transactions', function($q, Transactions) {
              var deferred = $q.defer();

              Transactions.query().$promise.then(function(transactions) {
                deferred.resolve(transactions);
              }, function(err) {
                deferred.resolve(null);
              });

              return deferred.promise;
            }]
          }
      });

  }]);

angular.module('das.controllers')
  .controller('AccountController', ['$rootScope', '$scope', '$state', '$routeParams', '$location', 'Users', 'Cards', 'currentUser', 'cards', 'transactions',
  	function ($rootScope, $scope, $state, $routeParams, $location, Users, Cards, currentUser, cards, transactions) {

  		
      if(currentUser === null) {
        $state.go('landing');
        return;
      }

      currentUser.password = '';
      $rootScope.siteParams.clearHookers();
      $rootScope.siteParams.buttonBack.show = true;
      $rootScope.siteParams.buttonBack.url = 'menu';
      $rootScope.siteParams.buttonMenu.show = false;
      $rootScope.siteParams.isMenu = true;
      $rootScope.siteParams.buttonCloseMenu.show = true;


      var init = function() {
        $scope.currentUser = currentUser;
        $scope.cards = cards;
        $scope.transactions = transactions;

        $scope.edit = {
          isEditName: false,
          isEditEmail: false,
          isEditPassword: false
        };
      };

      $scope.onEdit = function (field) {
        $scope.onSave(false);
        $scope.edit[field] = true;

        if(field == 'isEditName') {
          angular.element('.page-account .firstname').focus();
        }
        else if(field == 'isEditEmail') {
          angular.element('.page-account .email').focus();
        }
        else if(field == 'isEditPassword') {
          angular.element('.page-account .password').focus();
        }
      };

      $scope.onSave = function (apply) {
        _.each($scope.edit, function(val, key) {
          $scope.edit[key] = false;
        });
        $scope.currentUser.$update()
          .then(function() {
            if(apply) $scope.$apply();
          });
      };

      $scope.onEditPhoto = function() {
        $state.go('account/photo');
      };

      $scope.onChangePhoto= function(url) {
        $scope.currentUser.photo = url;
        $scope.onSave(true);
      };


      init();


  }]);