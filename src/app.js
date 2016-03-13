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
    $scope.setID = function(card) {
        if ($scope.boardActiveCard == card) {
            $scope.boardActiveCard = undefined;
        }
        else {
            $scope.boardActiveCard = card;
        }
        console.log($scope.boardActiveCard);
    };
});

someGame.controller('boardController', ['$scope', 'gameData',
    function ($scope, gameData) {
        $scope.playerActiveBar = 3;
        //must create server on new session and make tabs active to active players
        $scope.tables = gameData.getRandomRaceMatrix();
    }]);

someGame.controller('tableController', ['$scope', 'gameData',
    function ($scope, gameData) {

        $scope.myBoard = {
            playerId: ""
        };
        $scope.resMatrix = [];
        $scope.dealProduction = {
            wood: 0,
            stone: 0,
            tomato: 0,
            gold: 0,
            humans: 0,
            sword: 0,
            shield: 0,
            foundation: 0,
            exp: 0,
            card: 0,
            changeDealRes: function(res, type) {
                for (key in $scope.dealProduction) {
                    if (key == res && type == "add")
                        $scope.dealProduction.key += 1;
                    if (key == res && type == "remove")
                        //cannot be less that zero
                        $scope.dealProduction.key -= 1;
                }
            }
        };

        //structure fo table
        $scope.table = {
            id: "",
            race: "",
            resources: {
                wood: 99,
                stone: 99,
                tomato: 99,
                gold: 99,
                humans: 99,
                sword: 99,
                shield: 1,
                foundation: 10,
                exp: 0
            },
            buildings: {
                trades: [],
                production: [],
                feature: [],
                action: []
            },
            hand: {}
        };
        //not use. in development
        //$scope.changeTableRes = function(res, count, operationType) {
        //    for (key in $scope.table.resources) {
        //        if (key == res && operationType == "add")
        //            $scope.table.resources.key += count;
        //        if (key == res && operationType == "remove") {
        //            if ($scope.table.resources.key - count >= 0) {
        //                $scope.table.resources.key -= count;
        //                return true;
        //            } else {
        //                console.log('not enough '+ res);
        //                return false;
        //            }
        //        }
        //    }
        //};

        //need rework this code. receive race of table
        //$scope.table.race = "rome";
        console.log($scope.table.race);

        //create matrix to display resources keys
        for (key in $scope.table.resources) {
            $scope.resMatrix.push(key);
        }
        console.log($scope.resMatrix);

        //received from server
        $scope.table.hand = gameData.getCards();

        $scope.buildIt = function(card) {
            //watch for free foundation and resources
            if($scope.table.resources.wood >= card.cost.wood && $scope.table.resources.stone >= card.cost.stone && $scope.table.resources.tomato >= card.cost.tomato){
                //enough resources
                if ($scope.table.resources.foundation != 0) {
                    //choose in which category placed
                    //delete obj from hand and place to buildings
                    if (card.type == "production") {
                        $scope.table.buildings.production.push($scope.table.hand.splice($scope.table.hand.indexOf(card), 1)[0]);
                    } else if(card.type == "feature") {
                        $scope.table.buildings.feature.push($scope.table.hand.splice($scope.table.hand.indexOf(card), 1)[0]);
                    } else {
                        $scope.table.buildings.action.push($scope.table.hand.splice($scope.table.hand.indexOf(card), 1)[0]);
                    }
                    //take res from board
                    $scope.table.resources.wood -= card.cost.wood;
                    $scope.table.resources.stone -= card.cost.stone;
                    $scope.table.resources.tomato -= card.cost.tomato;
                    $scope.table.resources.foundation -= 1;

                    //deacticate card
                    $scope.setID();

                    card.builded = true;

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
            console.log('builded' ,$scope.table.buildings.action);
        };

        $scope.razeMyCard = function(card) {
            if (card.raze && $scope.table.resources.sword >= 1) {
                //add res to board
                $scope.table.resources.wood += card.raze.wood;
                $scope.table.resources.stone += card.raze.stone;
                $scope.table.resources.tomato += card.raze.tomato;
                $scope.table.resources.gold += card.raze.gold;
                $scope.table.resources.humans += card.raze.humans;
                $scope.table.resources.exp += card.raze.exp;

                for (var i = 0; i < card.raze.card; i++) {
                    //getNewCard();
                }

                $scope.table.hand.splice($scope.table.hand.indexOf(card), 1);
                console.log('razed');

            } else {
                console.log('not enough sword');
            }
        };

        //restruct it
        $scope.razeEnemyCard = function(targetCard) {
            if (targetCard.builded && targetCard.raze) {
                if ((targetCard.protect || targetCard.samurai ) && $scope.table.resources.sword >= 3) {
                    $scope.table.resources.sword -= 3;
                } else if (targetCard.protect && targetCard.samurai && $scope.table.resources.sword >= 4) {
                    $scope.table.resources.sword -= 4;
                } else if ((!targetCard.protect || !targetCard.samurai ) && $scope.table.resources.sword >= 2) {
                    $scope.table.resources.sword -= 2;
                } else {
                    console.info('not enough sword');
                }
            }
        };

        $scope.makeDeal = function(card) {
            if($scope.table.resources.tomato >= 1) {
                $scope.table.resources.tomato -= 1;

                //removed card from hand to trades
                $scope.table.buildings.trades.push($scope.table.hand.splice($scope.table.hand.indexOf(card), 1)[0]);
                $scope.dealProduction.changeDealRes(card.deal, "add");
                console.log('dealed');
            } else if($scope.table.resources.gold >= 1) {
                console.log('ask to use gold');
                if (answer == true) {

                    $scope.table.resources.gold -= 1;

                    //removed card from hand to trades
                    $scope.table.buildings.trades.push($scope.table.hand.splice($scope.table.hand.indexOf(card), 1)[0]);
                    $scope.dealProduction.changeDealRes(card.deal, "add");
                    console.log('dealed');
                }
            } else {
                console.info('not enough sword');
            }
            //deacticate card
            $scope.setID();
        };
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
    //THIS DATA MUST TAKEN FROM SERV
    var raceArray = ["barbarian","rome","japanese","egypt"];
    function getCard(id, type) {
        return {
            id: id,      //unique for every card. Set at server
            race: "japanese",
            name: "NINJAS",
            type: type,
            color: "pink",
            copyInDeck: 2,
            deal: "tomato",
            protect: false,
            samurai: false,
            builded: false,
            buildedBy: "",
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
                gold: 2,
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
    }

    return {
        getCards: function() {
            return [
                getCard(1, "production"),
                getCard(2, "production"),
                getCard(3, "feature"),
                getCard(4, "feature"),
                getCard(5, "action"),
                getCard(6, "action")
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