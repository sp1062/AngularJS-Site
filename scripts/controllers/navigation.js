'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:NavigationCtrl
 * @description
 * # NavigationCtrl
 * Controller of the myApp
 */
angular.module ( 'myApp' ).controller (
	'NavigationCtrl', function ( $scope, $localStorage, $location, $filter, $http, LoginService, mySharedService )
	{

		$scope.getCartSize = function() { //Get cart size for navigation control
			return mySharedService.getCartSize() //Gets the cart size
		}
		// give the view access to the storage
		$scope.$storage = $localStorage;

		// import the navigation items from the external JSON type file, keeps this controller clean
		$http.get ( 'scripts/data/navigation.json' ).success (
			function ( data )
			{
				// when the data from that file is in, store the information for use
				$scope.items = data.items;
			}
		).then (
			// now carry on doing what needs to be done
			function ()
			{

				// Must use a wrapper object, otherwise "activeItem" won't work
				$scope.states = {};

				// make sure the database is in place
				LoginService.initialiseSystemDBMaybe ();

				// requested route link name on page load
				var currentRoute,
				    defaultRoute    = 'home',
				    // function to determine current route
				    setCurrentRoute = function ()
				    {
					    // When route is (index.html#/contact), $$path contains (/contact), so I am removing the (/) to get the route link name
					    // Also, when route is (index.html#/), $$path contains (/), so when removing the (/) I end up with an empty string, meaning the user is
					    currentRoute = $location.$$path.substr ( 1 );
				    },
				    // function to set current active item based on current route
				    setActiveItem   = function ()
				    {
					    // If currentRoute is empty (i.e. 'home' in my case), set its value to defaultRoute, otherwise set it to the current route link name
					    $scope.states.activeItem = currentRoute.length ? currentRoute : defaultRoute;
				    };

				// if user manually changes the browser location, detect that and make menu reflect the change
				$scope.$on (
					'$routeChangeSuccess', function ()
					{
						setCurrentRoute ();
						setActiveItem ();
					}
				);

				// set the current route on page load
				setCurrentRoute ();

				// Set default nav item based on id
				setActiveItem ();

				/** SECURITY SYSTEM **/

					// every time the current app location changes, the below security check will happen
				$scope.$watch (
					function () { return $location.path (); }, function ( newValue /*, oldValue*/ )
					{
						// both newValue and oldValue contain a starting "/", we need to get rid of that
						var requestedRouteLink = newValue.substr ( 1 ),
						    // filter returns a new array with only the elements matching our query, in this case the navigation item
						    // that has the "link" property the same as our requested route
						    requestedRoute     = $filter ( 'filter' ) ( $scope.items, { link: requestedRouteLink }, true )[ 0 ];

						// if current user is not logged in and the requested route is private
						// note: "!!" converts anything into true/false, so: "yes" = true, "no" = false, "0" = false, etc.
						// look up JAVASCRIPT TRUTHY/FALSEY for more information on what the outcome of applying "!!" to a value would be
						if ( $localStorage.user.loggedIn === false && !!requestedRoute.private )
						{
							// redirect the user to the login page
							$location.path ( '/login' );
							// stop running code inside this function
							return;
						}

						// if current user is logged in, but tying to access a page that makes no sense when logged in, stop them
						if ( $localStorage.user.loggedIn === true && !!requestedRoute.hideWhenLoggedIn )
						{

							// redirect the user to the default page
							$location.path ( defaultRoute );
						}

					}
				);

			}
		);

	}
);

