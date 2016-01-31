'use strict';

/**
 * @ngdoc overview
 * @name myApp
 * @description
 * # myApp
 *
 * @Source Card= https://github.com/gavruk/angular-card/
 * @Source SlideToggle=http://jsfiddle.net/3sVz8/19/
 * @Source Form theme  = http://formoid.com/
 * Main module of the application.
 */
(function (window, document, Card, angular, undefined) { //Implementation of card
    'use strict';
    angular
        .module('myApp', [  /* START Leave this untouched, it's a list of Angular components available to your app, should you need them at any point START */
            'ngAnimate',
            'ngAria',
            'ngCookies',
            'ngMessages',
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'ngTouch',
            'ngStorage'
            /* END Leave this untouched, it's a list of Angular components available to your app, should you need them at any point END */
        ])   .config (
        function ($routeProvider) {
            $routeProvider
                .when (
                    '/home', { // user accesses index.html/#/home
                        templateUrl: 'views/home.html', // location of the View template i.e. the HTML
                        controller: 'HomeCtrl', // found in /scripts/controllers/home.js
                        controllerAs: 'home', // name of the controller, used in the views
                        animation: 'slide' // what transition animation should this use
                    }
                )
                .when (
                    '/about', { // user accesses index.html/#/about
                        templateUrl: 'views/about.html', // location of the View template i.e. the HTML
                        controller: 'AboutCtrl', // found in /scripts/controllers/about.js
                        controllerAs: 'about', // name of the controller, used in the views
                        animation: 'slide' // what transition animation should this use
                    }
                )
                .when (
                    '/contact', { // user accesses index.html/#/contact
                        templateUrl: 'views/contact.html', // location of the View template i.e. the HTML
                        controller: 'ContactCtrl', // found in /scripts/controllers/contact.js
                        controllerAs: 'contact', // name of the controller, used in the views
                        animation: 'slide' // what transition animation should this use
                    }
                )
                .when (
                    '/browse', { // user accesses index.html/#/browse
                        templateUrl: 'views/browse.html', // location of the View template i.e. the HTML
                        controller: 'BrowseCtrl', // found in /scripts/controllers/browse.js
                        controllerAs: 'browse', // name of the controller, used in the views
                        animation: 'slide' // what transition animation should this use
                    }
                )
                .when (
                    '/login', { // user accesses index.html/#/login
                        templateUrl: 'views/login.html', // location of the View template i.e. the HTML
                        controller: 'LoginCtrl', // found in /scripts/controllers/login.js
                        controllerAs: 'login', // name of the controller, used in the views
                        animation: 'slide' // what transition animation should this use
                    }
                )
                .when (
                    '/logout', { // user accesses index.html/#/logout
                        template: ' ', // no template, just run the controller's code
                        controller: 'LogoutCtrl', // found in /scripts/controllers/logout.js
                        controllerAs: 'logout' // name of the controller, used in the views
                    }
                )
                .when (
                    '/register', { // user accesses index.html/#/register
                        templateUrl: 'views/register.html', // location of the View template i.e. the HTML
                        controller: 'RegisterCtrl', // found in /scripts/controllers/register.js
                        controllerAs: 'register', // name of the controller, used in the views
                        animation: 'slide' // what transition animation should this use
                    }
                )
                .when (
                    '/protected', { // user accesses index.html/#/about
                        templateUrl: 'views/protected.html', // location of the View template i.e. the HTML
                        controller: 'ProtectedCtrl', // found in /scripts/controllers/protected.js
                        controllerAs: 'protected', // name of the controller, used in the views
                        animation: 'slide' // what transition animation should this use
                    }
                ).when (
                '/cart', { // user accesses index.html/#/cart
                    templateUrl: 'views/cart.html', // location of the View template i.e. the HTML
                    controller: 'CartCtrl', // found in /scripts/controllers/cart.js
                    controllerAs: 'cart', // name of the controller, used in the views
                    animation: 'slide' // what transition animation should this use

                }
            ).when (
                '/checkout', { // user accesses checkout.html/#/checkout
                    templateUrl: 'views/checkout.html', // location of the View template i.e. the HTML
                    controller: 'CheckoutCtrl', // found in /scripts/controllers/checkout.js
                    controllerAs: 'checkout', // name of the controller, used in the views
                    animation: 'slide' // what transition animation should this use

                }
                )
                .otherwise ( // user accesses any other location not defined above, catch-all
                    {
                        redirectTo: '/home'
                    }
                );
        }
        /*
         * Handles the cart calculations and acts as a container
         * Handles modifiying of the card on most pages
         * Displays number of items onto the Navbar
         */
    ).factory('mySharedService', ['$rootScope', function () {

        var sharedService = {}; //The service array
        sharedService.itemList = []; //List of items in the card

        /**
         * Saves the items in the cart
         */
        sharedService.saveState = function () {
            if (sharedService.itemList != null) //If the itemList is not null then save cart to session
                sessionStorage.userService = angular.toJson(sharedService.itemList); //Save cart to session
        }

        /**
         * Retrives cart from session storage
         */
        sharedService.restoreState = function () {
            var loaded = angular.fromJson(sessionStorage.userService); //Loads cart from session storage
            if (loaded != null) { //If the loaded data was not null
                sharedService.itemList = angular.fromJson(sessionStorage.userService); //Set item list in cart to the loaded data
            }
        }

        sharedService.restoreState(); //Restores state of cart on init

        /*
         * Gets sub-total of only the items
         */
        sharedService.getItemTotal = function () {
            var total = 0.00; //Total = 0.00 at start
            for (var i = 0; i < sharedService.getItemList().length; i++) { //Loop through list
                total += sharedService.getItemList()[i].price * sharedService.getItemList()[i].amount; //Add item[i] amount * price to total
            }
            return total; //Returns the total
        }


        /**
         * Returns the delivery total of the sharedService.itemList
         **/
        sharedService.getDeliveryTotal = function () {
            var total = 0.00; //Start total
            for (var i = 0; i < sharedService.getItemList().length; i++) { //Loop through itemList
                total += sharedService.getItemList()[i].delivery; //Add itemList[i].delivery to total
            }
            return total; //Return total
        }

        /**
         * Gets the whole total cost (delivery total + the item total)
         **/
        sharedService.getSubTotal = function () {
            var total = this.getDeliveryTotal() + this.getItemTotal();
            return total;
        }

        /**
         * Gets the itemList from the shared service
         **/
        sharedService.getItemList = function () {
            return sharedService.itemList;
        }

        /**
         * @param item The item to add to itemList
         * Adds item to itemList
         **/
        sharedService.addItem = function (item) {
            this.itemList.push(item); //Adds item
            sharedService.saveState(); //Saves state
        };

        /**
        * @item Item to get returns the item in the item_list
         *This method gets the item from another source and compares the names of the item,
         * if they are in the item list then the object in the item list is returned if not a null is returned
        **/
        sharedService.get = function (item) {
            if (sharedService == null) {
                return null;
            }

            //Loop through item list
            for (var i = 0; i < this.itemList.length; i++) {
                //If the names are equal then return the itemList[i] object
                if (this.itemList[i].name == item.name) {
                    return this.itemList[i];
                }
            }
            return null; //Return null (nothing found)
        };

        //Gets the cart size
        sharedService.getCartSize = function () {
            return this.itemList == null ? 0 : this.itemList.length; //If itemList is null then return 0 otherwise return itemList.length
        };

        //Get total for specific item
        sharedService.totalForItem = function (item) {
            var itemInList = this.get(item); //Gets the item variable in list
            if (itemInList == null) { //Item is not found in list
                return 0;
            } else {
                return itemInList.price * itemInList.amount; //If item is found in list return price * amount.
            }
            return 0;
        };


        //Clear item list
        sharedService.clear = function () {
            sharedService.itemList = [];
            sharedService.saveState()
        };

        /**
         * @param item Item to remove
         * Removes item from itemList
         **/
        sharedService.removeItem = function (item) {
            if (sharedService == null) {
                return;
            }
            for (var i = 0; i < this.itemList.length; i++) { //Loop through item list
                if (this.itemList[i].name == item.name) { //Check the name of item if they are equals
                    this.itemList.splice(i, 1); //Remove item from list
                    sharedService.saveState(); //Save the list
                }
            }
        };

        /**
         * @param item The item to add
         * Adds item to cart
         **/
        sharedService.addItem = function (item) {
            var cartItem = sharedService.get(item); //Gets the item object to see if it is already in cart
            if (cartItem == null) { //If there is no item of such in cart
                this.itemList.push(item); //Add the item
            } else { //If object exists
                var index = this.itemList.indexOf(cartItem);  //Get item from the list
                cartItem.amount += item.amount; //increment the amount which is usually one unless any other argument specified

            }
            sharedService.saveState(); //Saves the itemList
        };


        return sharedService;
    }]).directive('tooltip', function () { //Tooltip directive
        return {
            restrict: 'A', //Restrict to <a> variables inside html
            link: function (scope, element, attrs) { //Link the function with the directive
                $(element).hover(function () { //on mouse hovers, show tooltip
                    $(element).tooltip('show');
                }, function () { //Otherwise on mouse leave hide tooltip
                    $(element).tooltip('hide');
                });
            }
        };
    }).directive('slideable', function () { //Directive slideable (Source: http://jsfiddle.net/3sVz8/19/)
            return {
                restrict: 'C',
                compile: function (element, attr) {
                    // wrap tag
                    var contents = element.html();
                    element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

                    return function postLink(scope, element, attrs) {
                        // default properties
                        attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
                        attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                        element.css({
                            'overflow': 'hidden',
                            'height': '0px',
                            'transitionProperty': 'height',
                            'transitionDuration': attrs.duration,
                            'transitionTimingFunction': attrs.easing
                        });
                    };
                }
            };
        })
        .directive('slideToggle', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var target = document.querySelector(attrs.slideToggle);
                    attrs.expanded = false;
                    element.bind('click', function () {
                        var content = target.querySelector('.slideable_content');
                        if (!attrs.expanded) {
                            content.style.border = '1px solid rgba(0,0,0,0)';
                            var y = content.clientHeight;
                            content.style.border = 0;
                            target.style.height = y + 'px';
                        } else {
                            target.style.height = '0px';
                        }
                        attrs.expanded = !attrs.expanded;
                    });
                }
            }
        })

        .controller('CardCtrl', ['$scope', function ($scope) {
        }])

        .directive('card', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                scope: {
                    cardContainer: '@', // required
                    width: '@',
                    placeholders: '=',
                    options: '=',
                    messages: '=',
                },
                controller: 'CardCtrl',
                link: function (scope, element, attributes, cardCtrl) {
                    var defaultPlaceholders = {
                        number: '•••• •••• •••• ••••',
                        name: 'Full Name',
                        expiry: '••/••',
                        cvc: '•••'
                    };
                    var defaultMessages = {
                        validDate: 'valid\nthru',
                        monthYear: 'month/year',
                    };
                    var defaultOptions = {
                        debug: false,
                        formatting: true
                    };

                    var placeholders = angular.extend(defaultPlaceholders, scope.placeholders);
                    var messages = angular.extend(defaultMessages, scope.messages);
                    var options = angular.extend(defaultOptions, scope.options);

                    var opts = {
                        form: '[name="' + attributes.name + '"]',

                        // a selector or jQuery object for the container
                        // where you want the card to appear
                        container: scope.cardContainer, // *required*

                        formSelectors: {},

                        width: scope.width || 350,

                        // Strings for translation - optional
                        messages: {
                            validDate: messages.validDate,
                            monthYear: messages.monthYear
                        },

                        // Default placeholders for rendered fields - options
                        placeholders: {
                            number: placeholders.number,
                            name: placeholders.name,
                            expiry: placeholders.expiry,
                            cvc: placeholders.cvc
                        },

                        formatting: options.formatting, // optional - default true
                        debug: options.debug // if true, will log helpful messages for setting up Card
                    };

                    if (cardCtrl.numberInput && cardCtrl.numberInput.length > 0) {
                        opts.formSelectors.numberInput = 'input[name="' + cardCtrl.numberInput[0].name + '"]';
                    }
                    if (cardCtrl.expiryInput && cardCtrl.expiryInput.length > 0) {
                        opts.formSelectors.expiryInput = 'input[name="' + cardCtrl.expiryInput[0].name + '"]';
                    }
                    if (cardCtrl.cvcInput && cardCtrl.cvcInput.length > 0) {
                        opts.formSelectors.cvcInput = 'input[name="' + cardCtrl.cvcInput[0].name + '"]';
                    }
                    if (cardCtrl.nameInput && cardCtrl.nameInput.length > 0) {
                        opts.formSelectors.nameInput = 'input[name="' + cardCtrl.nameInput[0].name + '"]';
                    }

                    new Card(opts);
                }
            };
        }])

        .directive('cardNumber', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '='
                },
                require: [
                    '^card',
                    'ngModel'
                ],
                link: function (scope, element, attributes, ctrls) {
                    var cardCtrl = ctrls[0];
                    cardCtrl.numberInput = element;
                    scope.$watch('ngModel', function (newVal, oldVal) {
                        if (!oldVal && !newVal) {
                            return;
                        }
                        if (oldVal === newVal && !newVal) {
                            return;
                        }

                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent('keyup', false, true);
                        element[0].dispatchEvent(evt);
                    });
                }
            };
        }])

        .directive('cardName', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '='
                },
                require: [
                    '^card',
                    'ngModel'
                ],
                link: function (scope, element, attributes, ctrls) {
                    var cardCtrl = ctrls[0];
                    cardCtrl.nameInput = element;
                    scope.$watch('ngModel', function (newVal, oldVal) {
                        if (!oldVal && !newVal) {
                            return;
                        }
                        if (oldVal === newVal && !newVal) {
                            return;
                        }

                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent('keyup', false, true);
                        element[0].dispatchEvent(evt);
                    });
                }
            };
        }])

        .directive('cardExpiry', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '='
                },
                require: [
                    '^card',
                    'ngModel'
                ],
                link: function (scope, element, attributes, ctrls) {
                    var cardCtrl = ctrls[0];
                    cardCtrl.expiryInput = element;
                    scope.$watch('ngModel', function (newVal, oldVal) {
                        if (!oldVal && !newVal) {
                            return;
                        }
                        if (oldVal === newVal && !newVal) {
                            return;
                        }

                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent('keyup', false, true);
                        element[0].dispatchEvent(evt);
                    });
                }
            };
        }])

        .directive('cardCvc', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '='
                },
                require: [
                    '^card',
                    'ngModel'
                ],
                link: function (scope, element, attributes, ctrls) {
                    var cardCtrl = ctrls[0];
                    cardCtrl.cvcInput = element;
                    scope.$watch('ngModel', function (newVal, oldVal) {
                        if (!oldVal && !newVal) {
                            return;
                        }
                        if (oldVal === newVal && !newVal) {
                            return;
                        }

                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent('keyup', false, true);
                        element[0].dispatchEvent(evt);
                    });
                }
            };
        }]);

})
(window, window.document, window.Card, window.angular);

