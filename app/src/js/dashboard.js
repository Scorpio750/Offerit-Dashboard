$(document).ready(function() {
	$('.menu-btn').click(function() {
		var notThisOne = $(this);
		$('.menu-btn').each(function() {
            // ensures only one dropdown is active at any given time
            if ($(this).attr('id') !== notThisOne.attr('id')) {
            	$(this).next('.menu').slideUp({ 
            		duration: 300,
            		easing: "swing" 
            	});
            } else {
            	$(event.currentTarget).next('.menu').slideToggle({ 
            		duration: 300,
            		easing: "swing" 
            	});
            }
        });
	});
	$('.optn-btn').click(function() {
		$(this).css({
			transform: 'rotateY(180deg)'
		});
		$('#top-o').toggleClass('hidden');	
		$('#new-o').toggleClass('hidden');	
		$('#top-offer-list').toggleClass('hidden');
		$('#new-offer-list').toggleClass('hidden');
	});
});