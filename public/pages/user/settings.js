'use strict';

MetronicApp
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            // Dashboard
            .state('settings', {
                url: "/settings",
                templateUrl: "pages/user/settings.html",            
                controller: "settingsController",
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
    .controller('settingsController', ['$rootScope', '$scope', '$state', 'currentUser', 'Users', 'Map', function($rootScope, $scope, $state, currentUser, Users, Map) {
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

        $rootScope.currentUser = currentUser;
        $scope.user = JSON.parse(JSON.stringify($rootScope.currentUser));
        $scope.user.password = '';
        $scope.user.password1 = '';
        $scope.error = '';
        $scope.msg = '';

        $scope.refreshMap = function() {
            $scope.map.refresh = true;
        };

        var loadMap = function() {
            $scope.map = { center: { latitude: $scope.user.latitude, longitude: $scope.user.longitude }, zoom: 14 };
        };
        loadMap();

        $scope.save = function() {
            $scope.error = '';
            $scope.msg = '';
            $scope.user.password = '';
            Users.update($scope.user, function(code, msg) {
                if(code == 'OK') {
                    $rootScope.currentUser = JSON.parse(JSON.stringify($scope.user));
                    $scope.msg = 'Successfully updated.';
                }
                else {
                    $scope.error = msg;
                }
            });
        };
        $scope.savePassword = function() {
            $scope.error = '';
            $scope.msg = '';
            if($scope.user.password === "") {
                $scope.error = 'Please enter password.';
                return;
            }
            else if($scope.user.password != $scope.user.password1) {
                $scope.error = 'Confirm password does not match.';
                return;
            }
            else {
                Users.update($scope.user, function(code, msg) {
                    if(code == 'OK') {
                        $rootScope.currentUser = JSON.parse(JSON.stringify($scope.user));
                        $scope.msg = 'Successfully updated.';
                    }
                    else {
                        $scope.error = msg;
                    }
                });
            }
        };
        $scope.findLatLng = function() {
            Map.geocode($scope.user.address, function(geo) {
                if(geo) {
                    $scope.user.latitude = geo.lat;
                    $scope.user.longitude = geo.lng;
                }
            }); 
        };
        $scope.saveLocation = function() {
            $scope.error = '';
            $scope.msg = '';
            $scope.user.password = '';
            Users.update($scope.user, function(code, msg) {
                if(code == 'OK') {
                    Users.updateLocation($scope.user, function(code, msg) {
                        if(code == 'OK') {
                            $rootScope.currentUser = JSON.parse(JSON.stringify($scope.user));
                            $scope.msg = 'Successfully updated.';
                        }
                        else {
                            $scope.error = msg;
                        }
                    });
                }
                else {
                    $scope.error = msg;
                }
            });
        };
        Layout.fixContentHeight();
    }]);
