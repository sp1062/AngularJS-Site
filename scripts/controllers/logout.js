'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the myApp
 */
angular.module ( 'myApp' )
	.controller (
	'LogoutCtrl', function ( $location, LoginService )
	{

		// perform the logout
		LoginService.doLogout();

		// send the user away
		$location.path('/home');

	}
);
