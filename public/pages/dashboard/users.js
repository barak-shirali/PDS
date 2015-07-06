'use strict';

MetronicApp
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            // Dashboard
            .state('users', {
                url: "/users",
                templateUrl: "pages/dashboard/users.html",            
                controller: "usersController",
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
    .controller('usersController', ['$rootScope', '$scope', '$state', 'currentUser', 'Users', 'ngTableParams', function($rootScope, $scope, $state, currentUser, Users, ngTableParams) {
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
        $scope.users = [];

        $scope.reloadUsers = function() {
            $scope.error = '';
            $scope.msg = '';
            Users.all(function(code, users) {
                if(code == 'OK') {
                    $scope.users = users;
                }
                else {
                    $scope.users = [];
                }
                $scope.tableParams.reload();
            });
        };
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10,
            sorting: true
        }, {
            getData: function($defer, params) {
                params.total($scope.users.length);
                $defer.resolve($scope.users.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
        $scope.getStatus = function(user) {
            if(user.status == 'UNVERIFIED') return 'Unverified';
            else if(user.status == 'ACTIVE') return 'Active';
            else if(user.status == 'DELETED') return 'Deleted';
            else if(user.status == 'BLOCKED') return 'Blocked';
        };
        $scope.getType = function(user) {
            if(user.type == 'ADMIN') return 'Admin';
            else if(user.type == 'SRS') return 'SRS';
            else if(user.type == 'DRIVER') return 'Driver';
        };
        $scope.getName = function(user) {
            if(user.type == 'SRS') return user.firstname;
            return user.firstname + ' ' + user.lastname;
        };
        $scope.getPaymentMethodStatus = function(user) {
            // if(user.type == 'SRS') {
            if(!user.braintreeCustomerId) return '';
            else return 'Added';
            // }
        };
        // $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        //         TableAdvanced.init();
        //         // Layout.fixContentHeight();
        // });
        $scope.delete= function(user) {
            if(!confirm('Do you want to proceed?')) return;

            Users.delete(user.id, function(code, data) {
                if(code == 'OK') {
                    $scope.reloadUsers();
                    $scope.error = '';
                    $scope.msg = 'Successfully removed';
                }
                else {
                    $scope.msg = '';
                    $scope.error = error;
                }
            });
        };
        $scope.reloadUsers();
        Layout.fixContentHeight();
    }]);
