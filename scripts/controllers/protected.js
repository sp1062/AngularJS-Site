'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:ProtectedCtrl
 * @description
 * # ProtectedCtrl
 * The ProtectedCtrl handles values from the inputs of the forms
 * The two main forms are the Card Form and the Address Form are used in the module.
 * The ProtectedCtrl is in charge of removing, editing and adding both addresses and cards.
 * The ProtectedCtrl uses a 3rd-party module (https://github.com/gavruk/angular-card/) to print the card via css
 */


angular.module ( 'myApp' )
	.controller (
	'ProtectedCtrl', function ($scope, LoginService, $localStorage) //Gets the $scope and the LoginService and $localStorage
	{
		$scope.address_name = "" //Address name (What the users address name is saved as e.g. Home) input
		$scope.first_name = "" //First name of the address holder
		$scope.last_name = "" //Last name of the address holder
		$scope.addr1 = "" //First line of address
		$scope.addr2 = "" //Second line of address
		$scope.zip = "" //Zip code / Post code
		$scope.city = "" //City of address
		$scope.selected_address = {} //The selected variable to remove gets set on ng-click when the buttons remove and change are clicked (TODO)
		$scope.selected_card= {}; //Selected_card gets called on the button clicked change and remove (TODO)
		$scope.card_name = "" //Card name input (What the card name is stored out e.g. Business)
		$scope.name = "" //Account holders name of the card
		$scope.number = "" //Card number
		$scope.expiry =  "" //Card expiry date
		$scope.cvc =  "" //Card security code
		$scope.order_list = $localStorage.user.orders;


		$scope.cardPlaceholders = { //Gets the card placeholders
			name: 'Your Full Name',
			number: 'xxxx xxxx xxxx xxxx',
			expiry: '01/2016',
			cvc: 'xxx'
		}

		$scope.cardMessages = { //Checks validity of information
			validDate: 'valid\nthru',
			monthYear: 'MM/YYYY',
		}

		$scope.card = {

		} //The CSS image of the card currently on show

		$scope.cardOptions = { //The selected card when it is looping through ng-repeat
		}

		$scope.addr = { //Default address
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
		$scope.combine_address = function(address) {
			return address.address_name + " " + address.addr1 + ", " + address.city + ", "+ address.zip;
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
			$localStorage.user.addresses.push($scope.addr) //Adds the default address $scope.addr
		}
		/*
		 * END INIT
		 */

        $scope.address_list = $localStorage.user.addresses //Sets the $scope.address_list to the stored addresses
        $scope.address_options = $scope.address_list[0] //The current selected address option which is address_list[0] on default
		$scope.card_list = $localStorage.user.cards; //Card list is equal to the stored cards
		$scope.card_options = $localStorage.user.cards[0] //The current view is changed to the first option

		/**
		 * Checks if the card name stored doesn't already exist
		 * Returns the index if it does exist otherwise returns -1 if it doesn't exist
		 **/
		$scope.contains_name_card = function(crd_name) {
			if($scope.card_list == null) { //If the card_list is null then return -1 (false)
				return -1;
			}

			for(var a in $scope.cards) { //Loop through card list where a is the index
				if( ($localStorage.cards[a].card_name.toLowerCase() == crd_name.toLowerCase())) { //Ignore case comparison between crd_name and the stored card_name
					return a; //Return the index (true)
				}
			}
			return -1; //Loop is finished return false no matches found
		}
		/**
		 * @param item The item to get card index
		 * Gets the card index in card_list for item
		 **/
		$scope.get_card_index = function(item) {
			return $scope.card_list.indexOf(item)
		}

		/**
		 * Clears the input placeholders and sets the card to default
		 **/
		$scope.clear_card = function() {
			$scope.card_name = ""
			$scope.name = ""
			$scope.number = ""
			$scope.expiry =  ""
			$scope.cvc =  ""

			$scope.card_options = $scope.card_list[0] //Turn Selected card into first option
			$scope.card = $scope.card_options //Set card to blank
		}


		/**
		 * @param item Item to remove
		 **/
		$scope.remove_card = function(item) {
			$scope.selected_card = item; //Sets selected_card to item
			var index = $scope.get_card_index(item) //Get index of item
			$localStorage.user.cards.splice(index, 1) //Remove the item from local storage via index and deleteCount = 1
			$scope.card_list = $localStorage.user.cards; //Update card_list
		}

		/**
		 * @param item The item needed to modify
         */
		$scope.modify_card = function(item) {
			$scope.selected_card = item;
			var index = $scope.get_card_index(item) //Get index of item
			if(index == -1) {
				return;
			}

			//Updated item
			var newItem = {
				card_name: $scope.card_name ? $scope.card_name : $scope.card_options.card_name, //If $scope.card_name exists then set the new_item.card_name to $scope.card_name otherwise do not update the field and set it to its default
				name: $scope.name ? $scope.name : $scope.card_options.name,
				number: $scope.number ? $scope.number : $scope.card_options.number,
				expiry: $scope.expiry ? $scope.expiry : $scope.card_options.expiry,
				cvc: $scope.cvc ? $scope.cvc : $scope.card_options.cvc
			}

			$localStorage.user.cards[index] = newItem; // Set modified item

			$scope.card_list = $localStorage.user.cards //Update card list
			alert("Card modified.")
		}

		/*
		 * function called on submission of cards
		 */
		$scope.submit_card = function() {
			if($scope.card_options == $scope.card_list[0]) { //If card options is the first option then card will be added
				if($scope.contains_name_card($scope.card_name) != -1) { //If card name exists
					alert("Error, card already exists") //Card already exists alert
					return; //Stop method
				}
				//Gets the variables from the input
				var card = {
					card_name: $scope.card_name,
					name: $scope.name,
					number: $scope.number,
					expiry: $scope.expiry,
					cvc: $scope.cvc
				}

				//Store card
				$localStorage.user.cards.push(card)
			}

			$scope.clear_card() //Clear card
			return null;
		}
		$scope.set_selected_card = function(item) { //Sets selected card only for the purposes of submission (Changing and removing
			$scope.selected_card = item;

		}

		/**
		 * Called on ng-update when the option is changed the card is updated
		 */
		$scope.update_card = function(card) {
			$scope.card = card;
		}

		/**
		 * @param addr_name The name in the input box
		 * Checks addr_name with all the elements of address_list[a].address_name and returns a match
		 * If no match return -1
		 * If match return index
		 **/
		$scope.contains_name = function(addr_name) {
			if($scope.address_list == null) { //Address list is null return -1
				return -1;
			}

			for(var a in $scope.address_list) { //Loop through address_list where a is the index
				if($scope.address_list[a].address_name.toLowerCase() == addr_name.toLowerCase()) { //Address name checks ignore case
					return a; //Return the index
				}
			}
			return -1; //Does not contain
		}

		/**
		 * @param item The address item to get the index of in the address_list
		 *  Method simply gets index of item in address_list
		 **/
		$scope.get_address_index = function(item) {
			return $scope.address_list.indexOf(item);
		}

		/**
		 * @param item The address_item to set to selected address
		 * sets selected address
		 **/
		$scope.set_selected_address = function(item) {
			$scope.selected_address = item;
	}

		/**
		 * Clears input text holders and reverts the address options back to option one
		 **/
		$scope.clear = function() {
			$scope.address_name = ""
			$scope.first_name = ""
			$scope.last_name = ""
			$scope.addr1 = ""
			$scope.addr2 = ""
			$scope.zip = ""
			$scope.city = ""
            $scope.address_options = $scope.address_list[0] //Revert the option back to option 1 after clear
		}

		/**
		 * @param item address item to remove
		 * Method removes an item from the local storage
		 **/
		$scope.remove = function(item) {
			$scope.selected_address = item; //Sets selected_address to item
			var index = $scope.get_address_index(item) //Get index of item
			$localStorage.user.addresses.splice(index, 1) //Remove the item from local storage via index and deleteCount = 1
			$scope.card_list = $localStorage.user.cards; //Update card_list
		}

		/**
		 * TODO Modify address item
		 * @param item
         */
		$scope.modify = function(item) {
			$scope.selected_address = item;
			var index = $scope.get_address_index(item) //Get index of item
			if(index == -1) {
				return;
			}

			var newItem = {
				address_name: $scope.address_name ? $scope.address_name : $scope.address_options.address_name,
				first_name: $scope.first_name ? $scope.first_name : $scope.address_options.first_name,
				last_name: $scope.last_name ? $scope.last_name : $scope.address_options.last_name,
				addr1: $scope.addr1 ? $scope.addr1 : $scope.address_options.addr1,
				addr2: $scope.addr2 ? $scope.addr2 : $scope.address_options.addr2,
				city: $scope.city ? $scope.city : $scope.address_options.city,
				zip: $scope.zip ? $scope.zip : $scope.address_options.zip
			}
			$localStorage.user.addresses[index] = newItem;

			$scope.address_list = $localStorage.user.addresses //address_list is set to storagees stored addresses to update the options
			alert("Item modified.")
		}

		/**
		 * Adress submit function when the form is submitted it is handled here.
		 **/
		$scope.submit = function() {
			if($scope.address_options == $scope.address_list[0]) { //If the address option is the first option then we need to add a new address cause that is the only button available to u0s
                /**
                 * The new item to be added from the localscope list
				 * They are picked up from the input values.
                 **/
				var item = {
                    address_name: $scope.address_name,
                    first_name: $scope.first_name,
                    last_name: $scope.last_name,
                    addr1: $scope.addr1,
                    addr2: $scope.addr2,
                    city: $scope.city,
                    zip: $scope.zip
                }

				//Checks the name of the address and checks if no other conflicting address names are there
                if($scope.contains_name($scope.address_name) != -1) {
                    alert("Error name for address already exists");
                    return;
                }
				$localStorage.user.addresses.push(item) //Add the address to local storage
			}
			$scope.address_list = $localStorage.user.addresses //address_list is set to storagees stored addresses to update the options

            $scope.clear() //Clears after submit
            return null;
		}

	}
);
