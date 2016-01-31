'use strict';

/**
 * @ngdoc function
 * @name myApp.controller:BrowseCtrl
 * @description
 * # BrowseCtrl
 * Controller of the myApp
 */

var app = angular.module ( 'myApp' );
    app.controller (
    'BrowseCtrl', function ($scope, $http, $localStorage, mySharedService)
    {
        $scope.storage = $localStorage; //Sets storage

        //Gets file on file server located via shop.json
        $http.get('scripts/data/shop.json').then(function(res){
            $scope.products = res.data; //Products of the json file
        });

        $scope.addFruitToCart = function(item) { //Add fruit to card
            mySharedService.addItem(item); //the shared service which handles the card will be alerted a item will be added
        }

        //Hide products by default
        $scope.IsHidden = true;

        //Button on ng-click Shows the fruit
        $scope.ShowHide = function (product) {
            //If DIV is hidden it will be visible and vice versa.
            product.isHidden = !product.isHidden;
        }

    }
);



