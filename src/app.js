var someGame = angular.module('someGame',[]);

someGame.controller('boardController', function ($scope) {
    $scope.raceNumber = [1, 2, 3, 4];
    $scope.showTableRace = function(index) {
        console.info('.table-race' + index);
        $('.table-race' + index).toggleClass('table-show-race'+index, 'table-hide-race'+index);
    };
});
someGame.factory('gameData', function(){

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