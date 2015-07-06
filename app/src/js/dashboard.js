$(document).ready(function() {
	// Offer Panel functions
	var txt = ['Top ', 'New ', ' (Network)'],
		n = txt.length + 1;
	$swap = [$('#swap1'), $('#swap2')],
	$span = [],
	c = 0;
	// create spans inside span
	for (var i = 0; i < 2; i++) {
		$swap[0].append($('<span />', {
			text: txt[i]
		}));
	}
	$swap[1].append($('<span />', {
		text: txt[i]
	}));
	// hide and collect spans
	$span[0] = $('span', $swap[0]).hide();
	$span[1] = $('span', $swap[1]).hide();

	// shifts header base 
	function shift(n, flag) {
		var $width;
		var options = {
			duration: 600
		};
		switch (flag) {
			case 0:
				$width = 0;
				break;
			case 1:
				$width = $span[n].eq(0).width();
				break;
		}

		$swap[n].animate({
			width: $width
		});
		(flag == 1) ? $span[n].stop().fadeIn(options) : $span[n].stop().fadeOut(options);
	}

      // Initialize initial prefix before header base
	$swap[0].animate({
		width: $span[0].eq(0).width()
	});
      $span[0].eq(0).delay(200).fadeIn('fast');

	$('.optn-btn').click(function() {
		c = ++c % n;
		console.log(c);
		$(this).toggleClass('rotated');
		$swap[0].animate({
			width: $span[0].eq(c % 2).width()
		});
		$span[0].stop().fadeOut('fast').eq(c % 2).delay(200).fadeIn('fast');
		if (c > 1) {
			// change color of offer panel to red
			console.log('adding network');
			$(this).closest('.offer-box').addClass('network');
			shift(1, 1);
		} else {
			console.log('removing network');
			$(this).closest('.offer-box').removeClass('network');
			shift(1, 0);
		}
		$('#top-offer-list').toggleClass('hidden');
		$('#new-offer-list').toggleClass('hidden');
	});
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
});
