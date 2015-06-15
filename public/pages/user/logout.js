'use strict';

MetronicApp
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            // Dashboard
            .state('logout', {
                url: "/logout",
                templateUrl: "pages/user/logout.html",            
                controller: "logoutController",
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
    .controller('logoutController', ['$rootScope', '$scope', '$state', 'currentUser', 'Users', function($rootScope, $scope, $state, currentUser, Users) {
        
        Users.logout(function(code) {
            $state.go('login');
        });
    }]);
