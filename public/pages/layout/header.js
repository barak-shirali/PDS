/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$rootScope', '$scope', function($rootScope, $scope) {
	$scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);