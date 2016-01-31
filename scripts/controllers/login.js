'use strict';

/**
 * @ngdoc function
 * @name myAppApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the myApp
 */
angular.module ( 'myApp' )
	.controller (
	'LoginCtrl', function ( $scope, $localStorage, $location, LoginService )
	{
		// allow the database to be accessed in the View - DEVELOPMENT ONLY
		$scope.myUsers = $localStorage.usersDB;

		// method to be called from the view on click
		$scope.submit = function ()
		{

			// access the values in the username and password input boxes
			var username = $scope.login.username,
			    password = $scope.login.password;

			// does user exist ?
			if ( $scope.myUsers && username in $scope.myUsers && $scope.myUsers[ username ] === btoa ( password ) )
			{

				// perform login for the user
				LoginService.doLogin ( username );

				// redirect to protected page
				$location.path ( '/protected' );

			}
			// trigger alert
			else{
				alert('wrong input')
			}


		};

	}
);
