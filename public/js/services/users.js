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
						if(data.code == 'OK') {
							$cookies.put('remitsystem_token', "");
						}
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
			},

			update: function(user, callback) {
				$http
					.put('/api/users', user, {
						headers: { token: this.getCurrentToken() },
					})
					.success(function(data, status, headers, config) {
						callback(data.code, data.error);
					})
					.error(function(data, status, headers, config) {
						callback("UNEXPECTED_ERROR", data.error);
					});
			},

			updateLocation: function(location, callback) {
				$http
					.post('/api/users/location', location, {
						headers: { token: this.getCurrentToken() },
					})
					.success(function(data, status, headers, config) {
						callback(data.code, data.error);
					})
					.error(function(data, status, headers, config) {
						callback("UNEXPECTED_ERROR", data.error);
					});
			},

			all: function(callback) {
				$http
					.get('/bam/users', {
						headers: { token: this.getCurrentToken() },
					})
					.success(function(data, status, headers, config) {
						callback(data.code, data.users);
					})
					.error(function(data, status, headers, config) {
						callback("UNEXPECTED_ERROR");
					});
			},

			get: function(id, callback) {
				$http
					.get('/bam/users/' + id, {
						headers: { token: this.getCurrentToken() },
					})
					.success(function(data, status, headers, config) {
						callback(data.code, data.user);
					})
					.error(function(data, status, headers, config) {
						callback("UNEXPECTED_ERROR");
					});
			},

			create: function(user, callback) {
				$http
					.post('/bam/users', user, {
						headers: { token: this.getCurrentToken() },
					})
					.success(function(data, status, headers, config) {
						callback(data.code, data.error, data.user);
					})
					.error(function(data, status, headers, config) {
						callback(data.code, data.error, null);
					});
			},

			updateUser: function(id, user, callback) {
				$http
					.put('/bam/users/' + id, user, {
						headers: { token: this.getCurrentToken() },
					})
					.success(function(data, status, headers, config) {
						callback(data.code, data.error, data.user);
					})
					.error(function(data, status, headers, config) {
						callback(data.code, data.error, null);
					});
			}
		};
	}]);