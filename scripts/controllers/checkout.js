'use strict';


/**
 * @ngdoc function
 * @name myApp.controller:ProtectedCtrl
 * @description
 * TODO
 */
angular.module ( 'myApp')
	.controller (
	'CheckoutCtrl', function ($scope,  $localStorage, mySharedService)
	{
		$scope.default_address = { //Default address
			address_name: "Add new address",
			first_name: "First Name",
			last_name: "Last Name",
			addr1: "Address Line 1",
			addr2: "Address Line 2",
			city: "City",
			zip:"Zip"
		}

		$scope.default_card = { //Default card
			card_name: "Add new card",
			name: 'Add new card',
			number: 'xxxx xxxx xxxx xxxx',
			expiry: '01/2016',
			cvc: 'xxx'
		}


		/*
		 * CONTROLLER INIT
		 */
		if($localStorage.user.cards.length <= 1) { //If the cards length is less than or equal to one ($scope.defaul_card will be added on initialization for testing purposes)
			$localStorage.user.cards = [] //New card array in local storage
			$localStorage.user.cards.push($scope.default_card) //Add the default card to the local storage

		}
		if($localStorage.user.addresses.length <= 1) { //If the addresses length is less than one
			$localStorage.user.addresses = [] //Then clear the addresses in local storage
			$localStorage.user.addresses.push($scope.default_address) //Adds the default address $scope.addr
		}
		/*
		 * END INIT
		 */

		$scope.card_list = $localStorage.user.cards;
		$scope.address_list = $localStorage.user.addresses;
		$scope.address_options = $scope.address_list[0]
		$scope.card_options = $scope.card_list[0]

		$scope.valid_checkout = function() {
			if($scope.address_options == $scope.address_list[0] || $scope.card_options == $scope.card_list[0]) {
				return false;
			}
			return true
		}

		$scope.get_message = function() {
			if($scope.address_options == $scope.address_list[0]) {
				return "Please select an address!"
			}
			if($scope.card_options == $scope.card_list[0]) {
				return "Please select a card"
			}
			return "Pay now"
		}

		$scope.combine_address = function(address) {

			return address.address_name + " " + address.addr1 + ", " + address.city + ", "+ address.zip;
		}

		$scope.combine_card = function(card) {
			return card.card_name + ", " + card.number + ", " + card.expiry
		}

		$scope.checkout_process = function() {
			var item = {
				order_items: mySharedService.getItemList(),
				address: $scope.address_options,
				payment_method: $scope.card_options,
				item_total: mySharedService.getItemTotal(),
				delivery_total: mySharedService.getDeliveryTotal(),
				sub_total: mySharedService.getSubTotal()
			}

			$localStorage.user.orders.push(item)
			mySharedService.clear(); //Clear cart
			alert("Order processed redirecting to account page!")
			window.location.href = '/#protected';
		}

	}
);
