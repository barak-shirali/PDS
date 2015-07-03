MetronicApp
	.factory('Payments', ['$cookies', '$http', 'Users', function($cookies, $http, Users) {
		return {
			all: function(callback) {
				$http
					.get('/bam/payments', {
						headers: { token: Users.getCurrentToken() }
					})
					.success(function(data, status, headers, config) {
						callback(data.code, data.payments);
					})
					.error(function(data, status, headers, config) {
						callback("UNEXPECTED_ERROR", []);
					});
			},
			get: function(id, callback) {
				$http
					.get('/bam/payments/' + id, {
						headers: { token: Users.getCurrentToken() }
					})
					.success(function(data, status, headers, config) {
						callback(data.code, data.payment);
					})
					.error(function(data, status, headers, config) {
						callback("UNEXPECTED_ERROR", []);
					});
			},
			get_card: function(callback) {
				$http
					.get('/bam/payments/paypal/card', {
						headers: { token: Users.getCurrentToken() }
					})
					.success(function(data, status, headers, config) {
						callback(data);
					})
					.error(function(data, status, headers, config) {
						callback(data);
					});
			},
			add_card: function(creditcard, callback) {
				$http
					.post('/bam/payments/paypal/card', creditcard, {
						headers: { token: Users.getCurrentToken() }
					})
					.success(function(data, status, headers, config) {
						callback(data);
					})
					.error(function(data, status, headers, config) {
						callback(data);
					});
			}
		};
	}]);