MetronicApp
    .controller('PaymentMethodDialogCtrl', function ($scope, $modalInstance, user, Payments) {
        $scope.creditcard = {
            type: '',
            number: '',
            expire_month: '',
            expire_year: '',
            cvv2: '',
            first_name: '',
            last_name: '',
            billing_address: {
                line1: '',
                city: '',
                country_code: 'US',
                state: '',
                postal_code: ''
            }
        };
        $scope.error = '';
        $scope.ok = function () {
            Payments.add_card($scope.creditcard, function(data) {
                if(data.code == 'OK') {
                    $modalInstance.close(data.creditcard);
                }
                else {
                    $scope.error = data.detail.response.details[0].field.replace(/_/g, ' ').replace('.', ' - ').captializeFirstLetter() + ' : ' + data.detail.response.details[0].issue;
                    console.log(data);
                }
            }, user.id);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        String.prototype.captializeFirstLetter = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
    });