var someGame = angular.module('someGame',['ui.router']);
//ui router config
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

someGame.controller('boardController', ['$scope', 'gameData',
    function ($scope, gameData) {
        $scope.playerActiveBar = 3;
        $scope.myBoard = {};

        //must create server on new session and make tabs active to active players
        $scope.tables = gameData.getRandomRaceMatrix();



        //structure fo table
        $scope.table = {
            resources: {
                wood: 99,
                stone: 99,
                tomato: 99,
                gold: 99,
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
        $scope.table.hand = gameData.getCards();
        console.log($scope.table.hand);
        //$scope.table.hand = [
        //    {id: 1, race: 'rome', type: "production", name: 'name1'},
        //    {id: 2, race: 'japanese', type: "production", name: 'name22'},
        //    {id: 3, race: 'barbarian', type: "feature", name: 'name33'},
        //    {id: 4, race: 'barbarian', type: "feature", name: 'name44'},
        //    {id: 5, race: 'barbarian', type: "action", name: 'name55'}
        //];

        $scope.buildIt = function(card) {
            //watch for free foundation and resources
            if($scope.table.resources.wood >= card.cost.wood && $scope.table.resources.stone >= card.cost.stone && $scope.table.resources.tomato >= card.cost.tomato){
                //enough resources
                if ($scope.table.resources.foundation != 0) {
                    //choose in which category placed
                    //delete obj from hand and place to buildings
                    if (card.type == "production") {
                        $scope.table.buildings.production.push($scope.table.hand.splice($scope.table.hand.indexOf(card), 1));
                    } else if(card.type == "feature") {
                        $scope.table.buildings.feature.push($scope.table.hand.splice($scope.table.hand.indexOf(card), 1));
                    } else {
                        $scope.table.buildings.action.push($scope.table.hand.splice($scope.table.hand.indexOf(card), 1));
                    }

                    //take res from board
                    $scope.table.resources.wood -= card.cost.wood;
                    $scope.table.resources.stone -= card.cost.stone;
                    $scope.table.resources.tomato -= card.cost.tomato;
                    $scope.table.resources.foundation -= 1;

                    //if has building bonus - act it
                    if (card.hasOwnProperty('buildingBonus')) {
                        //do something
                    }
                } else {
                    //not have foundation
                    //if need - create on selected card
                    console.log('not has foundation');
                }
            } else if ($scope.table.resources.gold > 0) {
                //ask to use gold
                console.log('not has res, but has '+$scope.table.resources.gold+' gold');
            } else {
                console.log('not has res');
            }
        }
}]);

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

someGame.factory('gameData', function(){
    raceArray = ["barbarian","rome","japanese","egypt"];
    var testCardObj = {
        id: 1,      //unique for every card. Set at server
        race: "japanese",
        name: "NINJAS",
        type: "action",
        color: "pink",
        copyInDeck: 2,
        deal: "tomato",
        cost: {
            wood: 2,
            stone: 2,
            tomato: 2,
            foundation: true
        },
        raze: {
            humans: 2,
            wood: 2,
            stone: 2,
            tomato: 2,
            exp: 2,
            card: 2
        },
        action: {
            func: "тут комманда для сервака",
            cost: {
                humans: 1,
                gold: 0,
                lambert: 0,
                stone: 0,
                apples: 0
            }
        },
        buildingBonus: {
            func: "тут комманда для сервака",
            resources: {
                humans: 2,
                gold: 0,
                lambert: 0,
                apples: 0,
                stone: 0
            }
        }
    };
    return {
        getCards: function() {
            return [
                testCardObj,
                testCardObj,
                testCardObj,
                testCardObj,
                testCardObj,
                testCardObj
            ];
        },
        //Fisher-Yates Shuffle
        getRandomRaceMatrix: function () {
            var copy = [], n = raceArray.length, i;

            // While there remain elements to shuffle
            while (n) {
                // Pick a remaining element
                i = Math.floor(Math.random() * raceArray.length);
                // If not already shuffled, move it to the new array
                if (i in raceArray) {
                    copy.push(raceArray[i]);
                    delete raceArray[i];
                    n--;
                }
            }
            console.log(copy);
            return copy;
        }
    }
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