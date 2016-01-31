'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controls the cart page linked with the mySharedService to retrive information from the cart
 * It controls removing from the cart and prices which are calculated from the cart.
 * Ultimately functions from mySharedService are called to provide these calculations
 */
var app = angular.module ( 'myApp' ); //create module


app
	.controller (
	'CartCtrl', function ($scope, mySharedService) //create controller with the mySharedService which controls the cart
	{
        $scope.itemList = mySharedService.getItemList(); //Gets the item list from the shared service
        $scope.getItemTotal = mySharedService.getItemTotal; //Gets the item total from the service
        $scope.getDeliveryTotal = mySharedService.getDeliveryTotal; //Gets the delivery total from service
        $scope.getSubTotal = mySharedService.getSubTotal; //Gets subtotal from service

        /**
         * @param item Item to remove
         * Removes item from the shared service
         */
        $scope.removeItem = function(item) {
            mySharedService.removeItem(item); // using services for more than 1 module
        }

        /**
         * Gets the cart size from the mySharedService
         */
        $scope.getCartSize = function() {
            return mySharedService.getCartSize();
        }

        /**
         * Checks if card is empty
         **/
        $scope.isEmpty = function() {
            return mySharedService.getCartSize() == 0;
        }
	}
);