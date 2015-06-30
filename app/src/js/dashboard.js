$(document).ready(function() {
    $('.menu-btn').click(function() {
        var notThisOne = $(this);

        $('.menu-btn').each(function() {
            // ensures only one dropdown is active at any given time
            if ($(this).attr('id') !== notThisOne.attr('id')) {
                $(this).next('.menu').slideUp({ easing: "swing" });
            } else {
                $(event.currentTarget).next('.menu').slideToggle({ easing: "swing" });
            }
        });

    });

    $('#h_chart-btn').hover(function() {
    	$(this).find('fa-stack-1x').removeClass('fa-bars').addClass('fa-bar-chart');
    });
});