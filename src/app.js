var someGame = angular.module('someGame',['ui.router']);

someGame.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("menu");

    $stateProvider
        .state('menu', {
            url: "/menu",
            templateUrl: "templates/MenuTemplate.html"
        })
        .state('play', {
            url: "/play",
            templateUrl: "templates/BoardTemplate.html"
        })
});

someGame.controller('mainController', function ($scope) {

    $scope.setID = function(id) {
        if ($scope.boardActiveCard == id) {
            $scope.boardActiveCard = undefined;
        }
        else {
            $scope.boardActiveCard = id;
        }
    };
});

someGame.controller('boardController', ['$scope',
    function ($scope) {
        $scope.playerActiveBar = 3;
        $scope.myBoard = {};
        //structure fo table
        $scope.table = {
            resources: {
                wood: 99,
                stone: 9,
                gold: 99,
                tomato: 99,
                humans: 99,
                sword: 99,
                shield: 1,
                foundation: 10
            },
            buildings: {
                production: [],
                feature: [],
                action: []
            },
            hand: {}
        };
        //received from server
        $scope.table.hand = [
            {id: 1, race: 'rome', type: "production", name: 'name1'},
            {id: 2, race: 'japanese', type: "production", name: 'name22'},
            {id: 3, race: 'barbarian', type: "feature", name: 'name33'},
            {id: 4, race: 'barbarian', type: "feature", name: 'name44'},
            {id: 5, race: 'barbarian', type: "action", name: 'name55'}
        ];
        //$scope.testCardObj = {
        //    id: 1,      //unique for every card. Set at server
        //    name: "NINJAS",
        //    type: "action",
        //    race: "japanese",
        //    copyInDeck: 2,
        //    foundation: true,
        //    cost: {
        //        humans: 0,
        //        gold: 0,
        //        wood: 0,
        //        stone: 1,
        //        tomato: 0
        //    },
        //    action: {
        //        func: "тут комманда для сервака",
        //        cost: {
        //            humans: 1,
        //            gold: 0,
        //            lambert: 0,
        //            stone: 0,
        //            apples: 0
        //        }
        //    },
        //    buildingBonus: {
        //        resources: {
        //            humans: 2,
        //            gold: 0,
        //            lambert: 0,
        //            apples: 0,
        //            stone: 0
        //        },
        //        func: "тут комманда для сервака"
        //    }
        //};

        $scope.buildIt = function(card) {
            //delete obj from hand and place to buildings
            //watch for free foundation and resources
            //choose in which category placed
            if (card.type == "production") {
                $scope.table.buildings.production.push($scope.table.hand.splice($scope.table.hand.indexOf(card), 1));
            } else if(card.type == "feature") {
                $scope.table.buildings.feature.push($scope.table.hand.splice($scope.table.hand.indexOf(card), 1));
            } else {
                $scope.table.buildings.action.push($scope.table.hand.splice($scope.table.hand.indexOf(card), 1));
            }
            //if has building bonus - act it

            //console.log($scope.table.buildings.production,$scope.table.hand );

        }
}]);

someGame.factory('gameData', function(){

});

someGame.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.toggleClass(attrs.toggleClass);
            });
        }
    };
});

//$('.cards .card').draggable({
//    revert: 'invalid'
//});
//
//$('.row').droppable({
//    activeClass: 'drop-active',
//    hoverClass: 'drop-hover',
//
//    accept: '.card',
//    drop: function( event, ui ) {
//        $(ui.helper)
//            .removeAttr('style')
//            .draggable( 'disable' )
//            .removeClass('ui-draggable ui-draggable-handle')
//            .appendTo($(this));
//
//    }
//});