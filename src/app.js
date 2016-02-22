var someGame = angular.module('someGame',[]);

someGame.controller('boardController', function ($scope) {
    $scope.raceNumber = [1, 2, 3, 4];
    $scope.showTableRace = function(index) {
        console.info('.table-race' + index);
        //siblings work uncorrect
        //accordeon not work successful
        $scope.clickedRace =  $('.race' + index);
        $scope.clickedRace.toggleClass('active-race-bar');
        $scope.clickedRace.siblings().removeClass('active-race-bar');

        $scope.clickedTable = $('.table-race' + index);
        $scope.clickedTable.toggleClass('table-show-race'+index);
        $scope.clickedTable.siblings().removeClass("table-show-race1", "table-show-race2", "table-show-race3" ,"table-show-race4");
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