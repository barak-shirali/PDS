'use strict';

MetronicApp
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            // Dashboard
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "pages/dashboard/dashboard.html",            
                controller: "dashboardController",
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
    .controller('dashboardController', ['$rootScope', '$scope', '$state', 'currentUser', 'Payments', function($rootScope, $scope, $state, currentUser, Payments) {
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

        Layout.fixContentHeight();

        $scope.lastweek = null;

        var loadPayment = function() {
            Payments.all(function(code, payments) {
                $scope.payments = payments;
                console.log(payments);

                $scope.paymentsDue = _.filter($scope.payments, function(payment) {
                    return payment.status == 'DUE' || payment.status == 'FAILED';
                });
                $scope.paymentsSuccess = _.filter($scope.payments, function(payment) {
                    return payment.status == 'PAID' || payment.status == 'FAILED';
                });

            });
        };

        loadPayment();
    }]);
