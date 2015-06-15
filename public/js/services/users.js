MetronicApp
	.factory('Users', ['$cookies', '$http', function($cookies, $http) {
		return {
			login: function(email, password, callback) {
				$http
					.post('/api/users/auth', {
						email: email,
						password: password
					})
					.success(function(data, status, headers, config) {
						if(data.code == "OK") {
							$cookies.put('remitsystem_token', data.token);
							callback("OK", data.user);
						}
						else {
							callback(data.code);
						}
					})
					.error(function(data, status, headers, config) {
						callback('UNEXPECTED_ERROR');
					});
			},

			logout: function(callback) {
				$http
					.get('/api/users/signout', {
						headers: { token: this.getCurrentToken() }
					})
					.success(function(data, status, headers, config) {
						callback(data.code);
					})
					.error(function(data, status, headers, config) {
						callback("UNEXPECTED_ERROR");
					});
			},

			getCurrentToken: function() {
				var token = $cookies.get('remitsystem_token');

				if(typeof token === "undefined" || token === null) return "";

				return token;
			},

			currentUser: function(callback) {
				$http
					.get('/api/users/me', {
						headers: { token: this.getCurrentToken() }
					})
					.success(function(data, status, headers, config) {
						callback(data.code, data.user);
					})
					.error(function(data, status, headers, config) {
						callback("UNEXPECTED_ERROR");
					});
			}
		};
	}]);