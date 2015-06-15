MetronicApp
	.factory('Map', ['$http', function($http) {
		return {
			geocode: function(address, callback) {
				$http
					.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
					.success(function(data, status, headers, config) {
						if(data.status == 'OK') {
							callback({
								lat: data.results[0].geometry.location.lat,
								lng: data.results[0].geometry.location.lng
							});
						}
						else {
							callback(null);
						}
					})
					.error(function(data, status, headers, config) {
						callback(null);
					});
			}
		};
	}]);