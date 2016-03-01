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
    //$scope.myEl = angular.element(document.querySelectorAll(".card"));
    //console.info($scope.myEl);
    $scope.cards = [
        {id: 1, race: 'rome', name: 'name1'},
        {id: 2, race: 'japanese', name: 'name22'},
        {id: 3, race: 'barbarian', name: 'name33'},
        {id: 4, race: 'barbarian', name: 'name44'},
        {id: 5, race: 'barbarian', name: 'name55'}
    ];
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