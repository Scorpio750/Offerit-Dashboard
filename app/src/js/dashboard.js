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

      var   txt = ['Top ', 'New '],
            n = txt.length;
            $swap = $('#swap'),
            $span = undefined,
            c = -1;

      // create spans inside span
      for (var i = 0; i < txt.length; i++) {
            $swap.append($('<span />', {text:txt[i]}));
      }
      // hide and collect spans
      $span = $('span', $swap).hide();

      $('.optn-btn').click(function() {
          $(this).toggleClass('rotated');

          c = ++c % n;
          $swap.animate({width: $span.eq( c ).width() });
          $span.stop().fadeOut().eq(c).delay(200).fadeIn();

          $('#top-offer-list').toggleClass('hidden');
          $('#new-offer-list').toggleClass('hidden');
    });
});