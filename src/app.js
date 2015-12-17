$('.cards .card').draggable({
    revert: 'invalid'
});

$('.row').droppable({
    activeClass: 'drop-active',
    hoverClass: 'drop-hover',

    accept: '.card',
    drop: function( event, ui ) {
        $(ui.helper)
            .removeAttr('style')
            .draggable( 'disable' )
            .removeClass('ui-draggable ui-draggable-handle')
            .appendTo($(this));
        
    }
});