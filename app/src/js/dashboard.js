$(document).ready(function() {
    $('.menu-btn').click(function() {
        var notThisOne = $(this);

        $('.menu-btn').each(function() {
            // ensures only one dropdown is active at any given time
            if ($(this).attr('id') !== notThisOne.attr('id')) {
                $(this).next('.menu').slideUp();
            } else {
                $(event.currentTarget).next('.menu').slideToggle();
            }
        });

    });
});