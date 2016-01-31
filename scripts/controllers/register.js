'use strict';

/**
 * @ngdoc function
 * @name myAppApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the myApp
 */
angular.module ( 'myApp' )
	.controller (
	'RegisterCtrl', function ( $scope, $localStorage, $location, LoginService )
	{

		// method to be called from the view on click
		$scope.submit = function () {

			// access the values in the username, password, and passwordConfirm input boxes
			var username = $scope.register.username,
			    password = $scope.register.password,
				passwordConfirm = $scope.register.passwordConfirm;

			// add the new user
			$localStorage.usersDB[username] = btoa(password);

			// login the user
			LoginService.doLogin(username);

			// redirect user to protected page
			$location.path('/protected');

		};
	}
);
