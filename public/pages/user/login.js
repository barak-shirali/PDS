'use strict';

MetronicApp
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            // Dashboard
            .state('login', {
                url: "/login",
                templateUrl: "pages/user/login.html",            
                controller: "loginController",
                resolve: {
                    currentUser: ['$q', 'Users', function($q, Users) {
                        var deferred = $q.defer();

                        Users.currentUser(function(code, user) {
                            if(code == "OK") deferred.resolve(user);
                            else deferred.resolve(null);
                        });

                        return deferred.promise;
                    }]
                }
            });
    }])
    .controller('loginController', ['$rootScope', '$scope', '$state', 'currentUser', 'Users', function($rootScope, $scope, $state, currentUser, Users) {
        $scope.$on('$viewContentLoaded', function() {   
            // initialize core components
            Metronic.initAjax();
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageBodySolid = true;
        $rootScope.settings.layout.pageSidebarClosed = false;

        if(currentUser !== null) {
            $state.go('dashboard');
            return;
        }

        $rootScope.currentUser = currentUser;
        $scope.email = '';
        $scope.password = '';
        $scope.error = '';

        $scope.login = function() {
            $scope.error = '';
            Users.login($scope.email, $scope.password, function(code, user) {
                if(code === 'INVALID_CREDENTIAL' || code == 'UNEXPECTED_ERROR') {
                    $scope.error = 'Invalid email or password.';
                }
                else {
                    $state.go('dashboard');
                }
            });
        };
    }]);
