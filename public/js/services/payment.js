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
			get_card: function(callback, user_id) {
				$http
					.get('/bam/payments/paypal/card' + (typeof user_id == "undefined" ? "" : '?id=' + user_id), {
						headers: { token: Users.getCurrentToken() }
					})
					.success(function(data, status, headers, config) {
						callback(data);
					})
					.error(function(data, status, headers, config) {
						callback(data);
					});
			},
			add_card: function(creditcard, callback, user_id) {
				$http
					.post('/bam/payments/paypal/card' + (typeof user_id == "undefined" ? "" : '?id=' + user_id), creditcard, {
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