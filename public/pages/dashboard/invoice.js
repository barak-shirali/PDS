'use strict';

MetronicApp
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            // Dashboard
            .state('invoice', {
                url: "/invoice/:id",
                templateUrl: "pages/dashboard/invoice.html",            
                controller: "invoiceController",
                resolve: {
                    currentUser: ['$q', 'Users', function($q, Users) {
                        var deferred = $q.defer();

                        Users.currentUser(function(code, user) {
                            if(code == "OK") deferred.resolve(user);
                            else deferred.resolve(null);
                        });

                        return deferred.promise;
                    }],
                    payment: ['$stateParams', '$q', 'Payments', function($stateParams, $q, Payments) {
                        var deferred = $q.defer();

                        Payments.get($stateParams.id, function(code, payment) {
                            if(code == 'OK') deferred.resolve(payment);
                            else deferred.resolve(null);
                        });

                        return deferred.promise;
                    }]
                }
            });
    }])
    .controller('invoiceController', ['$rootScope', '$scope', '$state', 'currentUser', 'Payments', 'payment', function($rootScope, $scope, $state, currentUser, Payments, payment) {
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

        var loadPayment = function() {
            $scope.payment = payment;
        };

        loadPayment();
    }]);
