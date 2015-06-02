angular.module('das', ['ngCookies', 'ngResource', 'ngRoute', "ngSanitize", 'ui.bootstrap', 'ui.router', 
	'angular-lodash', 'facebook', 'ngMask', 'ui.slider',
	'das.system', 'das.services', 'das.controllers']);

angular.module('das.system', []);
angular.module('das.services', []);
angular.module('das.controllers', []);