angular.module("das.system")
.directive('uiBundleConfirm', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            ok: '=ok',
            cancel: '=cancel'
        },
        templateUrl: '/js/directives/ui-bundle-confirm/ui-bundle-confirm.html',
        link: function($scope, $elem, $attrs) {
        }
    };
});