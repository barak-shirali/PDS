'use strict';

MetronicApp
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            // Dashboard
            .state('users/edit', {
                url: "/users/edit/:id",
                templateUrl: "pages/dashboard/users-edit.html",            
                controller: "usersEditController",
                resolve: {
                    currentUser: ['$q', 'Users', function($q, Users) {
                        var deferred = $q.defer();

                        Users.currentUser(function(code, user) {
                            if(code == "OK") deferred.resolve(user);
                            else deferred.resolve(null);
                        });

                        return deferred.promise;
                    }],
                    user: ['$stateParams', '$q', 'Users', function($stateParams, $q, Users) {
                        var deferred = $q.defer();

                        Users.get($stateParams.id, function(code, user) {
                            if(code == 'OK') deferred.resolve(user);
                            else deferred.resolve(null);
                        });

                        return deferred.promise;
                    }]
                }
            });
    }])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            // Dashboard
            .state('users/create', {
                url: "/users/create",
                templateUrl: "pages/dashboard/users-edit.html",            
                controller: "usersEditController",
                resolve: {
                    currentUser: ['$q', 'Users', function($q, Users) {
                        var deferred = $q.defer();

                        Users.currentUser(function(code, user) {
                            if(code == "OK") deferred.resolve(user);
                            else deferred.resolve(null);
                        });

                        return deferred.promise;
                    }],
                    user: ['$stateParams', '$q', 'Users', function($stateParams, $q, Users) {
                        return {
                            id: null,
                            type: 'DRIVER',
                            status: 'BLOCKED'
                        };
                    }]
                }
            });
    }])
    .controller('usersEditController', ['$rootScope', '$scope', '$state', 'currentUser', 'user', 'Users', function($rootScope, $scope, $state, currentUser, user, Users) {
        $scope.$on('$viewContentLoaded', function() {   
            // initialize core components
            Metronic.initAjax();
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageBodySolid = true;
        $rootScope.settings.layout.pageSidebarClosed = false;

        if(currentUser === null) {
            $state.go('login');
            return;
        }

        if(currentUser.type != 'ADMIN') {
            $state.go('dashboard');
            return;
        }

        $rootScope.currentUser = currentUser;
        $scope.error = '';
        $scope.msg = '';
        $scope.user = user;

        $scope.getName = function(user) {
            if(user.type == 'SRS') return user.firstname;
            return user.firstname + ' ' + user.lastname;
        };
        $scope.save = function() {
            var callback = function(code, error, user) {
                if(code == 'OK') {
                    $scope.msg = 'Successfully saved';
                    $scope.user = user;
                    $state.go('users/edit', {id: user.id});
                }
                else {
                    $scope.error = error;
                }
            };

            $scope.error = '';
            $scope.msg = '';

            if(user.id) {
                Users.updateUser(user.id, user, callback);
            }
            else {
                Users.create(user, callback);
            }
        };

        Layout.fixContentHeight();
    }]);
