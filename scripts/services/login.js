'use strict';

/**
 * @ngdoc function
 * @name myApp.service:LoginService
 * @description
 * # LoginService
 * Service of the myApp
 */
angular.module ( 'myApp' )
	.service (
	'LoginService', function ( $localStorage, mySharedService)
	{
		// object for storing the next few functions
		var svc = {};

		// logs in a given user by his username
		svc.doLogin = function ( username )
		{

			$localStorage.user = {
				name      : username,
				loggedInAt: Date.now (),
				loggedIn  : true,
				email: "",
				addresses: [],
				cards: [],
				orders: []
			}


		};

		// logs out the current user
		svc.doLogout = function () {
			// replace the existing user object from storage, or create it if not there
			$localStorage.user = {
				loggedIn: false
			}
			mySharedService.clear();
		};

		// initialise the database containers
		svc.initialiseSystemDBMaybe = function ()
		{

			// create user session container if not there
			if ( !$localStorage.user )
			{
				// same thing needs to happen as if logging out the user
				svc.doLogout();
			}

			// create database if not there
			if ( !$localStorage.usersDB )
			{
				// initialise the storage with an empty object
				$localStorage.usersDB = {};
			}

		};

		// this needs to be here for this service to work
		return svc;
	}
);
