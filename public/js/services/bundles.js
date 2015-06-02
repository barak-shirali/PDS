//Trip service used for trips REST endpoint
angular.module('das.services').factory("Bundles", ['$resource', function($resource) {
    return $resource('api/bundles/:bundleId', {
        bundleId: '@id'
    }, {
        update: {
            method: 'PUT'
        },
        getBySlug: {
            method: 'GET',
            url: '/api/bundles/slug'
        },
        contributions: {
            method: 'GET',
            url: '/api/bundles/contributions',
            isArray: true
        }
    });
}]);